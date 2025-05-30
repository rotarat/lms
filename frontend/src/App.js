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
// import CourseDetailPage        from './applications/public/pages/CourseDetailPage'
// import ArticlesPage            from './applications/public/pages/ArticlesPage'
// import VideosPage              from './applications/public/pages/VideosPage'

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
            {/* <Route path=":courseId" element={<CourseDetailPage/>}/> */}
          </Route>

          {/* resources */}
          <Route path="resources">
            {/* <Route path="articles" element={<ArticlesPage/>}/>
            <Route path="videos"   element={<VideosPage/>}/> */}
          </Route>
        </Route>

          {routesConfig.shared.map(r => (
            <Route
              key={r.path}
              path={r.path}
              element={<r.element/>}
            />
          ))}
            {/* default to student/home */}
            {/* <Route index element={<Navigate to="home" replace />} /> */}

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
            {/* default to student/home */}
            {/* <Route index element={<Navigate to="home" replace />} /> */}
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
            {/* default to teacher/home */}
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