const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware
app.use(express.json());

// Session middleware
app.use(session({
  secret: 'your_secret_key', // Use a consistent secret key here
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware
app.use('/customer/auth/*', (req, res, next) => {
  const token = req.session.token; // Get token from session

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    req.user = decoded; // Save decoded user info to request object
    next(); // Proceed to the next middleware or route handler
  });
});

app.use('/customer', customer_routes);
app.use('/', genl_routes);

const PORT = 5002;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
