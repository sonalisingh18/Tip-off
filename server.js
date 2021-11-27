/* Including Express */
const express = require('express');

/* Firing Express to Include Modules to app */
const app = express();

/* Adding path */
const path = require('path');

/* Setting Templating engine */
app.set('view engine' , 'ejs');

/* Setting up socket */
const server = require('http').createServer(app);
const io = require("socket.io")(server);
module.exports.io = io; //export io for other files to use
io.on('connection', (socket) =>{
    console.log("connected");
    socket.on('formchange', (sent)=>{
        io.emit(`/host${sent.roomid}`, sent.data);
    })
});

app.use(express.urlencoded({extended: true}));

/* Access to static files */
app.use(express.static(path.join(__dirname, '/public')));

/* Routes */
app.use('/', require('./routes/main.js'));

const port = process.env.PORT || 3000;

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
