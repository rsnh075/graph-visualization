// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const graphData = require('./data');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());

app.get('/api/data', (req, res) => {
    res.json(graphData);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});