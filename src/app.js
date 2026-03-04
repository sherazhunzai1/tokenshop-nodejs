require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');
const creatorsRouter = require('./routes/creators');

const app = express();
const PORT = process.env.PORT || 8000;
const SERVER_URL = '/app.v1';

// Security & parsing middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use(`${SERVER_URL}/api/creators`, creatorsRouter);

// Welcome page
app.get(SERVER_URL, (req, res) => {
  res.write('<h1>welcome</h1>');
  res.write('<h2>Main Page</h2>');
  res.end();
});

// Global error handler
app.use((error, req, res, next) => {
  const statusCode = error.code || 401;
  const message = error.message || 'Something went wrong';
  return res.status(statusCode).json({ message });
});

// 404 catch-all
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Path Not Found' });
});

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync models with DB (use { alter: true } to update existing tables)
    // Remove or set to false in production — use migrations instead
    await sequelize.sync({ alter: true });
    console.log('Database synced.');

    app.listen(PORT, () => console.log(`server is running at http://localhost:${PORT}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
