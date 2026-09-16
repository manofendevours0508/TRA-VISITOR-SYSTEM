import { Routes, Route } from 'react-router-dom';
import KioskIdleGate from './components/KioskIdleGate';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Directory from './pages/Directory';
import OfficeDetail from './pages/OfficeDetail';
import ServiceDetail from './pages/ServiceDetail';
import BuildingMap from './pages/BuildingMap';
import Announcements from './pages/Announcements';

import { AuthProvider } from './staff/AuthContext';
import ProtectedRoute from './staff/ProtectedRoute';
import Login from './staff/pages/Login';
import Dashboard from './staff/pages/Dashboard';
import DocumentRegister from './staff/pages/DocumentRegister';
import DocumentDetail from './staff/pages/DocumentDetail';
import FileTracking from './staff/pages/FileTracking';
import DocumentSearch from './staff/pages/DocumentSearch';
import Users from './staff/pages/Users';
import AnnouncementsManager from './staff/pages/AnnouncementsManager';
import DirectoryManager from './staff/pages/DirectoryManager';
import AuditLog from './staff/pages/AuditLog';

export default function App() {
  return (
    <Routes>
      {/* Public kiosk */}
      <Route path="/" element={<KioskIdleGate><Home /></KioskIdleGate>} />
      <Route path="/search" element={<KioskIdleGate><SearchResults /></KioskIdleGate>} />
      <Route path="/directory" element={<KioskIdleGate><Directory /></KioskIdleGate>} />
      <Route path="/office/:id" element={<KioskIdleGate><OfficeDetail /></KioskIdleGate>} />
      <Route path="/service/:id" element={<KioskIdleGate><ServiceDetail /></KioskIdleGate>} />
      <Route path="/map" element={<KioskIdleGate><BuildingMap /></KioskIdleGate>} />
      <Route path="/announcements" element={<KioskIdleGate><Announcements /></KioskIdleGate>} />

      {/* Staff portal */}
      <Route path="/staff/*" element={
        <AuthProvider>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="incoming" element={<ProtectedRoute><DocumentRegister type="incoming" /></ProtectedRoute>} />
            <Route path="outgoing" element={<ProtectedRoute><DocumentRegister type="outgoing" /></ProtectedRoute>} />
            <Route path="documents/:id" element={<ProtectedRoute><DocumentDetail /></ProtectedRoute>} />
            <Route path="tracking" element={<ProtectedRoute><FileTracking /></ProtectedRoute>} />
            <Route path="search" element={<ProtectedRoute><DocumentSearch /></ProtectedRoute>} />
            <Route path="directory" element={<ProtectedRoute><DirectoryManager /></ProtectedRoute>} />
            <Route path="announcements" element={<ProtectedRoute><AnnouncementsManager /></ProtectedRoute>} />
            <Route path="users" element={<ProtectedRoute roles={['System Administrator']}><Users /></ProtectedRoute>} />
            <Route path="audit-log" element={<ProtectedRoute roles={['System Administrator', 'Supervisor', 'Management']}><AuditLog /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      } />
    </Routes>
  );
}
