import React from 'react';
import styled from '@emotion/styled';

const AboutContainer = styled.div`
  padding: 4rem 5%;
  background-color: #1a1a2e;
  color: #e0e0e0;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #94d3fd;
  margin-bottom: 2rem;
`;

const AboutContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AboutImage = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 15px;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

const AboutText = styled.p`
  max-width: 600px;
  font-size: 1.1rem;
  line-height: 1.8;
  text-align: left;
`;

const AboutMe = () => {
  return (
    <AboutContainer>
      <SectionTitle>About Me</SectionTitle>
      <AboutContent>
        <AboutImage 
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="About Me" 
        />
        <AboutText>
          I am a passionate and driven software developer with a strong foundation in front-end and back-end technologies. 
          My journey in tech began with a fascination for how things work, which led me to pursue a career in creating elegant and efficient solutions. 
          I thrive on challenges and am constantly learning to stay at the forefront of the ever-evolving tech landscape. 
          When I'm not coding, I enjoy exploring digital art, contributing to open-source projects, and gaming.
        </AboutText>
      </AboutContent>
    </AboutContainer>
  );
};

export default AboutMe;