const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req,res) => {
    res.send('server up');
});

app.listen(port, () => {
    console.log(`Server running at http:${port}`);
});

app.get('/api/data', (req, res) => {
    res.json({message: "data fetch"})
});

app.use(express.static('Frontend-DevFolder'));