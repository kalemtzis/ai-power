import LandingContent from '@/components/landing/LandingContent'
import LandingHero from '@/components/landing/LandingHero'
import LanindNavbar from '@/components/landing/LanindNavbar'

const LandingPage = () => {
  return (
    <div className='h-full'>
      <LanindNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  )
}

export default LandingPage
