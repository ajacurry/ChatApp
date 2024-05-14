var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', function(req, res){
   res.sendFile('JSUI.html', {root: '.'});
});
   
users = [];
io.on('connection', function(socket){
   console.log('A user is connecting');

   socket.on('setUsername', function(data){
      console.log(data);
      if(users.indexOf(data) > -1){
         socket.emit('userExists', data + ' Username already in use.');
      } else {
         users.push(data);
         socket.emit('userSet', {username: data});
      }
   });
   socket.on("donwloadfile", function(data){
      console.log(data);
   });
   socket.on('msg', function(data){
      io.sockets.emit('newmsg', data);
   });

   socket.on("upload", function(data){
     console.log(data); 
   
     
     fs.writeFile("./upload", data, (err) => {
       if (err) {
         console.error(err);
         socket.emit('uploadResult', { message: "failure" });
       } else {
         socket.emit('uploadResult', { message: "success" });
       }
     });
   });
});

http.listen(3000, function(){
   console.log('listening on localhost:3000');
});