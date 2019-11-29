const md5 = require('blueimp-md5')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test',{useNewUrlParser:true,useUnifiedTopology:true})

const Schema = mongoose.Schema

const testSchema= new Schema({
    user:{
        type:String,
        required:true
    },
    pasw:{
        type:String,
        require:true
    }
})
// const testModel = mongoose.model('test',testSchema)
// function testSave() {
//     new testModel({
//         user:'tom',
//         pasw:md5('123')
//     }).save((err,data) => {
//         console.log('success',err,data)
//     })
// }
// testSave()
module.exports = mongoose.model('test',testSchema);