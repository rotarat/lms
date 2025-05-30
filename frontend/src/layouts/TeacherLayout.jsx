import { Outlet } from 'react-router-dom';
import { RequireRole } from '../shared/hooks/RequireRole';
import PortalLayout from './PortalLayout';

const TeacherLayout = () => {
  return (
    <RequireRole allowedRoles={['teacher']}>
      <PortalLayout>
        <Outlet /> {/* Nested routes (list of posts or individual post) will be rendered here */}
      </PortalLayout>
    </RequireRole>
  );
};

export default TeacherLayout;