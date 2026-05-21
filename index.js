const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const DIST_PATH = path.join(__dirname, 'dist/ipt-2026-frontend');

console.log(`Checking DIST_PATH: ${DIST_PATH}`);
if (fs.existsSync(DIST_PATH)) {
    console.log('DIST_PATH exists');
    console.log('Files in DIST_PATH:', fs.readdirSync(DIST_PATH));
} else {
    console.log('DIST_PATH DOES NOT EXIST! Checking parent dist folder...');
    const parentDist = path.join(__dirname, 'dist');
    if (fs.existsSync(parentDist)) {
        console.log('Parent dist files:', fs.readdirSync(parentDist));
    }
}

// Serve static files from the Angular app build directory
app.use(express.static(DIST_PATH));

// For all GET requests, send back index.html so that PathLocationStrategy can be used
app.get('*', function(req, res) {
    // If the request is for a file (has an extension), but reached here, it means express.static missed it
    if (req.url.includes('.')) {
        console.log(`File not found: ${req.url}`);
        return res.status(404).send('File not found');
    }
    
    console.log(`Serving index.html for route: ${req.url}`);
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
