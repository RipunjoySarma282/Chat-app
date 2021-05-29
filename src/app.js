const path = require("path");
const http=require('http')
const express = require("express");
const chalk = require("chalk");
const socketio=require('socket.io');
const Filter=require('bad-words')
const { generateMessage,generateLocationMessage } = require("./utils/messages");
const { addUser, removeUser,getUser,getUserInRoom } = require("./utils/users");



const app = express();
const server=http.createServer(app);
const io=socketio(server);


const publicdire = path.join(__dirname, "../public");
app.use("/public", express.static(publicdire));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,'../views/index.html'));
});


app.get('/chat.html',(req,res)=>
{
    res.sendFile(path.join(__dirname,('../views/chat.html')));
})


io.on('connection',(socket)=>{
    
    console.log(chalk.yellowBright("New Websocket connection"))

    socket.on("join", ({ username, room },callback) => {
        const {error,user}=addUser({id:socket.id,username,room});
        
        if(error)
            {
                return callback(error);
            }

        socket.join(user.room);
        socket.emit("show_msg", generateMessage("Admin","Welcome"));
        socket.broadcast.to(user.room).emit(
            "show_msg",
        generateMessage("Admin",`${user.username} has joined`)
    );
        callback();

      // io.to.emit, socket.broadcast.to.emit
    });

    socket.on('message',(msg,callback)=>
        {
            const user=getUser(socket.id);
            const filter=new Filter();

            if(filter.isProfane(msg))
                {
                    return callback('Profanity is not allowed!')
                }

            io.to(user.room).emit('show_msg',generateMessage(user.username,msg));

            callback()
        })    


    socket.on('sendLocation',(pos,callback)=>
        {
            const user = getUser(socket.id);
            io.to(user.room).emit(
              "LocationMessage",generateLocationMessage(user.username,`https://google.com/maps?q=${pos.lati},${pos.longi}`)
            );
            callback();
        })
    

    socket.on("disconnect", () => {
        const user=removeUser(socket.id);

        if(user)
            {
                io.to(user.room).emit("show_msg",generateMessage("Admin",`${user.username} has left!`));
            }
    });    
})


server.listen(3000, () => {
  console.log(chalk.blueBright("Server is listening at port 3000..."));
});