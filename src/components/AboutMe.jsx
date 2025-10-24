import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';


const AboutContainer = styled.section`
  padding: 4rem 2rem;
  background: ${props => props.theme.gradients.dark};
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4rem;
  font-weight: 700;
`;

const AboutContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;



const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const AboutText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
`;





const AboutMe = () => {

  return (
    <AboutContainer>
      <AnimatedBackground />
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          About Me
        </SectionTitle>

        <AboutContent>


          <TextSection>
            <AboutText>
              I'm a passionate creator who lives at the intersection of technology and art. 
              My journey began with curiosity about how digital worlds are built, which evolved 
              into a deep love for crafting both functional applications and stunning visual experiences.
            </AboutText>

            <AboutText>
              Whether I'm architecting scalable web applications, creating immersive digital art, 
              or building interactive experiences that blur the line between code and creativity, 
              I bring the same attention to detail and innovative thinking to every project.
            </AboutText>


          </TextSection>
        </AboutContent>

      </Container>
    </AboutContainer>
  );
};

export default AboutMe;