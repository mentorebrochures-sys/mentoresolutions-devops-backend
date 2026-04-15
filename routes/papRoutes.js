const express = require('express');
const router = express.Router();
const papController = require('../controllers/papController');

router.get('/', papController.getAll);
router.post('/', papController.create);
router.put('/:id', papController.update);
router.delete('/:id', papController.delete);

module.exports = router;