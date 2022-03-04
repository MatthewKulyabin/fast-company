const express = require('express');
const router = express.Router({ mergeParams: true });

const Quality = require('../models/Quality');

router.get('/', async (req, res) => {
  try {
    const list = await Quality.find();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({
      message: 'Error occured on server. Try later',
    });
  }
});

module.exports = router;
