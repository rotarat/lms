import StudentHomePage      from './applications/student/pages/StudentHomePage'
import EnrolledCoursesPage  from './applications/student/pages/EnrolledCoursesPage'
import AllCoursesPage       from './applications/student/pages/AllCoursesPage'
import ExamsPage            from './applications/student/pages/ExamsPage'
import QuizPage             from './applications/student/pages/QuizPage'
import TeacherHomePage      from './applications/teacher/pages/TeacherHomePage'
import TeacherCoursesPage   from './applications/teacher/pages/TeacherCoursesPage'
import TeacherVideosPage    from './applications/teacher/pages/TeacherVideosPage'
import TeacherPresentationsPage from './applications/teacher/pages/TeacherPresentationsPage'
import DiagramsPage         from './features/ai/pages/DiagramsPage'
import ProfilePage          from './features/profiles/pages/ProfilePage'
import SettingsPage         from './features/profiles/pages/ProfileSettingsPage'
import LogoutPage from './features/authentication/pages/LogoutPage'

export const sharedPortalRoutes = [
  {
    path:    'diagrams',
    element: DiagramsPage,
    section: 'OTHER',
    label:   'Diagrams',
    icon:    'diagrams.png',
  },
  {
    path:    'profile',
    element: ProfilePage,
    section: 'OTHER',
    label:   'Profile',
    icon:    'profile.png'
  },
  {
    path:    'settings',
    element: SettingsPage,
    section: 'OTHER',
    label:   'Settings',
    icon:    'setting.png'
  },
  {
    path:    'logout',
    element: LogoutPage,
    section: 'OTHER',
    label:   'Logout',
    icon:    'logout.png',
  },
]

export const studentRoutes = [
  {
    path:    'home',
    element: StudentHomePage,
    section: 'MENU',
    label:   'Home',
    icon:    'home.png'
  },
  {
    path:    'courses/enrolled',
    element: EnrolledCoursesPage,
    section: 'MENU',
    label:   'Enrolled courses',
    icon:    'enrolled_courses.png'
  },
  {
    path:    'exams',
    element: ExamsPage,
    section: 'MENU',
    label:   'Exams',
    icon:    'exam.png'
  },
  {
    path:    'courses',
    element: AllCoursesPage,
    section: 'MENU',
    label:   'Browse courses',
    icon:    'browse_courses.png'
  },
  {
    path:    'quiz',
    element: QuizPage,
    section: 'MENU',
    label:   'Feeling brave?',
    icon:    'feeling_brave.png'
  },
]

export const teacherRoutes = [
  {
    path:    'home',
    element: TeacherHomePage,
    section: 'MENU',
    label:   'Home',
    icon:    'home.png'
  },
  {
    path:    'courses',
    element: TeacherCoursesPage,
    section: 'MENU',
    label:   'My Courses',
    icon:    'enrolled_courses.png'
  },
  {
    path:    'videos',
    element: TeacherVideosPage,
    section: 'MENU',
    label:   'My Videos',
    icon:    'enrolled_courses.png'
  },
  {
    path:    'presentations',
    element: TeacherPresentationsPage,
    section: 'MENU',
    label:   'My Presentations',
    icon:    'enrolled_courses.png'
  },
]

export const routesConfig = {
  shared:  sharedPortalRoutes,
  student: studentRoutes,
  teacher: teacherRoutes
}
