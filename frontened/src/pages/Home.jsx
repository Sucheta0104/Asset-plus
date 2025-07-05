import React from 'react'
import Header from '../components/Header'
import Hero from './Hero'
import About from './About'
import FeaturesSection from './Features'
import Contact from './Contact'
import Footer from '../components/Footer'
import Testimonial from './Testimonial'
const Home = () => {
  return (
    <div>
        <Header/>
        <Hero/>
        <About/>
        <FeaturesSection/>
        <Testimonial/>
        <Contact/>
        <Footer/>
    </div>
  )
}

export default Home