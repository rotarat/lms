export function TwoColumnSection({
  imageUrl,
  title,
  text,
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
          </div>
        </div>
      </div>
    </section>
  )
}
