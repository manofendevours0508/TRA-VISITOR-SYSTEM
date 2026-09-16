const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Idempotent sync of Swahili (nameSw/...Sw) fields for the directory content.
// Safe to re-run: matches records on their unique English fields and only
// updates the Swahili columns when they change.

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

const FLOOR_SW = {
  'Ground Floor': 'Ghorofa ya Chini',
  'First Floor': 'Ghorofa ya Kwanza',
  'Second Floor': 'Ghorofa ya Pili',
  'Third Floor': 'Ghorofa ya Tatu',
  'N/A': 'Hakuna',
};

const DEPARTMENTS = [
  {
    name: 'Regional Management',
    nameSw: 'Usimamizi wa Kanda',
    descriptionSw: 'Ofisi ya Meneja wa Kanda na msaada wa utendaji',
  },
  {
    name: 'Taxpayer Services',
    nameSw: 'Huduma kwa Walipa Kodi',
    descriptionSw: 'Usajili wa TIN, leseni, na vitengo vinavyohudumia walipa kodi',
  },
  {
    name: 'Audit & Compliance',
    nameSw: 'Ukaguzi na Kuzingatia Sheria',
    descriptionSw: 'Uchunguzi, udhibiti wa VAT, ukaguzi na utekelezaji wa kiufundi',
  },
  {
    name: 'Finance & Administration',
    nameSw: 'Fedha na Utawala',
    descriptionSw: 'Hesabu, manunuzi, rasilimali watu na utawala',
  },
  {
    name: 'Legal & Customs',
    nameSw: 'Sheria na Forodha',
    descriptionSw: 'Masuala ya kisheria na forodha na ushuru wa ndani',
  },
  {
    name: 'Information & Communication Technology',
    nameSw: 'Teknolojia ya Habari na Mawasiliano',
    descriptionSw: 'Miundombinu ya TEHAMA na huduma za kidijitali',
  },
  {
    name: 'Regional Branches',
    nameSw: 'Matawi ya Kanda',
    descriptionSw: 'Vituo vya usajili wa TIN vinavyohudumia kata za Dodoma nje ya mji mkuu',
  },
];

// { name, officeNumber, nameSw, floorSw?, wingSw?, locationSw? }
const OFFICES = [
  { name: 'Reception', officeNumber: '1', nameSw: 'Mapokezi', floorSw: FLOOR_SW['Ground Floor'] },
  { name: "Regional Manager's Office", officeNumber: '31', nameSw: 'Ofisi ya Meneja wa Kanda', floorSw: FLOOR_SW['Third Floor'] },
  { name: 'Personal Secretary (DCG)', officeNumber: '32', nameSw: 'Katibu Binafsi (DCG)', floorSw: FLOOR_SW['Third Floor'] },
  { name: 'VIP Waiting Room', officeNumber: '33', nameSw: 'Chumba cha Kuingilia cha VIP', floorSw: FLOOR_SW['Third Floor'] },
  { name: 'Commissioner Conference Room', officeNumber: '34', nameSw: 'Chumba cha Mikutano cha Kamishna', floorSw: FLOOR_SW['Third Floor'] },
  { name: 'Regional Manager Conference Room', officeNumber: '25', nameSw: 'Chumba cha Mikutano cha Meneja wa Kanda', floorSw: FLOOR_SW['Second Floor'] },
  {
    name: 'Assistant Regional Manager – Taxpayer Services',
    officeNumber: '2',
    nameSw: 'Meneja Msaidizi wa Kanda – Huduma kwa Walipa Kodi',
    floorSw: FLOOR_SW['Ground Floor'],
    locationSw: `Ofisi kuu — inahudumia kata za Wilaya ya Dodoma: ${DODOMA_DISTRICT_WARDS.join(', ')}`,
  },
  { name: 'PS-ARM Taxpayer Service', officeNumber: '18', nameSw: 'PS-ARM Huduma kwa Walipa Kodi', floorSw: FLOOR_SW['First Floor'] },
  { name: 'Rental Tax', officeNumber: '3', nameSw: 'Kodi ya Ukodishaji', floorSw: FLOOR_SW['Ground Floor'] },
  { name: 'Block', officeNumber: '4', nameSw: 'Jengo', floorSw: FLOOR_SW['Ground Floor'] },
  { name: 'Block', officeNumber: '7', nameSw: 'Jengo', floorSw: FLOOR_SW['Ground Floor'] },
  { name: 'Correspondence Reception (Letter Receiving & Dispatch)', officeNumber: '6', nameSw: 'Mapokezi ya Barua (Upokeaji na Usambazaji wa Barua)', floorSw: FLOOR_SW['Ground Floor'] },
  { name: 'EFD & ETS Units', officeNumber: '8', nameSw: 'Vitengo vya EFD & ETS', floorSw: FLOOR_SW['Ground Floor'] },
  { name: 'Registry', officeNumber: '10', nameSw: 'Rejesta', floorSw: FLOOR_SW['Ground Floor'] },
  { name: 'Capital Gain Tax', officeNumber: '12', nameSw: 'Kodi ya Faida ya Mtaji', floorSw: FLOOR_SW['First Floor'] },
  { name: 'Motor Vehicle, TIN & Driving Licence', officeNumber: '13', nameSw: 'Magari, TIN na Leseni ya Uendeshaji', floorSw: FLOOR_SW['First Floor'] },
  { name: 'Taxpayer Education', officeNumber: '14', nameSw: 'Elimu kwa Walipa Kodi', floorSw: FLOOR_SW['First Floor'] },
  { name: 'Trade Facilitation Unit', officeNumber: '19', nameSw: 'Kitengo cha Uwezeshaji Biashara', floorSw: FLOOR_SW['First Floor'] },
  { name: 'Digital Unit', officeNumber: '22', nameSw: 'Kitengo cha Kidijitali', floorSw: FLOOR_SW['Second Floor'] },
  { name: 'Normal Flow', officeNumber: '23', nameSw: 'Mtiririko wa Kawaida', floorSw: FLOOR_SW['Second Floor'] },
  { name: 'Examination Unit', officeNumber: '20', nameSw: 'Kitengo cha Uchunguzi', floorSw: FLOOR_SW['Second Floor'] },
  { name: 'VAT Control & Verification', officeNumber: '21', nameSw: 'Udhibiti na Uthibitishaji wa VAT', floorSw: FLOOR_SW['Second Floor'] },
  { name: 'Assistant Manager – Audit & Compliance', officeNumber: '24', nameSw: 'Meneja Msaidizi – Ukaguzi na Kuzingatia Sheria', floorSw: FLOOR_SW['Second Floor'] },
  { name: 'Audit Unit', officeNumber: '27', nameSw: 'Kitengo cha Ukaguzi', floorSw: FLOOR_SW['Second Floor'] },
  { name: 'Technical Unit', officeNumber: '29', nameSw: 'Kitengo cha Kiufundi', floorSw: FLOOR_SW['Second Floor'] },
  { name: 'Finance Unit', officeNumber: '30', nameSw: 'Kitengo cha Fedha', floorSw: FLOOR_SW['Second Floor'] },
  { name: 'Finance Unit In-charge', officeNumber: '26', nameSw: 'Mkuu wa Kitengo cha Fedha', floorSw: FLOOR_SW['Second Floor'] },
  { name: 'Procurement', officeNumber: '28', nameSw: 'Manunuzi', floorSw: FLOOR_SW['Second Floor'] },
  { name: 'Administration Office', officeNumber: '16', nameSw: 'Ofisi ya Utawala', floorSw: FLOOR_SW['First Floor'] },
  { name: 'Enforcement (Debt Collection)', officeNumber: '17', nameSw: 'Utekelezaji (Ukusanyaji wa Madeni)', floorSw: FLOOR_SW['First Floor'] },
  { name: 'Regional Human Resource Officer', officeNumber: '38', nameSw: 'Afisa Rasilimali Watu wa Kanda', floorSw: FLOOR_SW['Third Floor'] },
  { name: 'Legal Unit', officeNumber: '36', nameSw: 'Kitengo cha Sheria', floorSw: FLOOR_SW['Third Floor'] },
  { name: 'Customs and Excise Unit', officeNumber: '37', nameSw: 'Kitengo cha Forodha na Ushuru wa Ndani', floorSw: FLOOR_SW['Third Floor'] },
  { name: 'ICT Unit', officeNumber: '11', nameSw: 'Kitengo cha TEHAMA', floorSw: FLOOR_SW['First Floor'] },
  {
    name: 'Nzuguni Tax Centre',
    officeNumber: 'Branch',
    nameSw: 'Kituo cha Kodi Nzuguni',
    floorSw: FLOOR_SW['N/A'],
    locationSw: `Hudumia kata: ${NZUGUNI_WARDS.join(', ')}`,
  },
  {
    name: 'Mipango Tax Centre',
    officeNumber: 'Branch',
    nameSw: 'Kituo cha Kodi Mipango',
    floorSw: FLOOR_SW['N/A'],
    locationSw: `Hudumia kata: ${MIPANGO_WARDS.join(', ')}`,
  },
];

const SERVICES = [
  {
    name: 'TIN Registration – Individual',
    nameSw: 'Usajili wa TIN – Mtu Binafsi',
    descriptionSw: 'Usajili wa TIN kwa mmiliki wa biashara ya kujitegemea / mtu binafsi (Fomu ya Viambatanisho – Binafsi)',
    requirementsSw: [
      'Nakala ya kitambulisho (NIDA, Kadi ya Mpiga Kura, Leseni ya Uendeshaji au Pasipoti)',
      'Fomu ya maombi ya leseni ya biashara',
      'Mkataba wa Pango',
      'Stempu ya wakili pamoja na risiti ya EFD au risiti ya malipo ya mahakama (ikihitajika)',
      'Makubaliano ya majengo ya biashara ya pamoja/yaliyorithiwa (ikihitajika)',
      'Barua ya umiliki pamoja na bili iliyoambatanishwa (kama jengo lilipangiwa)',
    ].join('\n'),
    procedureSw: [
      'Chukua na ujaze fomu ya maombi ya leseni ya biashara',
      'Ambatanisha nakala ya kitambulisho chako (NIDA, Kadi ya Mpiga Kura, Leseni ya Uendeshaji au Pasipoti)',
      'Ambatanisha mkataba wako wa pango au uthibitisho wa majengo ya biashara',
      'Wasilisha fomu pamoja na viambatanisho vyote kwenye dawati hili (Chumba 13)',
      'Chukua cheti chako cha TIN baada ya usindikaji kukamilika',
    ].join('\n'),
  },
  {
    name: 'TIN Registration – Company',
    nameSw: 'Usajili wa TIN – Kampuni',
    descriptionSw: 'Usajili wa TIN kwa kampuni iliyosajiliwa (Fomu ya Viambatanisho – Kampuni)',
    requirementsSw: [
      'Hati ya Makubaliano (Memorandum na Articles of Association)',
      'Cheti cha Usajili wa Kampuni (Certificate of Incorporation)',
      'Mkataba wa Pango wenye muhuri wa wakili na risiti ya EFD au stempu ya ada ya mahakama',
      'Makubaliano ya matumizi ya eneo na nakala ya bili (kama hakuna mkataba wa pango)',
      'Fomu ya maombi ya leseni ya biashara',
      'Nakala ya kitambulisho (Leseni ya Uendeshaji, NIDA, Kadi ya Mpiga Kura au Pasipoti) kwa kila mkurugenzi',
    ].join('\n'),
    procedureSw: [
      'Chukua na ujaze fomu ya maombi ya leseni ya biashara',
      'Ambatanisha Hati ya Makubaliano (Memorandum na Articles of Association) na Cheti cha Usajili wa Kampuni',
      'Ambatanisha mkataba wa pango (au makubaliano ya matumizi ya eneo na nakala ya bili)',
      'Ambatanisha nakala ya kitambulisho kwa kila mkurugenzi wa kampuni',
      'Wasilisha nyaraka zote kwenye dawati hili (Chumba 13)',
      'Chukua cheti cha TIN cha kampuni yako baada ya usindikaji kukamilika',
    ].join('\n'),
  },
  {
    name: 'TIN Registration – Partnership',
    nameSw: 'Usajili wa TIN – Ubia',
    descriptionSw: 'Usajili wa TIN kwa ubia wa biashara (Fomu ya Viambatanisho – Ubia)',
    requirementsSw: [
      'Hati ya ubia',
      'Mkataba wa pango (au makubaliano ya matumizi ya eneo na nakala ya bili kama hakuna pango)',
      'Fomu ya maombi ya leseni ya biashara',
      'Nakala ya kitambulisho na kadi ya mpiga kura kwa kila mbia',
    ].join('\n'),
    procedureSw: [
      'Chukua na ujaze fomu ya maombi ya leseni ya biashara',
      'Ambatanisha hati ya ubia',
      'Ambatanisha mkataba wa pango au makubaliano ya matumizi ya eneo',
      'Ambatanisha nakala ya kitambulisho na kadi ya mpiga kura kwa kila mbia',
      'Wasilisha nyaraka zote kwenye dawati hili (Chumba 13)',
      'Chukua cheti cha TIN cha ubia wako baada ya usindikaji kukamilika',
    ].join('\n'),
  },
];

const ANNOUNCEMENTS = [
  {
    title: 'Welcome to TRA Dodoma',
    titleSw: 'Karibu TRA Dodoma',
    messageSw:
      'Tumia upau wa utafutaji kupata ofisi yako, huduma au utaratibu. Enda kwenye dawati la Rejesta, Ghorofa ya Chini (Chumba 10) kama unahitaji msaada.',
  },
];

async function main() {
  let updated = 0;

  for (const d of DEPARTMENTS) {
    await prisma.department.updateMany({
      where: { name: d.name },
      data: { nameSw: d.nameSw, descriptionSw: d.descriptionSw },
    });
    updated += 1;
  }

  for (const o of OFFICES) {
    const data = { nameSw: o.nameSw, floorSw: o.floorSw || undefined, wingSw: o.wingSw, locationSw: o.locationSw };
    await prisma.office.updateMany({
      where: { name: o.name, officeNumber: o.officeNumber },
      data,
    });
    updated += 1;
  }

  for (const s of SERVICES) {
    await prisma.service.updateMany({
      where: { name: s.name },
      data: {
        nameSw: s.nameSw,
        descriptionSw: s.descriptionSw,
        procedureSw: s.procedureSw,
        requirementsSw: s.requirementsSw,
      },
    });
    updated += 1;
  }

  for (const a of ANNOUNCEMENTS) {
    await prisma.announcement.updateMany({
      where: { title: a.title },
      data: { titleSw: a.titleSw, messageSw: a.messageSw },
    });
    updated += 1;
  }

  console.log(`Swahili translations synced for ${updated} records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });