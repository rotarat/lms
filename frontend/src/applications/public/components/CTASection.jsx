import { Button } from '../../../shared/components/Button'

export function CTASection({
  title = 'Unlock Your Learning Potential',
  text = 'Join our platform today and access a wealth of knowledge and resources at no cost.',
  enrollLink = '/register',
  learnLink = '#',
  imageUrl = '/images/cta.jpg'
}) {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center gy-4">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">{title}</h2>
            <p className="text-muted mb-4">{text}</p>
            <div className="d-flex gap-2">
              <Button variant="primary" href={enrollLink}>
                Enroll
              </Button>
              <Button variant="outline-light" href={learnLink}>
                Learn More
              </Button>
            </div>
          </div>
          <div className="col-md-6 text-center">
            <img
              src={imageUrl}
              alt={title}
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
