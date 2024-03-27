const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3030;
const URL_MONGOOSE = process.env.URL_MONGOOSE;

var app = express();
app.use(express.json());

mongoose.connect(URL_MONGOOSE);
const db = mongoose.connection;
db.on('error', (err) => console.log('ERROR', err));
db.once('open', () => console.log('connected to database'));

app.use('/', require('./auth.js'));
app.listen(PORT, () => console.log('server is running at ', PORT));
