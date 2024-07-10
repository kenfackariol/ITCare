const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Read all files in the current directory (routes)
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js')  // Avoid reading index.js and non-JS files
  .forEach(file => {
    // Create a route path from the filename (e.g., 'users.js' -> '/users')
    const routePath = `/${file.replace('.js', '')}`;
    // Require the route file and use it at the defined route path
    const route = require(path.join(__dirname, file));
    router.use(routePath, route);
  });

module.exports = router;