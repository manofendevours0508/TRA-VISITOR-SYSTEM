const express = require('express');
const prisma = require('../prismaClient');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/summary', async (req, res) => {
  const [
    totalDocuments, pending, inProgress, completed,
    incoming, outgoing, totalOffices, totalServices, totalUsers,
    recentDocuments,
  ] = await Promise.all([
    prisma.document.count(),
    prisma.document.count({ where: { status: 'pending' } }),
    prisma.document.count({ where: { status: { in: ['in-transit', 'in-progress'] } } }),
    prisma.document.count({ where: { status: 'completed' } }),
    prisma.document.count({ where: { documentType: 'incoming' } }),
    prisma.document.count({ where: { documentType: 'outgoing' } }),
    prisma.office.count(),
    prisma.service.count(),
    prisma.user.count({ where: { status: 'active' } }),
    prisma.document.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { department: true, assignedTo: true },
    }),
  ]);

  res.json({
    totalDocuments, pending, inProgress, completed,
    incoming, outgoing, totalOffices, totalServices, totalUsers,
    recentDocuments,
  });
});

module.exports = router;
