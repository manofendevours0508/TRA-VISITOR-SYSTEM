const express = require('express');
const prisma = require('../prismaClient');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireRole('System Administrator', 'Supervisor', 'Management'));

router.get('/', async (req, res) => {
  const logs = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { timestamp: 'desc' },
    take: 200,
  });
  res.json(logs.map((l) => ({
    id: l.id,
    action: l.action,
    recordId: l.recordId,
    timestamp: l.timestamp,
    device: l.device,
    user: l.user ? { id: l.user.id, fullName: l.user.fullName, username: l.user.username } : null,
  })));
});

module.exports = router;
