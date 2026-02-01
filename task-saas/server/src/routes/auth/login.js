const { login, userList } = require('../../controllers/auth/login');
const express = require('express');

const router = express.Router();

router.post('/', login);

router.get('/api/users', userList);
module.exports = router;
