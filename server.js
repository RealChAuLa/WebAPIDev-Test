const express = require('express');
const app = express();

const PORT = 3000;

// Define the route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start the server
app.listen(PORT, () => {
    console.log(`API is running at http://localhost:${PORT}`);
});