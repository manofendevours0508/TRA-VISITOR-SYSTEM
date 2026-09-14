const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const { requireAuth, requireRole } = require('../middleware/auth');
const { writeAuditLog } = require('../utils/auditLog');

const router = express.Router();

function serializeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    status: user.status,
    role: user.role?.name,
    roleId: user.roleId,
    department: user.department?.name || null,
    departmentId: user.departmentId,
    createdAt: user.createdAt,
  };
}

// Any authenticated staff member can list active users (needed to pick a transfer recipient).
// Admins additionally see disabled accounts, for user management.
router.get('/', requireAuth, async (req, res) => {
  const isAdmin = req.user.role.name === 'System Administrator';
  const users = await prisma.user.findMany({
    where: isAdmin ? {} : { status: 'active' },
    include: { role: true, department: true },
    orderBy: { fullName: 'asc' },
  });
  res.json(users.map(serializeUser));
});

router.get('/roles', requireAuth, requireRole('System Administrator'), async (req, res) => {
  const roles = await prisma.role.findMany();
  res.json(roles);
});

router.use(requireAuth, requireRole('System Administrator'));

router.post('/', async (req, res) => {
  const { fullName, username, password, roleId, departmentId } = req.body;
  if (!fullName || !username || !password || !roleId) {
    return res.status(400).json({ error: 'fullName, username, password and roleId are required' });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return res.status(409).json({ error: 'Username already taken' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      fullName,
      username,
      passwordHash,
      roleId: Number(roleId),
      departmentId: departmentId ? Number(departmentId) : null,
    },
    include: { role: true, department: true },
  });

  await writeAuditLog({ userId: req.user.id, action: 'CREATE_USER', recordId: user.id, device: req.headers['user-agent'] });
  res.status(201).json(serializeUser(user));
});

router.patch('/:id', async (req, res) => {
  const { fullName, roleId, departmentId, status } = req.body;
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(fullName !== undefined && { fullName }),
      ...(roleId !== undefined && { roleId: Number(roleId) }),
      ...(departmentId !== undefined && { departmentId: departmentId ? Number(departmentId) : null }),
      ...(status !== undefined && { status }),
    },
    include: { role: true, department: true },
  });

  await writeAuditLog({ userId: req.user.id, action: 'UPDATE_USER', recordId: user.id, device: req.headers['user-agent'] });
  res.json(serializeUser(user));
});

router.post('/:id/reset-password', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'password is required' });

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { passwordHash },
  });

  await writeAuditLog({ userId: req.user.id, action: 'RESET_PASSWORD', recordId: req.params.id, device: req.headers['user-agent'] });
  res.json({ success: true });
});

module.exports = router;
