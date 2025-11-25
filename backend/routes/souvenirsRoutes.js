const express = require('express');
const {
    getAllSouvenirs,
    createSouvenir,
    updateSouvenir,
    deleteSouvenir
} = require('../controllers/souvenirsService');

const router = express.Router();

router.get('/all-souvenirs', getAllSouvenirs);

router.post('/', createSouvenir);

router.put('/:id', updateSouvenir);

router.delete('/:id', deleteSouvenir);

module.exports = router;