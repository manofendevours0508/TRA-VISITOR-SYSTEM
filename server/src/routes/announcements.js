const express = require('express');
const prisma = require('../prismaClient');
const { requireAuth, requireRole } = require('../middleware/auth');
const { localize } = require('../utils/localize');

const router = express.Router();

const manageRoles = ['System Administrator', 'Registry Officer'];

router.get('/', async (req, res) => {
  const now = new Date();
  const announcements = await prisma.announcement.findMany({
    where: {
      status: 'active',
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { startDate: 'desc' },
  });
  res.json(localize(announcements, req.query.lang));
});

// All announcements, including inactive/expired, for the admin manager view
router.get('/all', requireAuth, requireRole(...manageRoles), async (req, res) => {
  const announcements = await prisma.announcement.findMany({ orderBy: { startDate: 'desc' } });
  res.json(announcements);
});

router.post('/', requireAuth, requireRole(...manageRoles), async (req, res) => {
  const { title, titleSw, message, messageSw, startDate, endDate, status } = req.body;
  if (!title || !message || !startDate || !endDate) {
    return res.status(400).json({ error: 'title, message, startDate and endDate are required' });
  }
  const announcement = await prisma.announcement.create({
    data: {
      title, titleSw: titleSw || null, message, messageSw: messageSw || null,
      startDate: new Date(startDate), endDate: new Date(endDate), status: status || 'active',
    },
  });
  res.status(201).json(announcement);
});

router.put('/:id', requireAuth, requireRole(...manageRoles), async (req, res) => {
  const { title, titleSw, message, messageSw, startDate, endDate, status } = req.body;
  const announcement = await prisma.announcement.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(title !== undefined && { title }),
      ...(titleSw !== undefined && { titleSw: titleSw || null }),
      ...(message !== undefined && { message }),
      ...(messageSw !== undefined && { messageSw: messageSw || null }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: new Date(endDate) }),
      ...(status !== undefined && { status }),
    },
  });
  res.json(announcement);
});

router.delete('/:id', requireAuth, requireRole(...manageRoles), async (req, res) => {
  await prisma.announcement.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

module.exports = router;
