const express = require('express');

const app = express();
const PORT = 80;

const router = require('./src/routes');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(router);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));