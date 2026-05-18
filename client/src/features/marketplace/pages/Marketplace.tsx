import DashboardNavbar from "../components/DashboardNavbar"
import PropertiesCategories from "../components/propertiesCategories"
import PopularLocations from "../components/PopularLocations"
import WhyUs from "../components/WhyUs"
import HeroSection from "../components/HeroSection"
import FeaturedProperties from "../components/FeatureProperty"
import Testimonials from "../components/Testimonials"
import Footer from "../components/Footer"

function DashboardHome() {
  return (
    <>
    <DashboardNavbar/>
    <HeroSection />
    <FeaturedProperties />
    <PropertiesCategories />
    <PopularLocations />
    <WhyUs />
    <Testimonials />
    <Footer />
    
    </>
  )
}

export default DashboardHome