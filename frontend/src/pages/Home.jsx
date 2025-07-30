import React from 'react'
import Header from '../components/Header'
import Hero from './Hero'
import AboutDetails from './AboutDetails'
import FeaturesSection from './Features'
import AssetCard from './Assetcard'
import Footer from '../components/Footer'
import Testimonial from './Testimonial'
const Home = () => {
  return (
    <div>
        <Header/>
        <Hero/>
        <AboutDetails/>
        <FeaturesSection/>
        <AssetCard/>
        <Testimonial/>
        <Footer/>
    </div>
  )
}

export default Home