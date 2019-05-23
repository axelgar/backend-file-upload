'use strict';

const express = require('express');
const router = express.Router();

const Meme = require('../models/meme');
const parser = require('../config/cloudinary');

router.get('/', (req, res, next) => {
  res.json({ message: 'Welcom to the memes api' }).status(200);
});

router.get('/memes', (req, res, next) => {
  Meme.find({})
    .then((memes) => {
      if (!memes) res.json({ message: 'No memes yet' }).status(404);
      res.status(200).json(memes);
    })
    .catch((error) => next(error));
});

router.post('/memes', (req, res, next) => {
  const { title, description, imageUrl } = req.body;
  const newMeme = new Meme({
    title,
    description,
    imageUrl
  });
  newMeme.save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => next(err));
});

router.post('/memes/image', parser.single('photo'), (req, res, next) => {
  console.log('file upload');
  if (!req.file) {
    next(new Error('No file uploaded!'));
  };
  const imageUrl = req.file.secure_url;
  res.json(imageUrl).status(200);
});

module.exports = router;
