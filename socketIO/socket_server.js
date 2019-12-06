const {ChatModel} = require('../db/model')
module.exports = (server) => {
    const io = require('socket.io')(server)
        // 监视客户端与服务器的连接
    io.on('connection', function (socket) {
        console.log('有一个客户端连接上了服务器')
        // 绑定监听, 接收客户端发送的消息
        socket.on('sendMsg',(data) => {
            const {from,to,content} = data
            const chat_id = [from,to].sort().join('_')
            const time = Date.now()
            new ChatModel({from,to,content,chat_id,time}).save((err,data) => {
                if(err){
                    io.emit('receiveMsg',null)
                }else{
                    io.emit('receiveMsg',data)
                }
            })
        })
    })
}