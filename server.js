require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/payments', (req, res) => {
    const amount = req.body.amount;
    // Tu dodaj logikę przetwarzania płatności
    res.json({ success: true, message: 'Payment processed successfully', amount });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});