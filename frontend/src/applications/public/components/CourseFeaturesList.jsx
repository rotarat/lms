import { useNavigate } from 'react-router-dom'
import quantum_computer from '../../../assets/quantum-computer-pb.jpg'
import { Button } from '../../../shared/components/Button'

  
export function CourseFeaturesList() {
  const navigate = useNavigate()

  return (
    <section className="container py-5">

      {/* Image + Features */}
      <div className="row align-items-center g-5">

        {/* Left image */}
        <div className="col-md-6">
          <img
            src={quantum_computer}
            alt="Course feature illustration"
            className="img-fluid rounded"
          />
        </div>

        {/* Right list with a vertical divider */}
        <div className="col-md-6 border-start border-2 ps-4">
          <div className="mb-5">
            <h4 className="fw-bold">
              Unlocking New Realms: The Future of Quantum Processing and Computing
            </h4>
            <p className="text-muted">
              Quantum computing signifies a groundbreaking leap in technology that utilizes
              the concepts of quantum mechanics. Its significance is found in its ability to
              address intricate issues considerably quicker than traditional computers,
              influencing sectors like cryptography, healthcare, and artificial intelligence.
              This advancement may result in significant progress in drug development,
              data protection, and optimization challenges.
            </p>
          </div>

          <div className="mb-5">
            <h4 className="fw-bold">
              Open the Door to Tomorrow: Explore Quantum Computing!
            </h4>
            <p className="text-muted">
              Learning quantum computing is essential for students as it fosters critical
              thinking and problem-solving abilities while opening doors to breakthroughs
              in various fields and empowers them to contribute to groundbreaking
              advancements.
            </p>
          </div>

          <div>
            <h4 className="fw-bold">
              The Exciting World of Quantum Computing: Unleashing Fun in Tech
            </h4>
            <p className="text-muted">
              Challenge your understanding of computation and explore an entirely new
              dimension of technology!
            </p>
          </div>
        </div>

        {/* Hero Intro with gradient */}
        <div
          className="text-center text-white py-1"
        >
          <h2 className="fw-bold display-5 lh-base">
            Elevate Your Skills: Enroll in Our
            <br />Game-Changing Courses!
            
          </h2>

          <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
            Our platform offers courses that cater to all learning styles and levels,
            providing diverse content that is both engaging and effective. With expert
            instructors leading each course, you'll gain valuable insights and skills
            that can be applied immediately. Joining our community also means access
            to support and resources tailored to help you succeed on your learning journey.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button 
              variant="primary"
              onClick={() => navigate('/register')}
            >
              Sign Up &rsaquo;
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
