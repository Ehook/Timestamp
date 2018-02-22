var fs = require('fs');
var path = require('path');
var net = require('net')

     var server = net.createServer(function (socket) {
       var date = new Date(){
         date.getFullYear()
         date.getMonth()
         date.getDate()
         date.getHours()
         date.getMinutes()
       }
      socket.write(data) {
        console.log(process.argv[2])
      }
      socket.end(data){

      }
     })
     server.listen(8000)
