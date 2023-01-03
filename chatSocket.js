let activeUsers = [];

exports.chatSocket = (app) => {
  const server = require("http").createServer(app);
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    console.log("socket conneted");

    // login
    socket.on("login", (data) => {
      const {userId,sellerId, role} = data;
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

      if(sellerId){
        socket.join(`SELLERS_TO_BUYERS_${sellerId}`)
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
    socket.on('disconnect', () => {
      activeUsers = activeUsers.filter(user => user.socketId !== socket.id);

      io.emit('active-users', activeUsers)
    })
  });
};
