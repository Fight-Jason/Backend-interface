var express = require('express');
var router = express.Router();

// 更新接口
router.post('/',function(req,res,next){
    const {db,body} = req;
    var {username,mobile,email,data}=body;
    // 把传过来的条件放入一个空对象
    let account = {};
    if(data){
        if(username){
            account.username = username;
        }
        if(mobile){
            account.mobile = mobile;
        }
        if(email){
            account.email= email;
        }
        if(JSON.stringify(account)=="{}"){
            res.ajaxReturn(0,"err:请传入更新条件",null)// 如果没有传条件的话就报错，并且告诉用户需要传入条件
        }else{
            db.collection('users').update(account,{data},function(err,result){
                if(result.n == "1" &&result.nModified == "1"){
                    res.ajaxReturn(1,"更新成功",null,result)
                }else{
                    res.ajaxReturn(0,"err:没有匹配该数据",null,result)
                }
            })
        }

    }else{
        res.ajaxReturn(1,"更新失败,传入更新的数据",null)
    }
    

})

module.exports = router;