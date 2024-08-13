const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./config/logger');
const routes = require('./routes');
const AppError = require('./utils/appError'); 

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN.split(',')
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(compression());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(process.env.RATE_LIMIT_MAX, 10)
});
app.use(limiter);

app.use(`/api/${process.env.API_VERSION}`, routes);

// Global error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let errorResponse = {
    status: err.status,
    message: err.message,
    code: err.statusCode,
    // stack: err.stack // Always include the stack trace
  };

  if (err instanceof AppError) {
    // If it's an operational error (AppError), include any additional properties
    errorResponse = { ...errorResponse, ...err };
  } else {
    // For unexpected errors, you might want to log them server-side
    console.error('Unexpected error:', err);
    
    // Optionally, you can set a generic message for unexpected errors
    errorResponse.message = 'An unexpected error occurred';
  }

  res.status(err.statusCode).json(errorResponse);
});

module.exports = app;