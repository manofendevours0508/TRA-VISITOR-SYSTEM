const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Source: TRA Dodoma Regional Office directory numbering, floor/room plan,
// and TIN locations sheet (photographed office notice boards). A few roles
// (Team Leader Block A/C/D, Real Estate, Data) had no confirmed room number
// in the source material and are intentionally left out of the physical
// office directory until a room is assigned.

const DODOMA_DISTRICT_WARDS = [
  'Uhuru', 'Viwandani', 'Makole', 'Madukani', 'Majengo', 'Chamwino', 'K/Ndege',
  "Ngh'ongh'onha", 'Iyumbu', 'Dodoma Makulu', 'Ntyuka', 'Tambuka Reli', 'Kilimani',
  'Kikuyu Kaskazini', 'Kikuyu Kusini', 'Mpunguzi', 'Mbabala', 'Matumbulu', 'Mkonze',
  'Chigongwe', 'Nala', 'Zuzu', 'Mbalawala', 'Kizota', 'Hazina',
];

const NZUGUNI_WARDS = [
  'Nzuguni', 'Mtumba', 'Ihumwa', 'Ipagala', 'Kikombo', 'Hombolo Bwawani',
  'Hombolo Makulu', 'Chihanga', 'Chahwa', 'Ipala',
];

const MIPANGO_WARDS = ['Miyuji', 'Makutopora', 'Mlasato', "Chang'ombe", 'Nkuhungu'];

function contact(name, ext) {
  return name ? `${name} — ext. ${ext}` : `ext. ${ext}`;
}

async function main() {
  const regionalManagement = await prisma.department.upsert({
    where: { name: 'Regional Management' },
    update: {},
    create: {
      name: 'Regional Management',
      description: 'Office of the Regional Manager and executive support',
      offices: {
        create: [
          { name: 'Reception', officeNumber: '1', floor: 'Ground Floor', contactInfo: contact('Mr. Mwandu Hussein', 4000) },
          { name: "Regional Manager's Office", officeNumber: '31', floor: 'Third Floor', contactInfo: contact('Mr. Pendolake Elinisafi', 4001) },
          { name: 'Personal Secretary (DCG)', officeNumber: '32', floor: 'Third Floor', contactInfo: contact('Ms. Gaudencia Kanyatta', 4002) },
          { name: 'VIP Waiting Room', officeNumber: '33', floor: 'Third Floor' },
          { name: 'Commissioner Conference Room', officeNumber: '34', floor: 'Third Floor' },
          { name: 'Regional Manager Conference Room', officeNumber: '25', floor: 'Second Floor' },
        ],
      },
    },
  });

  const taxpayerServices = await prisma.department.upsert({
    where: { name: 'Taxpayer Services' },
    update: {},
    create: {
      name: 'Taxpayer Services',
      description: 'TIN registration, licensing, and taxpayer-facing tax units',
      offices: {
        create: [
          {
            name: 'Assistant Regional Manager – Taxpayer Services',
            officeNumber: '2',
            floor: 'Ground Floor',
            contactInfo: contact('Mr. John Njau', 4003),
            location: `Main office — serves Dodoma District wards: ${DODOMA_DISTRICT_WARDS.join(', ')}`,
          },
          { name: 'PS-ARM Taxpayer Service', officeNumber: '18', floor: 'First Floor', contactInfo: contact('Ms. Rehema Bwela', 4004) },
          { name: 'Rental Tax', officeNumber: '3', floor: 'Ground Floor' },
          { name: 'Block', officeNumber: '4', floor: 'Ground Floor' },
          { name: 'Block', officeNumber: '7', floor: 'Ground Floor' },
          { name: 'Correspondence Reception (Letter Receiving & Dispatch)', officeNumber: '6', floor: 'Ground Floor' },
          { name: 'EFD & ETS Units', officeNumber: '8', floor: 'Ground Floor', contactInfo: contact('Mr. Paschal Mashenene', 4012) },
          { name: 'Registry', officeNumber: '10', floor: 'Ground Floor' },
          { name: 'Capital Gain Tax', officeNumber: '12', floor: 'First Floor' },
          {
            name: 'Motor Vehicle, TIN & Driving Licence',
            officeNumber: '13',
            floor: 'First Floor',
            contactInfo: 'Also handles Stamp Duty',
            services: {
              create: [
                {
                  name: 'TIN Registration – Individual',
                  description: 'TIN registration for a sole proprietor / individual business (Fomu ya Viambatanisho – Binafsi)',
                  requirements: [
                    "Copy of ID (NIDA, Voter's ID, Driving Licence or Passport)",
                    'Business licence application form',
                    'Lease agreement (Mkataba wa Pango)',
                    "Advocate's stamp with EFD receipt or court payment receipt (if applicable)",
                    'Agreement for shared/inherited business premises (if applicable)',
                    'Ownership letter with attached bill (if premises was allocated)',
                  ].join('\n'),
                  procedure: [
                    'Collect and fill the business licence application form',
                    'Attach a copy of your ID (NIDA, Voter\'s ID, Driving Licence or Passport)',
                    'Attach your lease agreement or proof of business premises',
                    'Submit the form with all attachments at this desk (Room 13)',
                    'Collect your TIN certificate once processing is complete',
                  ].join('\n'),
                },
                {
                  name: 'TIN Registration – Company',
                  description: 'TIN registration for a registered company (Fomu ya Viambatanisho – Kampuni)',
                  requirements: [
                    'Memorandum and Articles of Association',
                    'Certificate of Incorporation',
                    "Lease agreement with advocate's seal and EFD receipt or court fee stamp",
                    'Area-use agreement and bill copy (if no lease agreement)',
                    'Business licence application form',
                    "Copy of ID (Driving Licence, NIDA, Voter's ID or Passport) for each director",
                  ].join('\n'),
                  procedure: [
                    'Collect and fill the business licence application form',
                    'Attach the Memorandum and Articles of Association and Certificate of Incorporation',
                    'Attach the lease agreement (or area-use agreement and bill copy)',
                    'Attach an ID copy for each company director',
                    'Submit all documents at this desk (Room 13)',
                    'Collect your company TIN certificate once processing is complete',
                  ].join('\n'),
                },
                {
                  name: 'TIN Registration – Partnership',
                  description: 'TIN registration for a business partnership (Fomu ya Viambatanisho – Ubia)',
                  requirements: [
                    'Partnership deed',
                    'Lease agreement (or area-use agreement and bill copy if no lease)',
                    'Business licence application form',
                    "Copy of ID and voter's card for each partner",
                  ].join('\n'),
                  procedure: [
                    'Collect and fill the business licence application form',
                    'Attach the partnership deed',
                    'Attach the lease agreement or area-use agreement',
                    "Attach an ID and voter's card copy for each partner",
                    'Submit all documents at this desk (Room 13)',
                    'Collect your partnership TIN certificate once processing is complete',
                  ].join('\n'),
                },
              ],
            },
          },
          { name: 'Taxpayer Education', officeNumber: '14', floor: 'First Floor', contactInfo: contact('Mr. Philip Eliamini', 4015) },
          { name: 'Trade Facilitation Unit', officeNumber: '19', floor: 'First Floor' },
          { name: 'Digital Unit', officeNumber: '22', floor: 'Second Floor' },
          { name: 'Normal Flow', officeNumber: '23', floor: 'Second Floor', contactInfo: contact('Ms. Neema Kibanda', 4010) },
        ],
      },
    },
  });

  const auditCompliance = await prisma.department.upsert({
    where: { name: 'Audit & Compliance' },
    update: {},
    create: {
      name: 'Audit & Compliance',
      description: 'Examination, VAT control, audit and technical compliance',
      offices: {
        create: [
          { name: 'Examination Unit', officeNumber: '20', floor: 'Second Floor', contactInfo: contact('Mr. Ahmed Mtota', 4008) },
          { name: 'VAT Control & Verification', officeNumber: '21', floor: 'Second Floor', contactInfo: 'ext. 4009 (room inferred from floor numbering)' },
          {
            name: 'Assistant Manager – Audit & Compliance',
            officeNumber: '24',
            floor: 'Second Floor',
            contactInfo: `${contact('Mr. Aubrey Silayo', 4005)}; ${contact('Ms. Stella Mwamba (PS ARM Audit & Compliance)', 4006)}`,
          },
          { name: 'Audit Unit', officeNumber: '27', floor: 'Second Floor', contactInfo: contact('Mr. Sizya Swago', 4007) },
          { name: 'Technical Unit', officeNumber: '29', floor: 'Second Floor', contactInfo: contact('Mr. Clement Urassa', 4020) },
        ],
      },
    },
  });

  const financeAdmin = await prisma.department.upsert({
    where: { name: 'Finance & Administration' },
    update: {},
    create: {
      name: 'Finance & Administration',
      description: 'Accounts, procurement, human resources and administration',
      offices: {
        create: [
          { name: 'Finance Unit', officeNumber: '30', floor: 'Second Floor', contactInfo: contact('Mr. Deogratias Peter (Regional Accountant)', 4013) },
          { name: 'Finance Unit In-charge', officeNumber: '26', floor: 'Second Floor' },
          { name: 'Procurement', officeNumber: '28', floor: 'Second Floor', contactInfo: contact('Mr. Augustine Barnabas', 4014) },
          { name: 'Administration Office', officeNumber: '16', floor: 'First Floor' },
          { name: 'Enforcement (Debt Collection)', officeNumber: '17', floor: 'First Floor' },
          { name: 'Regional Human Resource Officer', officeNumber: '38', floor: 'Third Floor', contactInfo: contact('Mg. Zainab Mhina', 4022) },
        ],
      },
    },
  });

  const legalCustoms = await prisma.department.upsert({
    where: { name: 'Legal & Customs' },
    update: {},
    create: {
      name: 'Legal & Customs',
      description: 'Legal affairs and customs & excise',
      offices: {
        create: [
          { name: 'Legal Unit', officeNumber: '36', floor: 'Third Floor', contactInfo: contact('Ms. Khadija Senzia (Legal Council)', 4024) },
          { name: 'Customs and Excise Unit', officeNumber: '37', floor: 'Third Floor' },
        ],
      },
    },
  });

  const ict = await prisma.department.upsert({
    where: { name: 'Information & Communication Technology' },
    update: {},
    create: {
      name: 'Information & Communication Technology',
      description: 'ICT infrastructure and digital services',
      offices: {
        create: [
          { name: 'ICT Unit', officeNumber: '11', floor: 'First Floor', contactInfo: contact('Mr. David Sanga', 4011) },
        ],
      },
    },
  });

  const regionalBranches = await prisma.department.upsert({
    where: { name: 'Regional Branches' },
    update: {},
    create: {
      name: 'Regional Branches',
      description: 'Satellite TIN registration centres serving outlying Dodoma wards',
      offices: {
        create: [
          {
            name: 'Nzuguni Tax Centre',
            officeNumber: 'Branch',
            floor: 'N/A',
            location: `Serves wards: ${NZUGUNI_WARDS.join(', ')}`,
          },
          {
            name: 'Mipango Tax Centre',
            officeNumber: 'Branch',
            floor: 'N/A',
            location: `Serves wards: ${MIPANGO_WARDS.join(', ')}`,
          },
        ],
      },
    },
  });

  const announcementExists = await prisma.announcement.findFirst({ where: { title: 'Welcome to TRA Dodoma' } });
  if (!announcementExists) {
    await prisma.announcement.create({
      data: {
        title: 'Welcome to TRA Dodoma',
        message: 'Use the search bar to find your office, service or procedure. Visit the Registry desk on the Ground Floor (Room 10) if you need assistance.',
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
    { fullName: 'Registry Officer', username: 'registry', role: 'Registry Officer', departmentId: taxpayerServices.id },
    { fullName: 'Records Officer', username: 'records', role: 'Records Officer', departmentId: taxpayerServices.id },
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

  console.log('Seeded departments:', [
    regionalManagement.name, taxpayerServices.name, auditCompliance.name,
    financeAdmin.name, legalCustoms.name, ict.name, regionalBranches.name,
  ].join(', '));
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
