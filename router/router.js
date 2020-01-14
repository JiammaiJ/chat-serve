const express = require('express')
const md5 = require('blueimp-md5')
const {UserModel,ChatModel,SosoModel} = require('../db/model')

const router = express.Router()
const filter = {password: 0, __v: 0}
//   注册
router.post('/register',(req,res) => {
    const {username,password,type} = req.body
    UserModel.findOne({username},(err,user) => {
        if(user){
            res.send({code:1,msg:'该用户已存在'})
        }else{
            new UserModel({
                username,
                type,
                password:md5(password)
            }).save((err,data) => {
                if(err){
                    res.send({
                        code:1,
                        msg:err.message
                    })
                }else{
                    const {username,_id,type} = data
                    res.cookie('userid', data._id, {maxAge: 1000*60*60})
                    res.send({
                        data:{username,_id,type},
                        code:0,
                        msg:'注册成功'
                    })
                }
            })
        }
    })
})

//   登录
router.post('/login',(req,res) => {
    const {username,password} =req.body
    UserModel.findOne({username,password:md5(password)},filter,(err,user) => {
        if(err){
            res.send({
                code:1,
                msg:err.message
            })
        }else if(user) {
            
            res.cookie('userid', user._id, {maxAge: 1000*60*60})
            res.send({
                data:user,
                code:0,
                msg:'登入成功'
            })
        }else {
            res.send({
                msg:'账号密码错误',
                code:1
            })
        }
    })
})

// 完善用户资料
router.post('/update',(req,res) => {
    const userid = req.cookies.userid
    if(!userid){
        res.send({
            code:1,
            msg:'未登入'
        })
    }else{
        UserModel.findByIdAndUpdate({_id:userid},req.body,(err,olduser) => {
           
            if(!olduser){
                res.send({
                    code:1,
                    msg:"error"
                })
            }else{
                const {username,type,_id} = olduser
                res.send({
                    code:0,
                    data:{...req.body,username,type,_id}
                })
            }
        })
    }
})

// 有cookie时，获取用户信息
router.get('/userinfo',(req,res) => {
    const userid = req.cookies.userid
    UserModel.findOne({_id:userid},filter,(err,data) => {
        if(!data){
            res.send({
                code:1,
                msg:'错误'
            })
        }else{
            res.send({
                code:0,
                msg:'登入成功',
                data:data
            })
        }
    })
})

// 根据类型查询所有用户
router.get('/userlist',(req,res) => {
    const {type} = req.query
    UserModel.find({type},filter,(err,userlist) => {
        if(err){
            res.send({
                code:1,
                msg:'系统错误'
            })
        }else{
            res.send({
                code:0,
                data:userlist,
                msg:'success'
            })
        }
    })
})

// 消息列表
router.get('/msglist',(req,res) => {
    const userid = req.cookies.userid
    UserModel.find((err,data) =>{
        const users = data.reduce((init,item) => {
            init[item._id] = {username:item.username,header:item.header}
            return init
        },{})
        ChatModel.find({'$or':[{from:userid},{to:userid}]},(err,data) => {
            if(data){
                res.send({
                    code:0,
                    msg:'success',
                    data:{
                        data:data,
                        users:users
                    }
                })
            } 
        })
    })
})

// 读取消息了,更改当前用户和聊天用户的read
router.post('/readmsg',(req,res) => {
    const {from,to} = req.body
    ChatModel.updateMany({from,to,read:false},{read:true},{multi: true},(err,data) => {
       if(data){
           res.send({
               code:0,
               data:data.nModified
           }).save((err,data) => {
            if(err){
                res.send({
                    code:1,
                    msg:'save error'
                })
            }else{
                res.send({
                    code:0,
                    msg:'success'
                })
            }
           })
       }
    })
})


// soso的接口
// 添加分类
router.post('/soso/addcategory',(req,res) => {
    const { parentId, name } = req.body
    new SosoModel({
        parentId,name
    }).save((err,data) => {
        if(err){
            res.send({
                msg:'save error',
                code:1
            })
        }else{
            res.send({
                msg:'success',
                code:0,
                data
            })
        }
    })
})
// 根据父类parentId 查找所有的子元素
router.get('/soso/getcategory',(req,res) => {
    const { parentId } = req.query
    SosoModel.find({parentId},(err,data) => {
        if(err){
            res.send({
                msg:'error',
                code:1,
            })
        }else{
            res.send({
                msg:'success',
                code:0,
                data
            })
        }
    })
})
// 根据_id删除元素 
// 如果parentID=0 删除全部的子元素
router.delete('/soso/deletecategory',(req,res) => {
    const { _id } = req.body
    SosoModel.deleteMany({'$or':[{_id},{parentId:_id}]},(err,data) => {
        if(err){
            res.send({
                msg:'error',
                code:1
            })
        }else{
            res.send({
                msg:'success',
                code:0,
                data
            })
        }
    })
})
// 根据_id修改名字
router.post('/soso/updatename',(req,res) => {
    const { _id, name } = req.body
    SosoModel.findByIdAndUpdate({_id},{name},(err,data) => {
        if(err){
            res.send({
                code:1,
                msg:'error'
            })
        }else{
            res.send({
                code:0,
                msg:'success',
                data
            })
        }
    })
})
module.exports=router;