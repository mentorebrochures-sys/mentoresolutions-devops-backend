const router = require('express').Router();
const certCtrl = require('../controllers/certificateController');
const upload = require('../multer');

router.get('/', certCtrl.getAll);
router.post('/', upload.single('image'), certCtrl.create);
router.delete('/:id', certCtrl.delete);
module.exports = router;