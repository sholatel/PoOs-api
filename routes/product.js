const express = require('express');

const { auth } = require('../middleware/auth');

const productController = require('../controller/product');

const multer = require('multer');


const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const router = express.Router();



router.get('/total', auth, productController.getTotalProducts);

router.get('/categories', auth, productController.getCategories);

router.get('/:productId/:manufacturerId', auth, productController.getProduct);

// router.get('/', auth, productController.getauthenticatedProducts);

router.post('/', auth, upload.single('image'), productController.createProduct);


module.exports = router;