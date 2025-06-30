import { useEffect, useState } from 'react'
import { PublicNavbar } from '../components/PublicNavbar'
import { HeaderSection } from '../components/HeaderSection'
import { CourseFeaturesList } from '../components/CourseFeaturesList'
import { Footer }       from '../../../shared/components/Footer'
import { coursesApi }   from '../../../shared/api/resourses'
import { CardList }     from '../../../shared/components/CardList'
import { ResourceCard } from '../../../shared/components/ResourceCard'
import banner from '../../../assets/banner.png'

export default function PublicCourses() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    coursesApi
      .list({ page: 1, page_size: 3 })
      .then(setCourses)
      .catch(console.error)
  }, [])

  return (
    <>
      <PublicNavbar />
      <HeaderSection
        backgroundUrl={banner}
        title="Diverse Learning Paths"
        subtitle="At our platform, we foster a community of innovation, collaboration, and lifelong learning."
      />

      <CourseFeaturesList />

      <section className="py-5">
        <div className="container text-center mb-4">
          <h2 className="fw-bold">Explore Our Course Offerings</h2>
          <p className="text-muted">Discover a variety of engaging learning experiences.</p>
        </div>
        <div className="container">
          <CardList
            items={courses}
            cols={3}
            renderItem={course => (
              <ResourceCard
                key={course.id}
                to={`/courses/${course.id}`}
                imageSrc={course.image_url}
                imageAlt={course.title}
                title={course.title}
                description={(course.description || '').slice(0, 100) + (course.description?.length > 100 ? '…' : '')}
              />
            )}
          />
        </div>
      </section>
      <Footer />
    </>
  )
}
