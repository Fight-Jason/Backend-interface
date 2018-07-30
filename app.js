var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Import Modules
var db = require('./database/db')
var ajaxReturn = require('./lib/ajaxReturn')
var register = require('./routes/register')
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login')
var page = require('./routes/page')
var update = require('./routes/update')
var app = express();
var session = require('express-session')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(ajaxReturn)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 设置跨域请求问题
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"),
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next()
})

// cookie客户端，session服务端，使用加密模块 SessionID+随机数 生成的一个唯一浏览器客户表示id
app.use(session({
    secret: 'site', // 用来对session id相关的cookie进行签名
    resave: false, // 是否每次都重新保存会话，建议false
    saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
    cookie: { maxAge: 500 * 1000 } // maxAge cookie保存时间 有效期，单位是毫秒 cookie失效就需要再次登录
}))


app.use(express.static(path.join(__dirname, 'public')));

// Export Router Modules
app.use(db({
    database: "lemon"
}))
app.use('/', index);
app.use('/users', users);
app.use('/register', register)
app.use('/login', login)
app.use('/page', page)
app.use('/update',update)

module.exports = app;