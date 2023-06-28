const express = require('express');
const multer = require('multer');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

// Handle image upload and background removal
app.post('/remove-background', upload.single('image'), async (req, res) => {
    try {
        // Call the Remove.bg API to remove the background
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', {
            image_file: req.file.buffer.toString('base64'),
            size: 'auto',
        }, {
            headers: {
                'X-Api-Key': 'SjXseDphB5g1S4Pb1xKh7aZW', // Replace with your Remove.bg API key
            },
            responseType: 'arraybuffer',
        });

        // Send the processed image with transparent background back to the client
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error('Error removing background:', error);
        res.status(500).send('Error removing background');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
