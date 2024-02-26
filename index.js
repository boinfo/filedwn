const express = require('express');
const { downloadTrack } = require('@nechlophomeriaa/spotifydl');

const app = express();
app.set("json spaces", 4);
const PORT = 3000;
const fs = require('fs');
let axios = require("axios");
const { v4: uuidv4 } = require('uuid');


app.get('/', async function (req, res) {
res.json({status:"ok"});
});


app.get('/audio', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const fileContent = response.data;

    const randomFileName = uuidv4() + '-by__ytmp3.pub.mp3';
    const filePath = '/tmp/' + randomFileName; // or any desired directory

    fs.writeFileSync(filePath, fileContent);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="' + randomFileName + '"');
    res.download(filePath, randomFileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Clean up the temporary file after download
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
