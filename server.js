const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const server = express();
const upload = multer({ dest: 'uploads/' });

mongoose.connect('mongodb://localhost:27017/submissionDB', { useNewUrlParser: true, useUnifiedTopology: true });

const submissionSchema = new mongoose.Schema({
  userName: String,
  socialHandle: String,
  userImages: [String],
});

const Submission = mongoose.model('Submission', submissionSchema);

server.post('/api/submit', upload.array('userImages'), async (req, res) => {
  const { userName, socialHandle } = req.body;
  const imagePaths = req.files.map(file => file.path);

  const newSubmission = new Submission({
    userName,
    socialHandle,
    userImages: imagePaths,
  });

  try {
    await newSubmission.save();
    res.status(201).send('Data saved successfully!');
  } catch (error) {
    res.status(400).send('Error saving data.');
  }
});

server.get('/api/submissions', async (req, res) => {
  try {
    const allSubmissions = await Submission.find();
    res.status(200).json(allSubmissions);
  } catch (error) {
    res.status(500).send('Error fetching data.');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
