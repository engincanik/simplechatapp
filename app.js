const express = require('express');
const app = express();


app.set('view engine','ejs');

//ara katmanlar
app.use(express.static('public'));

//site rotaları // anasayfada '/' Hello World yazdırıyoruz
app.get('/',(req,res) => {
    res.render('index');
})

//hangi port dinlenecek
server = app.listen(3000,'192.168.1.51');

//socket.io başlangıcı
const io = require('socket.io')(server);

var userlist = [];
//tüm bağlantıları dinlemek için
io.on('connection', (socket) => {
    console.log('New User Connected');
    
    socket.on('disconnect', () => {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
        userlist.remove('🔵' + socket.username)
        
    })
    
    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    socket.on('username', (username) => {
        socket.username = username;
        userlist.push('🔵' + username);
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat..</i>');
    })

    socket.on('username', () => {
        io.emit('user-list',userlist)
    })

    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', {username : socket.username, message : data.message, });
    })

    socket.on('typing', (data) => {
        if(data) socket.broadcast.emit('typing', socket.username)
        else socket.broadcast.emit('notTyping')
    })

})