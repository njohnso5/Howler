const express = require('express');
const frontendRouter = express.Router();

const path = require('path');
// Designate the static folder as serving static resources
frontendRouter.use(express.static('static'));
frontendRouter.use(express.urlencoded({extended: true}));
const html_dir = path.join(__dirname, '../templates/');

frontendRouter.get('/', (req, res) => {
    res.sendFile(`${html_dir}index.html`);
});

frontendRouter.get('/login', (req,  res) => {
    res.sendFile(`${html_dir}login.html`);
});

frontendRouter.get(`/user`, (req, res) => {
    res.sendFile(`${html_dir}profile.html`);
});

frontendRouter.get('/register', (req, res) => {
    res.sendFile(`${html_dir}register.html`);
});

module.exports = frontendRouter;