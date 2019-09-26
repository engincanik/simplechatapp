$(function () {
    //bağlantıyı kurmak için
    var socket = io.connect('192.168.1.51:3000')

    var message = $("#message");
    var send_message = $("#send_message");
    var chatroom = $("#chatroom");
    var users = $('#users');
    var username = prompt('Please tell me your name');
    socket.emit('username', username);

    if (username == "" || username == null) window.location.reload(true)

    send_message.click(() => {
        if (!message.val() == "") {
            socket.emit('new_message', { message: message.val() })
            document.getElementById("message").value = "";
            typing = false;
            socket.emit('typing', typing)
        }
    })

    message.on('keydown', (e) => {
        if (e.which == 13) {
            if (!message.val() == "") {
                socket.emit('new_message', { message: message.val() })
                document.getElementById("message").value = "";
                typing = false;
                socket.emit('typing', typing)
            }
        }
        else{
            typing = true;
            socket.emit('typing', typing)
        }

    })

    socket.on("new_message", (data) => {
        console.log(data)
        chatroom.append("<p class='message'>" + data.username + ":" + data.message + "</p>")
    })

    socket.on('is_online', (data) => {
        chatroom.append($('<p>').html(data));
    });

    socket.on('user-list', (data) => {
        data.forEach(appendUser);

        
    })

    function appendUser(user){
        users.append($('<p>').html(user));    
    }

    socket.on('typing', (username) => {
        $('#feedback').append($('<p>')).html(username + ' is typing a message...')
    })

    socket.on('notTyping', () => {
        $('#feedback').html("");
    })


})