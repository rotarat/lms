export function CTASection({
  title = 'Unlock Your Learning Potential',
  text = 'Join our platform today and access a wealth of knowledge and resources at no cost.',
  imageUrl = '/images/cta.jpg'
}) {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center gy-4">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">{title}</h2>
            <p className="text-muted mb-4">{text}</p>
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
