import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerReservations from './pages/customer/CustomerReservations';
import TableManagement from './pages/shared/TableManagement';
import ReservationManagement from './pages/shared/ReservationManagement';
import WaitlistManagement from './pages/shared/WaitlistManagement';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import ProfileSettings from './pages/shared/ProfileSettings';
import UsersManagement from './pages/admin/UsersManagement';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Customer Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/customer/reservations" element={<CustomerReservations />} />
        <Route path="/customer/profile" element={<ProfileSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<DashboardLayout allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tables" element={<TableManagement />} />
        <Route path="/admin/reservations" element={<ReservationManagement />} />
        <Route path="/admin/waitlist" element={<WaitlistManagement />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/users" element={<UsersManagement />} />
        <Route path="/admin/settings" element={<ProfileSettings />} />
      </Route>

      {/* Staff Routes */}
      <Route element={<DashboardLayout allowedRoles={['staff']} />}>
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/tables" element={<TableManagement />} />
        <Route path="/staff/reservations" element={<ReservationManagement />} />
        <Route path="/staff/waitlist" element={<WaitlistManagement />} />
        <Route path="/staff/settings" element={<ProfileSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;