const http = require('http')
const app = require('./app')
const server = http.createServer(app)
require('./socketIO/socket_server')(server)
server.listen(5000,() => {
    console.log('running 5000...')
})