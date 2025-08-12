const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authControllers');


router.post('/login', login);
router.post('/logout', logout);


// Example protected route
// router.get('/dashboard', isAuthenticated, (req, res) => {
//     res.json({ message: `Welcome ${req.session.user}, this is a protected route.` });
// });


module.exports = router;

