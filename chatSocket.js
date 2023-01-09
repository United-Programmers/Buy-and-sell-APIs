let activeUsers = [];

exports.chatSocket = (app) => {
  const server = require("http").createServer(app);
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    console.log("socket conneted");

    // login
    socket.on("login", (data) => {
      const {userId, role} = data;
      // check if user is already active
      if(!activeUsers.find(user => user.userId === userId)){
        activeUsers.push({
          userId: userId,
          socketId: socket.id
        })
      }

      if(role == 'seller'){
        socket.join('ADMIN_TO_SELLERS')
      }

      if(role === 'driver'){
        socket.join('ADMIN_TO_DRIVERS')
      }

      io.emit('active-users', activeUsers)
    })


    // send message 
    socket.on('send-message', (data) => {
      const {receiverId} = data;
      const user = activeUsers.filter(user => user.userId === receiverId);

      if(user){
        socket.to(user.socketId).emit('receive-message', data);
      }
    })


    // disconnect 
    socket.on('disconnect', (data) => {
      const {role} = data;
      activeUsers = activeUsers.filter(user => user.socketId !== socket.id);

      if(role == 'seller'){
        socket.leave('ADMIN_TO_SELLERS')
      }

      if(role === 'driver'){
        socket.leave('ADMIN_TO_DRIVERS')
      }

      io.emit('active-users', activeUsers)
    })
  });
};
