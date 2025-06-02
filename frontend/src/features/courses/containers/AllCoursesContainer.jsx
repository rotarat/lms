import { useAllCourses } from '../hooks/useAllCourses';
import AllCoursesUI from '../components/AllCoursesUI';

export default function AllCoursesContainer() {
  const { courses, page, totalPages, setPage, loading, error } = useAllCourses();

  return (
    <AllCoursesUI
      courses={courses}
      page={page}
      totalPages={totalPages}
      setPage={setPage}
      loading={loading}
      error={error}
    />
  );
}
