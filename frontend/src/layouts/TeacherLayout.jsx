import { Outlet } from 'react-router-dom';
import { RequireRole } from '../shared/hooks/RequireRole';
import PortalLayout from './PortalLayout';

const TeacherLayout = () => {
  return (
    <RequireRole allowedRoles={['teacher']}>
     
        <Outlet /> {/* Nested routes (list of posts or individual post) will be rendered here */}
     
    </RequireRole>
  );
};

export default TeacherLayout;