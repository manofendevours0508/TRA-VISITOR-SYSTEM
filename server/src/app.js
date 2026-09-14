const express = require('express');
const cors = require('cors');
const path = require('path');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const departmentsRouter = require('./routes/departments');
const officesRouter = require('./routes/offices');
const servicesRouter = require('./routes/services');
const searchRouter = require('./routes/search');
const announcementsRouter = require('./routes/announcements');
const qrRouter = require('./routes/qr');
const documentsRouter = require('./routes/documents');
const auditLogsRouter = require('./routes/auditLogs');
const reportsRouter = require('./routes/reports');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/offices', officesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/search', searchRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/qr', qrRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/reports', reportsRouter);

module.exports = app;
