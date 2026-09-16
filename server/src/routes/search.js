const express = require('express');
const prisma = require('../prismaClient');

const router = express.Router();

// GET /api/search?q=tin
// Searches services and offices by name for the public kiosk.
router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) return res.json({ services: [], offices: [] });

  const [allServices, allOffices] = await Promise.all([
    prisma.service.findMany({
      include: { office: { include: { department: true } } },
    }),
    prisma.office.findMany({
      include: { department: true, services: true },
    }),
  ]);

  const services = allServices.filter((s) => s.name.toLowerCase().includes(q));
  const offices = allOffices.filter((o) => o.name.toLowerCase().includes(q));

  res.json({ services, offices });
});

module.exports = router;
