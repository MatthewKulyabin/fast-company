const express = require('express');
const router = express.Router({ mergeParams: true });

const Profession = require('../models/Profession');

router.get('/', async (req, res) => {
  try {
    const list = await Profession.find();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({
      message: 'Error occured on server. Try later',
    });
  }
});

module.exports = router;
