// backend/server.js
const express = require('express');
const app = express();
const port = 3000;

const graphData = {
    data: [
        { name: "A", description: "This is a description of A", parent: "" },
        { name: "B", description: "This is a description of B", parent: "A" },
        { name: "C", description: "This is a description of C", parent: "A" },
        { name: "D", description: "This is a description of D", parent: "A" },
        { name: "B-1", description: "This is a description of B-1", parent: "B" },
        { name: "B-2", description: "This is a description of B-2", parent: "B" },
        { name: "B-3", description: "This is a description of B-3", parent: "B" }
    ]
};

app.get('/api/data', (req, res) => {
    res.json(graphData);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
