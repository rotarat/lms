import { Outlet } from 'react-router-dom';
import { RequireRole } from '../shared/hooks/RequireRole';

const StudentLayout = () => {
  return (
    <RequireRole allowedRoles={['student']}>
        <Outlet /> {/* Nested routes (list of posts or individual post) will be rendered here */}
    </RequireRole>
  );
};

export default StudentLayout;