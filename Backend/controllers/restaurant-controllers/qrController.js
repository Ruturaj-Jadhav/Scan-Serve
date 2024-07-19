const tableModel = require("../../models/tableModel");
const qrcode = require("qrcode");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
app.use(express.static(path.join(__dirname, '../../')));


// exports.generateQr = async (req, res) => {
//   try {
//     const { tableNo, restaurantId } = req.body;
//     const url = `http://localhost:${process.env.PORT}/menu/${restaurantId}/${tableNo}`;
//     const table = new tableModel({
//       restaurantId,
//       tableNo,
//       url,
//     });
//     await table.save();

//     // Save QR code in the current directory
//     const filePath = path.join(__dirname, `../../qrcode_${tableNo}.png`);
    
//     // Generate QR code and save to file
//     await qrcode.toFile(filePath, url);

//     // Respond with the URL of the generated QR code
//     return res.status(200).json({ message: "QR code generated successfully", url: `qrcode_${tableNo}.png` });
//   } catch (error) {
//     console.error("Error generating QR code:", error);
//     return res.status(500).json({ message: "Error generating QR code" });
//   }
// };

// Function to check if QR code URL exists
exports.checkQrExistence = async (req, res) => {
  try {
    const { tableNo, restaurantId } = req.query;
    const table = await tableModel.findOne({ tableNo, restaurantId });

    if (table) {
      return res.status(200).json({ exists: true, url: table.url });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking QR code existence:", error);
    return res.status(500).json({ message: "Error checking QR code existence" });
  }
};


exports.generateQr = async (req, res) => {
  try {
    const { tableNo, restaurantId } = req.body;
    const url = `http://localhost:${process.env.PORT}/menu/${restaurantId}/${tableNo}`;
    
    // Check if QR code already exists
    const existingTable = await tableModel.findOne({ tableNo, restaurantId });
    if (existingTable) {
      return res.status(200).json({ message: "QR code already exists", url: existingTable.url });
    }

    // Generate and save QR code
    const filePath = path.join(__dirname, `../../qrcode_${tableNo}.png`);
    await qrcode.toFile(filePath, url);

    // Save new table record
    const table = new tableModel({
      restaurantId,
      tableNo,
      url,
    });
    await table.save();

    return res.status(200).json({ message: "QR code generated successfully", url: `qrcode_${tableNo}.png` });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return res.status(500).json({ message: "Error generating QR code" });
  }
};

