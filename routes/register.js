var express = require('express');
var router = express.Router();

// 引入封装加密模块
const cyo = require('../lib/cyo')

// 验证正则
var validator = require('validator');

/* register logic */
router.post('/', function(req, res, next) {
    const { db } = req;

    // 用一个空数组来判断传过来的参数
    var Errors = []

    // Form Parameter
    var { username, email, mobile, password } = req.body

    // Judge is Eamil 
    if (email) {
        if (!validator.isEmail(email)) {
            Errors.push({
                email: "邮箱格式错误"
            })
        }
    } else {
        Errors.push({
            email: "邮箱不能为空"
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
                                }, (err, result) => {
                                    res.ajaxReturn(1, "注册成功", null)
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


})


module.exports = router;