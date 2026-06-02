import React from 'react';
import '../../styles/shared/sentinel.css';
import '../../styles/shared/TabPageWrapper.css';

const AdminUsersPage      = React.lazy(() => import('./AdminUsersPage'));
const AdminAuditLogsPage  = React.lazy(() => import('./AdminAuditLogsPage'));
const AdminSimulationPage = React.lazy(() => import('./AdminSimulationPage'));
const AdminSettingsPage   = React.lazy(() => import('./AdminSettingsPage'));

function TabFallback() {
  return (
    <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'var(--sent-text-muted, #5a5850)', fontSize: '0.9rem' }}>Loading…</span>
    </div>
  );
}

export default function AdminManagementPage({ initialTab }) {
  const tab = initialTab || 'users';

  const renderTab = () => {
    switch (tab) {
      case 'users':      return <AdminUsersPage />;
      case 'audit-logs': return <AdminAuditLogsPage />;
      case 'simulation': return <AdminSimulationPage />;
      case 'settings':   return <AdminSettingsPage />;
      default:           return <AdminUsersPage />;
    }
  };

  return (
    <div className="tabbed-page-wrapper">
      <div className="tabbed-page-wrapper__content">
        <React.Suspense fallback={<TabFallback />}>
          {renderTab()}
        </React.Suspense>
      </div>
    </div>
  );
}
