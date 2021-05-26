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

let count=0;

io.on('connection',(socket)=>{
    console.log("New Websocket connection")

    socket.emit('countUpdated',count)

    socket.on('increment',()=>
        {
            count++;
            // socket.emit('countUpdated',count);
            io.emit("countUpdated", count);
        })
})

server.listen(3000, () => {
  console.log(chalk.blueBright("Server is listening at port 3000..."));
});

// server(emit) -> client (receive) - countUpdated
// client(emit) -> server (receive) - increment