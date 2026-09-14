const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');
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
  };
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true, department: true },
  });

  if (!user || user.status !== 'active') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '8h' });

  await writeAuditLog({
    userId: user.id,
    action: 'LOGIN',
    device: req.headers['user-agent'],
  });

  res.json({ token, user: serializeUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  res.json(serializeUser(req.user));
});

module.exports = router;
