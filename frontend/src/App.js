import { Routes, Route, Navigate } from 'react-router-dom'
import  AuthProvider         from './shared/context/AuthProvider'
import { RequireAuth }             from './shared/hooks/RequireAuth'
import { RequireAnon }             from './shared/hooks/RequireAnon'
import RoleRedirect from './shared/hooks/RoleRedirect'

import { routesConfig }    from './routes'

// Layouts
import AuthLayout             from './layouts/AuthLayout'
import PublicLayout            from './layouts/PublicLayout'
import StudentPortalLayout     from './layouts/StudentLayout'
import TeacherPortalLayout     from './layouts/TeacherLayout'

// Public pages
import HomePage                from './applications/public/pages/HomePage'
import PublicCoursesPage       from './applications/public/pages/PublicCourses'
import Resource from './applications/public/pages/Resources'
import DiagramResource from './applications/public/pages/DiagramResource'

// Auth pages
import LoginPage               from './features/authentication/pages/LoginPage'
import RegisterPage            from './features/authentication/pages/RegisterPage'
import PortalLayout from './layouts/PortalLayout'

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/*** 1) PUBLIC (anonymous‐only) ***/}
        <Route element={<RequireAnon><PublicLayout/></RequireAnon>}>
          {/* auth forms */}
          <Route element={<AuthLayout/>}>
            <Route path="login"    element={<LoginPage/>} />
            <Route path="register" element={<RegisterPage/>}/>
          </Route>

          {/* landing */}
          <Route index element={<HomePage/>}/>

          {/* courses */}
          <Route path="courses">
            <Route index element={<PublicCoursesPage/>}/>
          </Route>

          {/* resources */}
          <Route path="resources">
            <Route index element={<Resource/>}/>
            <Route path="diagram" element={<DiagramResource/>}/>
          </Route>

          <Route index element={<Navigate to="home" replace />} />

        </Route>

        {/*** 2) PORTAL (authenticated‐only) ***/}

        <Route path="portal/*" element={<RequireAuth><PortalLayout/></RequireAuth>}>
          {/* /portal → redirect to /portal/{role} */}
          <Route index element={<RoleRedirect />} />
         
          {/* STUDENT PORTAL */}
          <Route
            path="student/*"
            element={<StudentPortalLayout/>}
          >
            {routesConfig.student.map(r => (
              <Route
                key={r.path}
                path={r.path}
                element={<r.element/>}
              />
            ))}
             {routesConfig.shared.map(r => (
            <Route
              key={r.path}
              path={r.path}
              element={<r.element/>}
            />
          ))}

            {/* default to student/home */}
            <Route index element={<Navigate to="home" replace />} />
          </Route>

          {/* TEACHER PORTAL */}
          <Route
            path="teacher/*"
            element={<TeacherPortalLayout/>}
          >
            
            {routesConfig.teacher.map(r => (
              <Route
                key={r.path}
                path={r.path}
                element={<r.element/>}
              />
            ))}
             {routesConfig.shared.map(r => (
            <Route
              key={r.path}
              path={r.path}
              element={<r.element/>}
            />
          ))}

            <Route index element={<Navigate to="home" replace />} />
          </Route>

         

        </Route>

        {/*** 3) CATCH-ALL ***/}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </AuthProvider>
  )
}