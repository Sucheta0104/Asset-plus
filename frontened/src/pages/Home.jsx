import React from 'react'
import Header from '../components/Header'
import Hero from './Hero'
import About from './About'
import FeaturesSection from './Features'
import Pricing from './Pricing'
import Contact from './Contact'
import Footer from '../components/Footer'
const Home = () => {
  return (
    <div>
        <Header/>
        <Hero/>
        <About/>
        <FeaturesSection/>
        <Pricing/>
        <Contact/>
        <Footer/>
    </div>
  )
}

export default Home