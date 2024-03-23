const express = require('express');

const { auth } = require('../middleware/auth');

const productController = require('../controllers/product');


const router = express.Router();



router.get('/statistics', auth,  productController.getManufacturerStats); //passed

router.get('/product-requests', auth,  productController.getAuthenticatedProducts) //passed;

router.post("/create-category", auth, productController.createCategory); //passed

router.get('/', auth, productController.getManufacturerProducts) //passed

router.get('/categories', auth,  productController.getCategories); //passed

router.get('/product-categories', productController.getCategoriesFromProduct); //passe

router.get('/:productId', productController.getProduct); //passed

router.post('/',  productController.createProduct); //passed





module.exports = router;