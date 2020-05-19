const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const authRoutes = require('./api/auth/auth.routes');
const userRoutes = require('./api/user/user.routes');
const quizRoutes = require('./api/quiz/quiz.routes');
const connectSockets = require('./api/socket/socket.routes');

const mongoConnect = require('./services/db.service');
mongoConnect();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'clip-board goose',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    };
    app.use(cors(corsOptions));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/quiz', quizRoutes);
connectSockets(io);

const logger = require('./services/logger.service');
const port = process.env.PORT || 3000;
http.listen(port, () => {
    logger.info('Server is running on port: ' + port);
});