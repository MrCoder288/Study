const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

// Route to serve the upload form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

// Route to handle file upload and processing
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log(req.file);  // Log the uploaded file information

        if (!req.file) {
            console.log('No file uploaded.');
            return res.status(400).send('No file uploaded.');
        }

        const pdfPath = req.file.path;
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(dataBuffer);

        // Serve the edit page with the extracted text
        res.redirect(`/edit.html?text=${encodeURIComponent(pdfData.text)}&speed=${req.body.speed || 300}`);

        // Clean up the uploaded file
        fs.unlinkSync(pdfPath);
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
