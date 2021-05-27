const path = require("path");
const http=require('http')
const express = require("express");
const hbs = require("hbs");
const chalk = require("chalk");
const socketio=require('socket.io');
const Filter=require('bad-words')


const app = express();
const server=http.createServer(app);
const io=socketio(server);


app.set("view engine", "hbs");
const viewsdirec = path.join(__dirname, "../views");
const publicdire = path.join(__dirname, "../public");
app.set("views", viewsdirec);
app.use("/public", express.static(publicdire));

app.get("/", (req, res) => {
  res.render("index");
});


io.on('connection',(socket)=>{
    
    console.log(chalk.yellowBright("New Websocket connection"))

    socket.on('message',(msg,callback)=>
        {
            const filter=new Filter();

            if(filter.isProfane(msg))
                {
                    return callback('Profanity is not allowed!')
                }

            io.emit('show_msg',msg);

            callback();
        })

    socket.broadcast.emit('show_msg','A new user has joined');
    

    socket.on('disconnect',()=>{
        io.emit('show_msg','A user has left!!')
    }); 


    socket.on('sendLocation',(pos,callback)=>
        {
            io.emit('show_msg',`https://google.com/maps?q=${pos.lati},${pos.longi}`);
            callback();
        })
})


server.listen(3000, () => {
  console.log(chalk.blueBright("Server is listening at port 3000..."));
});