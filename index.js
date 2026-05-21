const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const DIST_PATH = path.join(__dirname, 'dist/ipt-2026-frontend');

console.log(`Server starting...`);
console.log(`Checking DIST_PATH: ${DIST_PATH}`);

if (fs.existsSync(DIST_PATH)) {
    console.log(`DIST_PATH exists. Files:`, fs.readdirSync(DIST_PATH).slice(0, 5));
} else {
    console.error(`ERROR: DIST_PATH does not exist! Current directory contents:`, fs.readdirSync(__dirname));
}

// Serve static files from the Angular app build directory
app.use(express.static(DIST_PATH));

// For all GET requests, send back index.html so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
    const indexPath = path.join(DIST_PATH, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('index.html not found in ' + DIST_PATH);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
