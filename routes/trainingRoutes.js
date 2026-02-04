const router = require('express').Router();
const trainCtrl = require('../controllers/trainingController');
const upload = require('../multer');

router.get('/', trainCtrl.getAll);
router.post('/', upload.single('icon'), trainCtrl.create);
router.delete('/:id', trainCtrl.delete);
module.exports = router;