const path = require("path");
const http=require('http')
const express = require("express");
const hbs = require("hbs");
const chalk = require("chalk");
const socketio=require('socket.io');

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

    socket.on('message',(msg)=>
        {
            io.emit('show_msg',msg);
        })
    socket.broadcast.emit('show_msg','A new user has joined');
    socket.on('disconnect',()=>{
        io.emit('show_msg','A user has left!!')
    });
})


server.listen(3000, () => {
  console.log(chalk.blueBright("Server is listening at port 3000..."));
});

// server(emit) -> client (receive) - countUpdated
// client(emit) -> server (receive) - increment