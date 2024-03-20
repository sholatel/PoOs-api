const multer = require('multer');

const cloudinary = require('cloudinary').v2;

const conFig = require('../configure');

const Product = require('../models/productSchema');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.createProduct = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.buffer.toString('base64'), {
      resource_type: 'image'
    });

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      productId: req.body.productId,
      quantity: req.body.quantity,
      expiryDate: req.body.expiryDate,
      barcode: req.body.barcode,
      category: req.body.category,
      manufacturer: req.body.manufacturer,
      imageUrl: result.secure_url 
    });

    await product.save();

    res.status(201).json({ message: 'Product created successfully', product: product });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        const manufacturerId = req.params.manufacturerId;

        const product = await Product.findOne({ _id: productId, manufacturer: manufacturerId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product found', product: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTotalProducts = async (req, res, next) => {
    try {
        const manufacturerId = req.user.userId; 
        const totalProducts = await Product.countDocuments({ manufacturer: manufacturerId });

        res.status(200).json({ message: 'Total products retrieved', totalProducts: totalProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCategories = async (req, res, next) => {
  try {
      const manufacturerId = req.user.userId; 

      const products = await Product.find({ manufacturer: manufacturerId }).select('category');

      const categoryIds = [...new Set(products.map(product => product.category))];

      const categories = await Category.find({ _id: { $in: categoryIds } });

      res.status(200).json({ message: 'Categories retrieved', categories: categories });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
