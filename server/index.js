const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());

// File path
const DATA_FILE = './data.json';

// Helper: Read and write to the file
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Helper: Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

// Routes
// 1. Add new record
app.post('/add', (req, res) => {
    const { image_id } = req.body;
    console.log(image_id);
    if (!image_id) {
        return res.status(400).send({ message: "Image ID is required." });
    }

    const data = readData();
    const today = getTodayDate();

    // Check if the record with the same image_id and today's date already exists
    const exists = data.find((record) => record.image_id === image_id && record.date.split('T')[0] === today);

    if (exists) {
        return res.status(400).send({ message: "Attendance already recorded for today." });
    }

    // Create new record
    const newRecord = { image_id, date: new Date().toISOString(), status: "Present" };
    data.push(newRecord);
    writeData(data);

    res.send({ message: "Attendance recorded successfully.", newRecord });
});

// 2. Get all records and show them in a table
app.get('/records', (req, res) => {
    const data = readData();

    // Create HTML response
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Attendance Records</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                }
                table, th, td {
                    border: 1px solid black;
                }
                th, td {
                    padding: 10px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <h1>Attendance Records</h1>
            <table>
                <thead>
                    <tr>
                        <th>Image ID</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Add rows for each record
    data.forEach(record => {
        html += `
            <tr>
                <td>${record.image_id}</td>
                <td>${record.date.split('T')[0]}</td>
                <td>${record.status}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;

    res.send(html);
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
