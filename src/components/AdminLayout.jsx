import { Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="admin-container">
      <Outlet />
    </div>
  );
}

export default AdminLayout;
