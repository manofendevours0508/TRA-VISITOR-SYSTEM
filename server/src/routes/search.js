const express = require('express');
const prisma = require('../prismaClient');
const { localize } = require('../utils/localize');

const router = express.Router();

// GET /api/search?q=tin&lang=sw
// Searches services and offices by name (English or Swahili) for the public kiosk.
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

  const services = allServices.filter((s) => s.name.toLowerCase().includes(q) || (s.nameSw || '').toLowerCase().includes(q));
  const offices = allOffices.filter((o) => o.name.toLowerCase().includes(q) || (o.nameSw || '').toLowerCase().includes(q));

  res.json(localize({ services, offices }, req.query.lang));
});

module.exports = router;
