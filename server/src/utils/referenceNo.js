const prisma = require('../prismaClient');

async function generateReferenceNo(documentType) {
  const prefix = documentType === 'incoming' ? 'IN' : 'OUT';
  const year = new Date().getFullYear();
  const count = await prisma.document.count({
    where: {
      documentType,
      referenceNo: { startsWith: `${prefix}-${year}-` },
    },
  });
  const seq = String(count + 1).padStart(4, '0');
  return `${prefix}-${year}-${seq}`;
}

module.exports = { generateReferenceNo };
