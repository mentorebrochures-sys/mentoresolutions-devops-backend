const router = require('express').Router();
const trainCtrl = require('../controllers/trainingController');

// Ithe multer (upload) chi garaj nahi
router.get('/', trainCtrl.getAll);
router.post('/', trainCtrl.create); // Sadha POST request
router.delete('/:id', trainCtrl.delete);

module.exports = router;