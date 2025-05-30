import { Link } from 'react-router-dom'
import { useEffect } from 'react'

var course_img = require('../assets/default_course_img.jpg')
var holding_books = require('../assets/holding-books.jpg')
var studying_together = require('../assets/studying-together.jpg')
var teach = require('../assets/teach.jpg')

function Home() {
    useEffect(
        ()=>{
          document.title='LMS | Home'
        }
    )
    return (
        <div className="container mt-4">
            
            <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={teach} className="d-block w-100" alt="..."/>
                        <div className="carousel-caption d-none d-md-block">
                            <h5>First slide label</h5>
                            <p>Some representative placeholder content for the first slide.</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={studying_together} className="d-block w-100" alt="..."/>
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Second slide label</h5>
                            <p>Some representative placeholder content for the second slide.</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={holding_books} className="d-block w-100" alt="..."/>
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Third slide label</h5>
                            <p>Some representative placeholder content for the third slide.</p>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <h3 className='border-bottom pb-1 mb-4 mt-5'>Latest Courses
                <Link to="/courses" className='float-end'>See all</Link>
            </h3>
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card border-secondary mb-3">
                        <Link to="/course/1"><img src={course_img} className="card-img-top" alt="img"></img></Link>
                        <div className="card-body">
                            <h4 className="card-title">
                                <Link to="/course/1" style={{ textDecoration: 'none' }}>Course 1</Link>
                            </h4>
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-secondary mb-3">
                        <img src={course_img} className="card-img-top" alt="img"></img>
                        <div className="card-body">
                            <h4 className="card-title">Course title</h4>
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className='border-bottom pb-1 my-4 mb-4 mt-5'>Your Courses</h3>
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card border-secondary mb-3">
                        <img src={course_img} className="card-img-top" alt="img"></img>
                        <div className="card-body">
                            <h4 className="card-title">Course title</h4>
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-secondary mb-3">
                        <img src={course_img} className="card-img-top" alt="img"></img>
                        <div className="card-body">
                            <h4 className="card-title">Course title</h4>
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

  export default Home