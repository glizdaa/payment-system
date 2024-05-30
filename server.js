const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://sa:BKPnnASsLbqDM1x6P0cLRTMX2XGJyWlJ@dpg-cpcdf7jtg9os738bhd3g-a.frankfurt-postgres.render.com/payment_system_oo9i',
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Pobieranie nieopłaconych rachunków
app.get('/api/bills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bills WHERE is_paid = FALSE');
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting bills:', err); // Logowanie błędu
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dodawanie płatności
app.post('/api/payments', async (req, res) => {
  const { amount, bill_id } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid payment amount. Please enter a valid amount.' });
  }

  try {
    const billResult = await pool.query('SELECT * FROM bills WHERE id = $1 AND is_paid = FALSE', [bill_id]);
    const bill = billResult.rows[0];

    if (!bill) {
      return res.status(400).json({ success: false, message: 'No unpaid bill found or bill is already paid' });
    }

    if (amount > bill.amount) {
      return res.status(400).json({ success: false, message: 'Payment amount exceeds bill amount' });
    }

    await pool.query('INSERT INTO payments (bill_id, amount) VALUES ($1, $2)', [bill_id, amount]);
    await pool.query('UPDATE bills SET amount = amount - $1, is_paid = CASE WHEN amount - $1 <= 0 THEN TRUE ELSE FALSE END WHERE id = $2', [amount, bill_id]);

    res.json({ success: true, message: 'Payment processed successfully' });
  } catch (err) {
    console.error('Error processing payment:', err); // Logowanie błędu
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pobieranie historii płatności
app.get('/api/payments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments');
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting payments:', err); // Logowanie błędu
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
