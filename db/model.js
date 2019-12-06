const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/chat',{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{  //用户名
        type:String,
        required:true
    },
    password:{  //密码
        type:String,
        required:true
    },
    type:{     //用户类型
        type:String,
        required:true
    },
    post:{    //岗位
        type:String
    },
    salary:{  //薪资
        type:String
    },
    company:{  //公司
        type:String
    },
    skill:{   //技能要求
        type:String
    },
    header:{  //头像
        type:String
    }
})

// 聊天内容存储
const chatSchema = new Schema({
    from:{  //发起聊天用户的id
        type:String,
        required:true
    },
    to:{   //接收用户的id
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    read:{
        type:Boolean,
        default:false
    },
    chat_id:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }
})

const UserModel = mongoose.model('user',userSchema)
const ChatModel = mongoose.model('chat',chatSchema)
exports.UserModel = UserModel
exports.ChatModel = ChatModel