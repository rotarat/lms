import StudentHomePage      from './applications/student/pages/StudentHomePage'
import EnrolledCoursesPage  from './applications/student/pages/EnrolledCoursesPage'
import AllCoursesPage       from './applications/student/pages/AllCoursesPage'
import ExamsPage            from './applications/student/pages/ExamsPage'
import QuizPage             from './applications/student/pages/QuizPage'
import StudentProjectPage   from './applications/student/pages/StudentProjectPage'
import StudentProjectCreatePage   from './applications/student/pages/StudentProjectCreatePage'
import TeacherHomePage      from './applications/teacher/pages/TeacherHomePage'
import TeacherCoursesPage   from './applications/teacher/pages/TeacherCoursesPage'
import TeacherVideosPage    from './applications/teacher/pages/TeacherVideosPage'
import TeacherPresentationsPage from './applications/teacher/pages/TeacherPresentationsPage'
import TeacherProjectsPage  from './applications/teacher/pages/TeacherProjectsPage'
import DiagramsPage         from './features/ai/pages/DiagramsPage'
import ProfilePage          from './features/profiles/pages/ProfilePage'
import SettingsPage         from './features/profiles/pages/ProfileSettingsPage'
import CourseDetailPage     from './features/courses/pages/CourseDetailPage'
import CourseFormPage       from './features/courses/pages/CourseFormPage'
import PresentationDetailPage from './features/presentations/pages/PresentationDetailPage'
import PresentationFormPage from './features/presentations/pages/PresentationFormPage'
import VideoDetailPage      from './features/videos/pages/VideoDetailPage'
import VideoFormPage        from './features/videos/pages/VideoFormPage'
import ProjectDetailsPage   from './features/projects/pages/ProjectDetailsPage'
import LogoutPage           from './features/authentication/pages/LogoutPage'

export const sharedPortalRoutes = [
  {
    path:    'diagrams',
    element: DiagramsPage,
    section: 'OTHER',
    label:   'Diagrams',
    icon:    'diagrams.png',
    hideInMenu: false,
  },
  {
    path:    'profile',
    element: ProfilePage,
    section: 'OTHER',
    label:   'Profile',
    icon:    'profile.png',
    hideInMenu: false,
  },
  {
    path:    'settings',
    element: SettingsPage,
    section: 'OTHER',
    label:   'Settings',
    icon:    'setting.png',
    hideInMenu: false,
  },
  {
    path:    'logout',
    element: LogoutPage,
    section: 'OTHER',
    label:   'Logout',
    icon:    'logout.png',
    hideInMenu: false,
  },
  {
    path:    'courses/:courseId',
    element: CourseDetailPage,
    section: null,
    label:   null,
    icon:    null,
    hideInMenu: true,
  },
  {
    path:    'presentations/:presentationId',
    element: PresentationDetailPage,
    section: null,
    label:   null,
    icon:    null,
    hideInMenu: true,
  },
  {
    path:    'videos/:videoId',
    element: VideoDetailPage,
    section: null,
    label:   null,
    icon:    null,
    hideInMenu: true,
  },
  {
    path:    'projects/:projectId',
    element: ProjectDetailsPage,
    section: null,
    label:   null,
    hideInMenu: true,
  },
]

export const studentRoutes = [
  {
    path:    'home',
    element: StudentHomePage,
    section: 'MENU',
    label:   'Home',
    icon:    'home.png',
    hideInMenu: false,
  },
  {
    path:    'courses/enrolled',
    element: EnrolledCoursesPage,
    section: 'MENU',
    label:   'Enrolled courses',
    icon:    'enrolled_courses.png',
    hideInMenu: false,
  },
  {
    path:    'exams',
    element: ExamsPage,
    section: 'MENU',
    label:   'Exams',
    icon:    'exam.png',
    hideInMenu: false,
  },
  {
    path:    'courses',
    element: AllCoursesPage,
    section: 'MENU',
    label:   'Browse courses',
    icon:    'browse_courses.png',
    hideInMenu: false,
  },
  {
    path:    'quiz',
    element: QuizPage,
    section: 'MENU',
    label:   'Feeling brave?',
    icon:    'feeling_brave.png',
    hideInMenu: false,
  },
  {
    path:    'projects',
    element: StudentProjectPage,
    section: 'MENU',
    label:   'Projects',
    // TODO: Add icon
    icon:    'feeling_brave.png',
    hideInMenu: false,
  },
  {
    path:       'projects/create',
    element:    StudentProjectCreatePage,
    section:    null,
    label:      null,
    icon:       null,
    hideInMenu: true,
  },
]

export const teacherRoutes = [
  {
    path:    'home',
    element: TeacherHomePage,
    section: 'MENU',
    label:   'Home',
    icon:    'home.png',
    hideInMenu: false,
  },
  {
    path:    'courses',
    element: TeacherCoursesPage,
    section: 'MENU',
    label:   'My Courses',
    icon:    'enrolled_courses.png',
    hideInMenu: false,
  },
  {
    path:    'courses/create',
    element: CourseFormPage,
    section: null,
    label:   null,
    icon:    null,
    hideInMenu: true,
  },
  {
    path:    'courses/:courseId/edit',
    element: CourseFormPage,
    section: null,
    label:   null,
    icon:    null,
    hideInMenu: true,
  },
  {
    path:    'videos',
    element: TeacherVideosPage,
    section: 'MENU',
    label:   'My Videos',
    icon:    'enrolled_courses.png',
    hideInMenu: false,
  },
  {
    path:    'videos/create',
    element: VideoFormPage,
    section: null,
    label:   null,
    icon:    null,
    hideInMenu: true,
  },
  {
    path:    'videos/:videoId/edit',
    element: VideoFormPage,
    section: null,
    label:   null,
    icon:    null,
    hideInMenu: true,
  },
  {
    path:    'presentations',
    element: TeacherPresentationsPage,
    section: 'MENU',
    label:   'My Presentations',
    icon:    'enrolled_courses.png',
    hideInMenu: false,
  },
  {
    path:    'presentations/create',
    element: PresentationFormPage,
    section: null,
    label:   null,
    icon:    null,
    hideInMenu: true,
  },
  {
    path:    'presentations/:presentationId/edit',
    element: PresentationFormPage,
    section: null,
    label:   null,
    icon:    null,
    hideInMenu: true,
  },
  {
    path:    'courses/:courseId/projects',
    element: TeacherProjectsPage,
    section: null,
    label:   null,
    icon:    null,
    hideInMenu: true,
  },
]

export const routesConfig = {
  shared:  sharedPortalRoutes,
  student: studentRoutes,
  teacher: teacherRoutes
}
