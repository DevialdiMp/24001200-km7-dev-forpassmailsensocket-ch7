const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { initializeSentry } = require('./utils/sentry');
const { initializeNotification } = require("./utils/notification");
const http = require("http");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const forgotPassRoutes = require('./routes/forgotPassRoutes');
const resetPassRoutes = require('./routes/resetPassRoutes');
const logoutRoutes = require('./routes/logoutRoutes');

const sentryErrorHandler = require('./middlewares/errorHandler');
const { verifyToken } = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();
const server = http.createServer(app);

initializeSentry();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

initializeNotification(server);

app.get('/', (req, res) => {
  res.render('index');
});
app.use('/security/v2', resetPassRoutes);
app.use('/security/v1', forgotPassRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/dashboard', verifyToken, dashboardRoutes);
app.use('/logout', logoutRoutes);

app.use(sentryErrorHandler);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log("Hallo Devialdi Maisa Putra!");
  console.log(`Server berjalan pada port ${PORT}`);
});