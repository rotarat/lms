import StudentHomePage      from './applications/student/pages/Home'
import EnrolledCoursesPage  from './features/courses/pages/EnrolledCoursesPage'
import AllCoursesPage       from './features/courses/pages/AllCoursesPage'
import ExamsPage            from './features/courses/pages/ExamsPage'
import QuizPage             from './features/ai/pages/QuizPage'
import TeacherHomePage      from './applications/teacher/pages/Home'
import TeacherCoursesPage   from './features/courses/pages/TeacherCoursesPage'
import TeacherVideosPage    from './features/videos/pages/TeacherVideosPage'
import TeacherPresentationsPage from './features/presentations/pages/TeacherPresentationsPage'
import DiagramsPage         from './features/ai/pages/DiagramsPage'
import ProfilePage          from './features/profiles/pages/ProfilePage'
import SettingsPage         from './features/profiles/pages/ProfileSettingsPage'
import { LogoutContainer } from './features/authentication/containers/LogoutContainer'

export const sharedPortalRoutes = [
  {
    path:    'diagrams',
    element: DiagramsPage,
    section: 'OTHER',
    label:   'Diagrams',
    icon:    'diagrams.png',
  },
  {
    path:    'logout',
    element: LogoutContainer,
    section: 'OTHER',
    label:   'Logout',
    icon:    'logout.png',
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
