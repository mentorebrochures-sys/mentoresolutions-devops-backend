const router = require('express').Router();
const placeCtrl = require('../controllers/placementController');
const upload = require('../multer');

router.get('/', placeCtrl.getAll);
router.post('/', upload.single('image'), placeCtrl.create);
router.put('/:id', placeCtrl.update);
router.delete('/:id', placeCtrl.delete);
module.exports = router;