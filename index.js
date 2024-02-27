const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const admin = require('firebase-admin');
const express = require('express');
const app = express();


// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Assuming the JSON key file is in the current folder
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'audiofiles-82ffa.appspot.com', // Your Firebase Storage bucket URL
});


app.get('/', async function (req, res) {
res.json({status:"ok"});
});

const bucket = admin.storage().bucket();

app.get('/audio', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const fileContent = response.data;

    const randomFileName = uuidv4() + '-by__ytmp3.pub.mp3';

    // Upload file to Firebase Storage
    await bucket.file(randomFileName).save(fileContent, {
      contentType: 'audio/mpeg', // Adjust content type as needed
    });

    // Get download URL
    const downloadURL = `https://storage.googleapis.com/audiofiles-82ffa.appspot.com/${randomFileName}`;

    res.status(200).json({ downloadURL });
  } catch (error) {
    console.error('Error fetching or uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
