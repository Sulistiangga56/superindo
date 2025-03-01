import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const voucherFilePath = path.join(__dirname, 'public', 'voucher_list.json');
const orderFilePath = path.join(__dirname, 'public', 'order_list.json');

// Endpoint untuk mengecek status server
app.get('/', (req, res) => {
    res.send('Server is running. Use /vouchers or /orders');
});

// API untuk membaca daftar voucher
app.get('/vouchers', (req, res) => {
    fs.readFile(voucherFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read voucher list' });
        res.json(JSON.parse(data));
    });
});

// API untuk membaca daftar order
app.get('/orders', (req, res) => {
    fs.readFile(orderFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read order list' });
        res.json(JSON.parse(data));
    });
});

// API untuk menyimpan order ke order_list.json
app.post('/orders', (req, res) => {
    const newOrder = req.body;

    fs.readFile(orderFilePath, 'utf8', (err, data) => {
        let orders = [];
        if (!err) orders = JSON.parse(data);

        orders.push(newOrder);

        fs.writeFile(orderFilePath, JSON.stringify(orders, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ error: 'Failed to save order' });
            res.json({ message: 'Order successfully created!', order: newOrder });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
