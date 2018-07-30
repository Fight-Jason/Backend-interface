var express = require('express');
var router = express.Router();
// 引入封装加密模块
const cyo = require('../lib/cyo')

// 验证正则
var validator = require('validator');
// 增删查
/* GET users listing. */
router.post('/', function(req, res, next) {
    const { query, body, db, session } = req;
    // // 让用户登录 查看用户是不是管理员
    // if (session.user.role == 1) {

    // 添加用户的操作
    if (query.action == 'add') {
        let { username, email, mobile, password, sex, address } = body;
        let Errors = [];
        // Judge is Eamil 
        if (email) {
            if (!validator.isEmail(email)) {
                Errors.push({
                    email: "邮箱格式错误"
                })
            }
        } else {
            Errors.push({
                email: "不能为空"
            })
        }
        if (mobile) {
            // Judge is Phone
            if (!validator.isMobilePhone(mobile, 'zh-CN')) {
                Errors.push({
                    mobile: "手机格式错误"
                })
            }
        } else {
            Errors.push({
                mobile: "手机格式错误"
            })
        }
        // Judge is username
        if (!username) {
            Errors.push({
                username: "用户名不能为空"
            })
        }

        // Judge is password
        if (!password) {
            Errors.push({
                password: "密码不能为空"
            })
        } else {
            password = cyo.md5(password) //Password Encryption processing
        }

        // 从客户端传过来的数据正确 做出判断
        if (Errors.length == 0) {
            // Find Username
            db.collection('users').find({ username: username }, (err, result) => {
                // UsernameLength is Zero,Authentication is successful.
                if (result.length == 0) {
                    // Find Email
                    db.collection('users').find({ email: email }, (err, result) => {
                        // Email is Zero,Authentication is successful
                        if (result.length == 0) {
                            // Find mobile
                            db.collection('users').find({ mobile: mobile }, (err, result) => {
                                // mobile is Zero,Authentication is successful
                                if (result.length == 0) {
                                    // Add data to the database.
                                    db.collection('users').insert({
                                        username: username,
                                        email: email,
                                        mobile: mobile,
                                        password: password,
                                        address: '' || address,
                                        sex: '' || sex
                                    }, (err, result) => {
                                        let data = result.ops[0]
                                        res.ajaxReturn(1, "注册成功", null, data)
                                    })
                                } else {
                                    Errors.push({
                                        email: "该手机号已存在"
                                    })
                                    res.ajaxReturn(0, "注册失败", Errors)
                                }
                            })
                        } else {
                            Errors.push({
                                email: "该Email已存在"
                            })
                            res.ajaxReturn(0, "注册失败", Errors)
                        }
                    })
                } else {
                    Errors.push({
                        username: "该账号已存在"
                    })
                    res.ajaxReturn(0, "注册失败", Errors)
                }
            })
        } else {
            res.ajaxReturn(0, "注册失败", Errors)
        }
    }
    // 用户删除的操作
    if (query.action == 'remove') {
        let { username,mobile,email} = body;
        // 把传过来的条件放入一个空对象
        let account = {};
        if(username){
            account.username = username;
        }
        if(mobile){
            account.mobile = mobile;
        }
        if(email){
            account.email= email;
        }
        if(JSON.stringify(account) == '{}'){
            res.ajaxReturn(0,"err:请传入删除条件",null)
        }else{
            db.collection("users").remove(account,function(err,result){
                var data =result[1].result;
                console.log(result)
                if(data.n =="1"){ //n为1  数据库有该数据的时候
                    res.ajaxReturn(1,"删除成功",null,data)
                }else{
                    res.end( 
                        res.ajaxReturn(0,"err:没有该数据，删除失败",null)
                    )
                }
            })
        }
    }
    if (query.action == 'find') {
        // 查询所有数据
        var { search } = body
        if (search) {
            if (validator.isEmail(search)) {
                db.collection('users').find({ email: search }, function(err, result) {
                    res.ajaxReturn(1, "查询成功", null, result)
                })
            } else if (validator.isMobilePhone(search, 'zh-CN')) {
                db.collection('users').find({ mobile: search }, function(err, result) {
                    res.ajaxReturn(1, "查询成功", null, result)
                })
            } else {
                db.collection('users').find({ username: search }, function(err, result) {
                    res.ajaxReturn(1, "查询成功", null, result)
                })
            }
        } else {
            // remove:{$ne:true}
            db.collection('users').find({ remove: { $ne: true } }, function(err, result) {
                res.ajaxReturn(1, "查询成功", null, result)
            })
        }
    }
    // } else {
    //     res.ajaxReturn(1, "没有管理员权限", null)
    // }

});

module.exports = router;