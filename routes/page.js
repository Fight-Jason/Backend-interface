var express = require('express');
var router = express.Router();

 // 分页接口
router.get('/', function(req, res, next) {
    var {db,query} = req;
    console.log(query)
    if(Object.keys(query).length !="2"){
        res.ajaxReturn(0, "err:查询条件必须是limit和page",null)
    }else{
        if(Number(query.limit)<=0){
            res.ajaxReturn(0, "err:查询条件limit必须要大于0",null)
        }else{
            var page = Number(query.page);
            var limit = Number(query.limit);
            if(page%1===0&&limit%1===0){
                // 在数据库查询
                db.collection("users").find({},{limit:limit,skip:page},function(err,result){
                    if(result.length>0){//查到了数据
                        res.ajaxReturn(1, "查询成功", null, result)
                    }else{
                        res.ajaxReturn(0, "没有查到数据", null) 
                    }
                })
            }else{
                res.end(
                    res.ajaxReturn(0, "err:必须传入参数,并且传入的参数必须是整数", null) 
                )
               
            }
        }
    }
});

module.exports = router;