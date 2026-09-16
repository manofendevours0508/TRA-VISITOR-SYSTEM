const prisma = require('../prismaClient');

async function writeAuditLog({ userId, action, recordId, device }) {
  return prisma.auditLog.create({
    data: { userId, action, recordId: recordId ? String(recordId) : null, device },
  });
}

module.exports = { writeAuditLog };
