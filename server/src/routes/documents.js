const express = require('express');
const prisma = require('../prismaClient');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { generateReferenceNo } = require('../utils/referenceNo');
const { writeAuditLog } = require('../utils/auditLog');

const router = express.Router();

router.use(requireAuth);

const includeRelations = {
  department: true,
  assignedTo: true,
  movements: {
    include: { fromUser: true, toUser: true },
    orderBy: { dateSent: 'desc' },
  },
};

// GET /api/documents?type=incoming&status=pending&q=subject
router.get('/', async (req, res) => {
  const { type, status, q, departmentId } = req.query;
  const documents = await prisma.document.findMany({
    where: {
      ...(type && { documentType: type }),
      ...(status && { status }),
      ...(departmentId && { departmentId: Number(departmentId) }),
      ...(q && {
        OR: [
          { subject: { contains: q } },
          { referenceNo: { contains: q } },
          { sender: { contains: q } },
          { recipient: { contains: q } },
        ],
      }),
    },
    include: { department: true, assignedTo: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(documents);
});

router.get('/:id', async (req, res) => {
  const document = await prisma.document.findUnique({
    where: { id: Number(req.params.id) },
    include: includeRelations,
  });
  if (!document) return res.status(404).json({ error: 'Document not found' });
  res.json(document);
});

router.post('/', upload.single('file'), async (req, res) => {
  const {
    documentType, subject, sender, recipient,
    dateReceived, dateDispatched, deliveryMethod, departmentId, assignedToId,
  } = req.body;

  if (!documentType || !subject) {
    return res.status(400).json({ error: 'documentType and subject are required' });
  }
  if (!['incoming', 'outgoing'].includes(documentType)) {
    return res.status(400).json({ error: 'documentType must be incoming or outgoing' });
  }

  const referenceNo = await generateReferenceNo(documentType);

  const document = await prisma.document.create({
    data: {
      referenceNo,
      subject,
      sender: sender || null,
      recipient: recipient || null,
      documentType,
      dateReceived: dateReceived ? new Date(dateReceived) : (documentType === 'incoming' ? new Date() : null),
      dateDispatched: dateDispatched ? new Date(dateDispatched) : null,
      deliveryMethod: deliveryMethod || null,
      departmentId: departmentId ? Number(departmentId) : null,
      assignedToId: assignedToId ? Number(assignedToId) : null,
      filePath: req.file ? `/uploads/${req.file.filename}` : null,
    },
    include: includeRelations,
  });

  await writeAuditLog({
    userId: req.user.id,
    action: `REGISTER_${documentType.toUpperCase()}_DOCUMENT`,
    recordId: document.id,
    device: req.headers['user-agent'],
  });

  res.status(201).json(document);
});

router.patch('/:id', async (req, res) => {
  const { subject, status, departmentId, assignedToId } = req.body;
  const document = await prisma.document.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(subject !== undefined && { subject }),
      ...(status !== undefined && { status }),
      ...(departmentId !== undefined && { departmentId: departmentId ? Number(departmentId) : null }),
      ...(assignedToId !== undefined && { assignedToId: assignedToId ? Number(assignedToId) : null }),
    },
    include: includeRelations,
  });

  await writeAuditLog({
    userId: req.user.id,
    action: 'UPDATE_DOCUMENT',
    recordId: document.id,
    device: req.headers['user-agent'],
  });

  res.json(document);
});

// Transfer a document to another user (file tracking)
router.post('/:id/movements', async (req, res) => {
  const { toUserId, remarks } = req.body;
  if (!toUserId) return res.status(400).json({ error: 'toUserId is required' });

  const documentId = Number(req.params.id);

  const movement = await prisma.fileMovement.create({
    data: {
      documentId,
      fromUserId: req.user.id,
      toUserId: Number(toUserId),
      remarks: remarks || null,
      status: 'in-transit',
    },
    include: { fromUser: true, toUser: true },
  });

  await prisma.document.update({
    where: { id: documentId },
    data: { status: 'in-transit', assignedToId: Number(toUserId) },
  });

  await writeAuditLog({
    userId: req.user.id,
    action: 'TRANSFER_DOCUMENT',
    recordId: documentId,
    device: req.headers['user-agent'],
  });

  res.status(201).json(movement);
});

// Acknowledge receipt of a transferred document
router.post('/:id/movements/:movementId/receive', async (req, res) => {
  const movement = await prisma.fileMovement.update({
    where: { id: Number(req.params.movementId) },
    data: { dateReceived: new Date(), status: 'received' },
  });

  await prisma.document.update({
    where: { id: Number(req.params.id) },
    data: { status: 'in-progress' },
  });

  await writeAuditLog({
    userId: req.user.id,
    action: 'RECEIVE_DOCUMENT',
    recordId: req.params.id,
    device: req.headers['user-agent'],
  });

  res.json(movement);
});

module.exports = router;
