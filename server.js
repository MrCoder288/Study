const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Set up multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.static('public'));

// Route to serve the upload form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

// Route to handle file upload and processing
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            console.log('No file uploaded.');
            return res.status(400).send('No file uploaded.');
        }

        // Write the file to disk
        const filePath = path.join(__dirname, 'uploads', req.file.originalname);
        fs.writeFileSync(filePath, req.file.buffer);

        // Use pdftotext to convert PDF to text
        const outputPath = filePath.replace('.pdf', '.txt');
        exec(`pdftotext ${filePath} ${outputPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error converting PDF to text: ${error}`);
                return res.status(500).send('Error processing PDF file');
            }

            // Read the extracted text
            const extractedText = fs.readFileSync(outputPath, 'utf8');

            // Redirect to the edit page with the extracted text
            res.redirect(`/edit.html?text=${encodeURIComponent(extractedText)}&speed=${req.body.speed || 300}`);

            // Clean up the uploaded files
            fs.unlinkSync(filePath);
            fs.unlinkSync(outputPath);
        });
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
