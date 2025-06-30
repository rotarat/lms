import { PublicNavbar } from '../components/PublicNavbar'
import { HeaderSection } from '../components/HeaderSection'
import banner from '../../../assets/banner.png'
import education_home from '../../../assets/education_home.png'
import potential from '../../../assets/potential.jpg'
import { TwoColumnSection }  from '../components/TwoColumnSection'
import { FeaturesGrid } from '../components/FeaturesGrid'
import { CTASection }   from '../components/CTASection'
import { Footer }       from '../../../shared/components/Footer'

const featureItems = [
  {
    iconUrl: '/icons/ai.svg',
    title: 'Transform Your Learning Experience with Cutting-Edge Tools',
    description: 'Our AI tutor is available to assist you anytime, ensuring you never feel lost.',
    to: '/ai/chat'
  },
  {
    iconUrl: '/icons/diagram.svg',
    title: 'Create Stunning Diagrams with Our Easy-to-Use Generator',
    description: 'Visualize your ideas effortlessly with our intuitive diagram generator.',
    to: '/ai/diagrams'
  },
  {
    iconUrl: '/icons/mindmap.svg',
    title: 'Unlock Your Creativity with Our Open Ended Questions and Quizzes',
    description: 'Organize your thoughts and brainstorm effectively with our ai powered tools.',
    to: '/ai/mindmap'
  }
]

export default function HomePage() {
  return (
    <>
      <PublicNavbar />

      <HeaderSection
        backgroundUrl={banner}
        title="Learn. Grow. Succeed."
        subtitle="Discover a wide range of engaging courses tailored to enhance your educational journey."
        buttons={[
          {
            to: '/register',
            label: 'Join Us',
            variant: 'primary',
            outline: false,
          }
        ]}
      />

      <TwoColumnSection
        imageUrl={education_home}
        title='Transforming Education for Every Learner'
        text="Our platform is dedicated to providing accessible, high-quality education through innovative learning methods. We believe in fostering curiosity, creativity, and collaboration among students and educators alike."
        learnLink="#"
        joinLink="/register"
      />

      <FeaturesGrid items={featureItems} />

      <CTASection
        title="Unlock Your Learning Potential"
        text="Join our platform today and access a wealth of knowledge and resources at no cost."
        enrollLink="/register"
        learnLink="#"
        imageUrl={potential}
      />

      <Footer />
    </>
  )
}
