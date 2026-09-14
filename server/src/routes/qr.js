const express = require('express');
const QRCode = require('qrcode');

const router = express.Router();

// GET /api/qr/office/:id -> PNG QR code linking to the public office detail page
router.get('/office/:id', async (req, res) => {
  const clientBaseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:5173';
  const targetUrl = `${clientBaseUrl}/office/${req.params.id}`;

  res.setHeader('Content-Type', 'image/png');
  QRCode.toFileStream(res, targetUrl, { width: 300, margin: 1 });
});

// GET /api/qr/service/:id -> PNG QR code linking to the public service detail page
router.get('/service/:id', async (req, res) => {
  const clientBaseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:5173';
  const targetUrl = `${clientBaseUrl}/service/${req.params.id}`;

  res.setHeader('Content-Type', 'image/png');
  QRCode.toFileStream(res, targetUrl, { width: 300, margin: 1 });
});

module.exports = router;
