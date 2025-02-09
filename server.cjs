//Setup db connection
var Express = require('express');
const path = require('path');
const app = Express();

// Handles any requests that don't match the ones above
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
