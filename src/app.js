const path = require("path");
const http=require('http')
const express = require("express");
const chalk = require("chalk");
const socketio=require('socket.io');
const Filter=require('bad-words')
const { generateMessage,generateLocationMessage } = require("./utils/messages");



const app = express();
const server=http.createServer(app);
const io=socketio(server);


const publicdire = path.join(__dirname, "../public");
app.use("/public", express.static(publicdire));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,'../views/index.html'));
});

app.post("/",(req,res)=>
{
    res.sendFile(path.join(__dirname,"../views/chat.html"));
})


io.on('connection',(socket)=>{
    
    console.log(chalk.yellowBright("New Websocket connection"))

    socket.emit("show_msg", generateMessage('Welcome'));
    socket.broadcast.emit("show_msg", generateMessage("A new user has joined"));

    socket.on('message',(msg,callback)=>
        {
            const filter=new Filter();

            if(filter.isProfane(msg))
                {
                    return callback('Profanity is not allowed!')
                }

            io.emit('show_msg',generateMessage(msg));

            callback()
        })    

    socket.on('disconnect',()=>{
        io.emit("show_msg", generateMessage("A user has left!!"));
    });


    socket.on('sendLocation',(pos,callback)=>
        {
            io.emit(
              "LocationMessage",generateLocationMessage(`https://google.com/maps?q=${pos.lati},${pos.longi}`)
            );
            callback();
        })
})


server.listen(3000, () => {
  console.log(chalk.blueBright("Server is listening at port 3000..."));
});