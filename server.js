const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.static(path.join(__dirname, 'public')));

let users = {};

io.on('connection', socket => {
    console.log('User connected: ', socket.id);
    socket.on('register', (username) => {
        users[socket.id] = username;
        io.emit('update-users', Object.values(users));
    });

    socket.on('chat message', (messageData) => {
        const { message, to } = messageData;
        const sender = users[socket.id] || 'Anonymous';

        const sanitizedMessage = sanitize(message);

        if (to === 'All') {
            io.emit('chat message', { sender, message: sanitizedMessage, to });
        } else {
            const recipientSocketId = Object.keys(users).find(id => users[id] === to);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('chat message', { sender, message: sanitizedMessage, to });
                socket.emit('chat message', { sender, message: sanitizedMessage, to }); 
            }
        }
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('update-users', Object.values(users));
    });
});
function sanitize(input) {
    return input.replace(/[&<>"'/]/g, (char) => {
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '/': '&#x2F;',
        };
        return escapeMap[char] || char;
    });
}

server.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
