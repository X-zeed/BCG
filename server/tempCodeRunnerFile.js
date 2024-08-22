const express = require('express');
const path = require('path');
const app = express();

// ให้บริการไฟล์สาธารณะ (HTML, CSS, JS) จากโฟลเดอร์ public
app.use('/web', express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
