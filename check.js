// const XLSX = require('xlsx');
// const MongoClient = require('mongodb').MongoClient;

// // MongoDB connection URL
// const mongoUrl = 'mongodb+srv://King_Eniwealth:Wealth_thefirst@cluster0.jy90puu.mongodb.net/test?retryWrites=true&w=majority';
// const dbName = '';
// const collectionName = '';

// // Excel file path
// const excelFilePath = 'SWEP SCORE SHEET.xlsx';
// // Column name to read
// const columnName = 'Matric_Number';

// // Function to read Excel file and add data to MongoDB
// async function processExcelFile() {
//   try {
//     // Connect to MongoDB
//     const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true });
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     // Read Excel file
//     const workbook = XLSX.readFile(excelFilePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     // Extract column data
//     const columnData = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
//     const columnValues = columnData.slice(1); // Exclude the header

//     // Insert data into MongoDB
//     await collection.insertMany(columnValues.map(value => ({ columnName: columnName })));

//     console.log('Data inserted successfully.');
//     client.close();
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// // Run the function
// processExcelFile();


// mongodb://localhost:27017

// const Joi = require('joi')
// const validateUser = (user) => {
//     const schema = {
//         name: Joi.string().min(5).max(50).required(),
//         email: Joi.string().min(10).max(255).required().email(),
//         password: Joi.string().min(10).max(1024).required(),
//     }

//     return schema
    
// };

// const user = {
//     name : 'user',
//     email : 'Johnbull',
//     password : 'passwo'
// };

// console.log (validateUser(user))
const config = require('./configure')
console.log(config.mongoUri.toString())
