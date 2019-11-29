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

const UserModel = mongoose.model('user',userSchema)

exports.UserModel = UserModel;