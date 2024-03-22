const multer = require('multer');

const cloudinary = require('cloudinary').v2;

const Product = require('../models/productSchema');

const Authenticated = require('../models/authenticated');

const Category = require('../models/category');

const _ = require('lodash');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('imageUrl');

exports.createProduct = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error uploading file' });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userAgent = req.headers['user-agent'];

    const product = await Product.findById(productId).populate({
      path: 'manufacturer',
      select: 'name contractAddress'
    });

    const manufacturerId = product.manufacturer._id;
    const productName = product.name;
    let status;
    if (product) {
      status = 'passed';
    } else {
      status = 'failed';
    }

    const authenticatedProduct = new Authenticated({
      product: productName,
      productId: productId,
      requester: userAgent,
      status: status,
      manufacturer: manufacturerId 
    });

    await authenticatedProduct.save();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product found',
      product: product,
    });
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


exports.createCategory = async (req, res, next) => {
  try {
    const categoryName = req.body.name;
    const category = await Category.findOne({ name: categoryName });

    if (category) {
        const error = new Error('Category already exists.');
        error.statusCode = 422;
        throw error;
    }

    const newCategory = new Category(_.pick(req.body, ['name', 'description']));
    
    const result = await newCategory.save();

    const pickedCategory = _.pick(result, ['_id', 'name', 'description']);
    res.status(201).json({ 
        message: "Category created successfully",
        user: pickedCategory
    });
} catch (err) {
    if (!err.statusCode) {
        console.log(err.message);
        err.statusCode = 500;
    }
    next(err);
}
}


exports.getAuthenticatedProducts = async (req, res, next) => {
  try {
    const manufacturerId = req.user.userId; 

    const authenticatedProducts = await Authenticated.find({ manufacturer: manufacturerId })
    
    res.status(200).json({ message: 'Authenticated products retrieved', products: authenticatedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getManufacturerStats = async (req, res, next) => {
  try {
    const manufacturerId = req.user.userId;

    const productCount = await Product.countDocuments({ manufacturer: manufacturerId });
    const categoryCount = await Category.countDocuments({ manufacturer: manufacturerId });
    const authCount = await Authenticated.countDocuments({ manufacturer: manufacturerId });

    res.status(200).json({
      message: 'Manufacturer statistics retrieved',
      productCount: productCount,
      categoryCount: categoryCount,
      authCount: authCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getManufacturerProducts = async (req, res, next) => {
  try {
    const manufacturerId = req.user.userId; 

    const products = await Product.find({ manufacturer: manufacturerId });

    res.status(200).json({ message: 'Manufacturer products retrieved', products: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
