const express = require('express');
const prisma = require('../prismaClient');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const manageRoles = ['System Administrator', 'Registry Officer'];

router.get('/', async (req, res) => {
  const offices = await prisma.office.findMany({
    include: { department: true, services: true },
  });
  res.json(offices);
});

router.get('/:id', async (req, res) => {
  const office = await prisma.office.findUnique({
    where: { id: Number(req.params.id) },
    include: { department: true, services: true },
  });
  if (!office) return res.status(404).json({ error: 'Office not found' });
  res.json(office);
});

router.post('/', requireAuth, requireRole(...manageRoles), async (req, res) => {
  const { name, officeNumber, floor, wing, location, contactInfo, departmentId } = req.body;
  if (!name || !officeNumber || !floor || !departmentId) {
    return res.status(400).json({ error: 'name, officeNumber, floor and departmentId are required' });
  }
  const office = await prisma.office.create({
    data: { name, officeNumber, floor, wing, location, contactInfo, departmentId: Number(departmentId) },
    include: { department: true, services: true },
  });
  res.status(201).json(office);
});

router.put('/:id', requireAuth, requireRole(...manageRoles), async (req, res) => {
  const { name, officeNumber, floor, wing, location, contactInfo, departmentId } = req.body;
  const office = await prisma.office.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(name !== undefined && { name }),
      ...(officeNumber !== undefined && { officeNumber }),
      ...(floor !== undefined && { floor }),
      ...(wing !== undefined && { wing }),
      ...(location !== undefined && { location }),
      ...(contactInfo !== undefined && { contactInfo }),
      ...(departmentId !== undefined && { departmentId: Number(departmentId) }),
    },
    include: { department: true, services: true },
  });
  res.json(office);
});

router.delete('/:id', requireAuth, requireRole(...manageRoles), async (req, res) => {
  await prisma.office.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

module.exports = router;
