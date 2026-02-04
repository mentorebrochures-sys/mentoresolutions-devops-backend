const router = require('express').Router();
const contactCtrl = require('../controllers/contactController');

router.get('/', contactCtrl.getContact);
router.post('/', contactCtrl.createContact);
router.put('/:id', contactCtrl.updateContact);
module.exports = router;