const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files (CSS, JS, images) directly from the "public" folder
app.use( '/public', express.static(path.join(__dirname, 'public')));

// Serve your index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Serve your index.html file from the root directory
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});