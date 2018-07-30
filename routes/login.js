var express = require('express');
var router = express.Router();

// 引入封装加密模块
const cyo = require('../lib/cyo')

// 验证正则
var validator = require('validator');
/* login logic */
router.post('/', function(req, res, next) {
    const { db } = req;
    var { account, password, isSave } = req.body
    var Errors = [];
    if (!account) {
        Errors.push({
            account: "账户不能为空"
        })
    }
    if (!password) {
        Errors.push({
            password: "密码不能为空"
        })
    }
    // 从客户端传过来的数据正确 做出判断
    if (Errors.length == 0) {
        // 封装账户密码判断方法
        function check(result) {
            // 判断账户条件
            if (result.length > 0) {
                // 加密客户端发送过来的登录密码 PS：加密格式必须和后台相同
                password = cyo.md5(password)
                    // 比较登录的密码和数据库的参数是否相同
                if (password === result[0]['password']) {
                    // 保存登录状态
                    req.session.user = result[0]
                        // 删除密码显示
                    delete result[0]['password']
                    res.ajaxReturn(1, "登录成功", null, result[0])
                } else {
                    Errors.push({
                        password: "该密码不正确"
                    })
                    res.ajaxReturn(0, '登录失败', Errors)
                }
            } else {
                Errors.push({
                    account: "该账户不存在或输入错误"
                })

                res.ajaxReturn(0, '登录失败', Errors)
            }
        }
        // Judge account
        if (validator.isEmail(account)) {
            db.collection('users').find({ email: account }, function(err, result) { // 1.Judge is Eamil
                check(result)
            })
        } else if (validator.isMobilePhone(account, 'zh-CN')) { //2.Judge isMobile
            db.collection('users').find({ mobile: account }, function(err, result) {
                check(result)
            })
        } else {
            db.collection('users').find({ username: account }, function(err, result) { //3.Judge is username
                check(result)
            })
        }

    } else {
        res.ajaxReturn(0, '登录失败', Errors)
    }
});

module.exports = router;