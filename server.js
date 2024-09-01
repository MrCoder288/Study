const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Set up multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.static('public'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the upload form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

// Route to handle file upload and processing
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            console.log('No file uploaded.');
            return res.status(400).send('No file uploaded.');
        }

        const dataBuffer = req.file.buffer; // Use buffer directly from memory
        const pdfData = await pdfParse(dataBuffer);

        // Redirect to the edit page with the extracted text
        res.redirect(`/edit.html?text=${encodeURIComponent(pdfData.text)}&speed=${req.body.speed || 300}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing PDF file');
    }
});

// Serve static HTML files
app.get('/edit.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit.html'));
});

app.get('/display.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'display.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
