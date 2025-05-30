import { Button } from '../../../shared/components/Button'

export function TwoColumnSection({
  imageUrl,
  title,
  text,
  learnLink,
  joinLink,
  reverse = false
}) {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className={`col-md-6 ${reverse ? 'order-md-2' : ''}`}>
            <img
              src={imageUrl}
              alt={title}
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">{title}</h2>
            <p className="mb-4 text-muted">{text}</p>
            <div className="d-flex gap-2">
              <Button variant="outline-light" to={learnLink}>
                Learn More
              </Button>
              <Button variant="primary" to={joinLink}>
                Join &rarr;
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
