const router = require('express').Router();
const courseCtrl = require('../controllers/courseController');

router.get('/', courseCtrl.getAll);
router.post('/', courseCtrl.create);
router.put('/:id', courseCtrl.update);
router.delete('/:id', courseCtrl.delete);
module.exports = router;