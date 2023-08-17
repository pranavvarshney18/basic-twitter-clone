 
 module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer,{
        cors: {
          origin: '*',
        }
      });


    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);


        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });
       
        //observer will receive request from user to join the room
        socket.on('join_room', function(data){
            console.log('joining request rec.', data);

            //joining the room, socket will search for this chatroom,
            //if it exist, then user will join,
            //if it does not exist, then observer will create one and then the user will join
            socket.join(data.chatroom);
            //telling everyone in the room that xyz user has joined
            io.in(data.chatroom).emit('user_joined', data);
        })
    });

 }