const router = require('express').Router();
const placeCtrl = require('../controllers/placementController');
const upload = require('../multer'); // Memory storage wala multer

// Get all placements
router.get('/', placeCtrl.getAll);

// Create new placement (with Image)
router.post('/', upload.single('image'), placeCtrl.create);

// Update placement (with optional Image)
router.put('/:id', upload.single('image'), placeCtrl.update);

// Delete placement
router.delete('/:id', placeCtrl.delete);

module.exports = router;