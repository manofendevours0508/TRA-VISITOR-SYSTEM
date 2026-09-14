const express = require('express');
const prisma = require('../prismaClient');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const manageRoles = ['System Administrator'];

router.get('/', async (req, res) => {
  const departments = await prisma.department.findMany({
    include: { offices: { include: { services: true } } },
  });
  res.json(departments);
});

router.post('/', requireAuth, requireRole(...manageRoles), async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const department = await prisma.department.create({ data: { name, description } });
  res.status(201).json(department);
});

router.put('/:id', requireAuth, requireRole(...manageRoles), async (req, res) => {
  const { name, description } = req.body;
  const department = await prisma.department.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
    },
  });
  res.json(department);
});

router.delete('/:id', requireAuth, requireRole(...manageRoles), async (req, res) => {
  await prisma.department.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

module.exports = router;
