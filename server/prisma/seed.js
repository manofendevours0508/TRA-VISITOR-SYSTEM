const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const taxpayerServices = await prisma.department.upsert({
    where: { name: 'Taxpayer Services' },
    update: {},
    create: {
      name: 'Taxpayer Services',
      description: 'Handles taxpayer registration and TIN services',
      offices: {
        create: [
          {
            name: 'Taxpayer Services Office',
            officeNumber: '105',
            floor: '1st Floor',
            wing: 'Left Wing',
            contactInfo: 'ext. 105',
            services: {
              create: [
                {
                  name: 'TIN Services',
                  description: 'Taxpayer Identification Number registration and updates',
                  requirements: 'National ID or Passport\nProof of address\nPassport photo',
                  procedure: 'Go to Office 105\nPresent required documents\nFollow officer instructions',
                },
                {
                  name: 'Taxpayer Registration',
                  description: 'New taxpayer account registration',
                  requirements: 'Business license\nNational ID\nTIN application form',
                  procedure: 'Collect application form at Office 105\nFill in required details\nSubmit with supporting documents',
                },
              ],
            },
          },
        ],
      },
    },
  });

  const customs = await prisma.department.upsert({
    where: { name: 'Customs and Excise' },
    update: {},
    create: {
      name: 'Customs and Excise',
      description: 'Handles customs declarations and excise duty',
      offices: {
        create: [
          {
            name: 'Customs Service Office',
            officeNumber: '210',
            floor: '2nd Floor',
            wing: 'Right Wing',
            contactInfo: 'ext. 210',
            services: {
              create: [
                {
                  name: 'Customs Declaration',
                  description: 'Import/export declaration processing',
                  requirements: 'Bill of lading\nInvoice\nImport/export permit',
                  procedure: 'Go to Office 210\nSubmit declaration documents\nPay applicable duty',
                },
              ],
            },
          },
        ],
      },
    },
  });

  const registry = await prisma.department.upsert({
    where: { name: 'Registry' },
    update: {},
    create: {
      name: 'Registry',
      description: 'Central registry and records office',
      offices: {
        create: [
          {
            name: 'Registry / Reception',
            officeNumber: '001',
            floor: 'Ground Floor',
            wing: 'Main Entrance',
            contactInfo: 'ext. 001',
            services: {
              create: [
                {
                  name: 'Document Submission',
                  description: 'Submit correspondence or documents to TRA',
                  requirements: 'Original document or letter\nCopy for acknowledgement',
                  procedure: 'Go to Registry desk at Ground Floor\nHand over document for registration\nCollect acknowledgement slip',
                },
              ],
            },
          },
        ],
      },
    },
  });

  const announcementExists = await prisma.announcement.findFirst({ where: { title: 'Welcome to TRA' } });
  if (!announcementExists) {
    await prisma.announcement.create({
      data: {
        title: 'Welcome to TRA',
        message: 'Please use the search bar to find your office or service. Visit the Registry desk on the Ground Floor if you need assistance.',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2027-01-01'),
        status: 'active',
      },
    });
  }

  const roleNames = ['System Administrator', 'Registry Officer', 'Records Officer', 'Department Officer', 'Supervisor', 'Management'];
  const roles = {};
  for (const name of roleNames) {
    roles[name] = await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  const defaultPasswordHash = await bcrypt.hash('Passw0rd!', 10);
  const staffAccounts = [
    { fullName: 'Admin User', username: 'admin', role: 'System Administrator', departmentId: null },
    { fullName: 'Registry Officer', username: 'registry', role: 'Registry Officer', departmentId: registry.id },
    { fullName: 'Records Officer', username: 'records', role: 'Records Officer', departmentId: registry.id },
    { fullName: 'Taxpayer Services Officer', username: 'taxofficer', role: 'Department Officer', departmentId: taxpayerServices.id },
    { fullName: 'Supervisor User', username: 'supervisor', role: 'Supervisor', departmentId: null },
  ];
  for (const account of staffAccounts) {
    await prisma.user.upsert({
      where: { username: account.username },
      update: {},
      create: {
        fullName: account.fullName,
        username: account.username,
        passwordHash: defaultPasswordHash,
        roleId: roles[account.role].id,
        departmentId: account.departmentId,
      },
    });
  }

  console.log('Seeded departments:', [taxpayerServices.name, customs.name, registry.name].join(', '));
  console.log('Seeded staff accounts (password: Passw0rd!):', staffAccounts.map((a) => a.username).join(', '));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
