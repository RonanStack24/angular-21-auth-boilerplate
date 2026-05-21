const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const DIST_PATH = path.join(__dirname, 'dist/ipt-2026-frontend');

// Serve static files from the Angular app build directory
app.use(express.static(DIST_PATH));

// For all GET requests, send back index.html so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
