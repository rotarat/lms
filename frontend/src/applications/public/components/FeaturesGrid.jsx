import { Link } from 'react-router-dom'
import box from '../../../assets/box.png'

export function FeaturesGrid({ items }) {
  return (
    <section className="py-5">
      <div className="container text-right mb-5">
        <h2 className="fw-bold">Explore Our Innovative Learning<br/>Features for Enhanced Education</h2>
      </div>
      <div className="container">
        <div className="row gx-4 gy-5">
          {items.map((f, i) => (
            <div key={i} className="col-md-4 text-right">
              <img src={box} alt="" className="mb-3" width="48" height="48"/>
              <h5 className="fw-bold">{f.title}</h5>
              <p className="text-muted">{f.description}</p>
              <Link to={f.to} className="text-primary">
                {f.linkText} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
