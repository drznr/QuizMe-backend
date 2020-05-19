module.exports = connectSockets;

function connectSockets(io) {
    const clientsMap = {};

    io.on('connection', socket => {   
        socket.on('quiz player-connected', data => { 
            if (socket.quizId) {
                socket.leave(socket.quizId);
            }
            socket.join(data.quizId);
            socket.quizId = data.quizId;
            socket.user = data.user;
             
            if (!clientsMap[socket.quizId]) clientsMap[socket.quizId] = [];
            else socket.emit('quiz waiting-players', clientsMap[socket.quizId]);
            clientsMap[socket.quizId].push(socket.user);
            
            socket.to(socket.quizId).broadcast.emit('quiz player-added', clientsMap[socket.quizId]);
        });
        socket.on('quiz player-ready', () => {
            const clients = clientsMap[socket.quizId]; 
            socket.user.isReady = true;

            socket.to(socket.quizId).broadcast.emit('quiz player-status-changed', socket.user.uid);
            if (clients.every(client => client.isReady)) {
                io.to(socket.quizId).emit('quiz all-ready');
            }
        });
        socket.on('quiz question-answered', userAnsCount => {
            const clients = clientsMap[socket.quizId]; 
            const client = clients.find(client => client.uid === socket.user.uid);
            client.ansCount = userAnsCount;
            socket.to(socket.quizId).broadcast.emit('quiz player-progressed', clientsMap[socket.quizId]);
        });
        socket.on('quiz player-disconnected', () => {
            clientsMap[socket.quizId] = clientsMap[socket.quizId].filter(client => client.uid !== socket.user.uid); 
            socket.to(socket.quizId).broadcast.emit('quiz player-leaved', clientsMap[socket.quizId]);
        });
        socket.on('quiz player-done', data => {
            const clients = clientsMap[socket.quizId];
            const client = clients.find(client => client.uid === socket.user.uid);
            client.isDone = true;
            client.stats = data;
            io.to(socket.quizId).emit('quiz player-done-score', clients);
        });
    });
}