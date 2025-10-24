import React from 'react';
import Hero from '../components/Hero';
import AboutMe from '../components/AboutMe';
import FeaturedProjects from '../components/FeaturedProjects';

const Home = () => {
  return (
    <div>
      <Hero />
      <AboutMe />
      <FeaturedProjects />
    </div>
  );
};

export default Home;