const express = require('express');
const app = express();

app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        version: '1.0.0'
    });
});

app.get('/api/data', (req, res) => {
    res.json({
        data: ['apple', 'banana', 'cherry'],
        count: 3
    });
});

if(require.main === module) {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

module.exports = app;