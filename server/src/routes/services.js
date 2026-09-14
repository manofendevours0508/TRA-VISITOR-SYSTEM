const express = require('express');
const prisma = require('../prismaClient');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const manageRoles = ['System Administrator', 'Registry Officer'];

router.get('/', async (req, res) => {
  const services = await prisma.service.findMany({
    include: { office: { include: { department: true } } },
  });
  res.json(services);
});

router.get('/:id', async (req, res) => {
  const service = await prisma.service.findUnique({
    where: { id: Number(req.params.id) },
    include: { office: { include: { department: true } } },
  });
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

router.post('/', requireAuth, requireRole(...manageRoles), async (req, res) => {
  const { name, description, procedure, requirements, officeId } = req.body;
  if (!name || !officeId) {
    return res.status(400).json({ error: 'name and officeId are required' });
  }
  const service = await prisma.service.create({
    data: { name, description, procedure, requirements, officeId: Number(officeId) },
    include: { office: { include: { department: true } } },
  });
  res.status(201).json(service);
});

router.put('/:id', requireAuth, requireRole(...manageRoles), async (req, res) => {
  const { name, description, procedure, requirements, officeId } = req.body;
  const service = await prisma.service.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(procedure !== undefined && { procedure }),
      ...(requirements !== undefined && { requirements }),
      ...(officeId !== undefined && { officeId: Number(officeId) }),
    },
    include: { office: { include: { department: true } } },
  });
  res.json(service);
});

router.delete('/:id', requireAuth, requireRole(...manageRoles), async (req, res) => {
  await prisma.service.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

module.exports = router;
