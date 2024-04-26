

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
   socket.on('msg', function(data){
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })
});
io.on("connection", (socket) => {
   socket.on("upload", (file, callback) => {
     console.log(file); // <Buffer 25 50 44 ...>
 
     // save the content to the disk, for example
     writeFile("/tmp/upload", file, (err) => {
       callback({ message: err ? "failure" : "success" });
     });
   });
 });


http.listen(3000, function(){
   console.log('listening on localhost:3000');
});