import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCode, FiImage, FiDatabase, FiCloud, FiSmartphone, FiTool,
  FiMonitor, FiLayers, FiServer, FiZap
} from 'react-icons/fi';
import AnimatedBackground from './AnimatedBackground';

const SkillsContainer = styled.section`
  padding: 8rem 2rem;
  background: ${props => props.theme.gradients.dark};
  position: relative;
  overflow: hidden;
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
  margin-bottom: 2rem;
  font-weight: 700;
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SkillsTabs = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
`;

const TabButton = styled(({ active, ...props }) => <motion.button {...props} />)`
  background: ${props => props.active ?
    props.theme.gradients.primary :
    'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ?
    'white' :
    props.theme.colors.text};
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 25px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.active ?
      props.theme.gradients.primary :
      props.theme.colors.primary};
    color: white;
    transform: translateY(-2px);
  }
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme.shadows.large};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.theme.gradients.primary};
  }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SkillIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 15px;
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillName = styled.h3`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  margin-bottom: 0.3rem;
`;

const SkillDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 1.5rem;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span`
  background: rgba(0, 212, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const skillsData = {
  frontend: [
    {
      name: 'Web Technologies',
      icon: FiCode,
      description: 'Core web development technologies for building modern, responsive websites.',
      tags: ['HTML', 'CSS', 'JavaScript']
    },
    {
      name: 'React & Next.js',
      icon: FiZap,
      description: 'Building dynamic, scalable web applications with React ecosystem and server-side rendering.',
      tags: ['React.js', 'Next.js']
    },
    {
      name: 'TypeScript',
      icon: FiLayers,
      description: 'Type-safe JavaScript development for more maintainable and robust applications.',
      tags: ['TypeScript', 'Type Safety', 'Modern JS']
    }
  ],
  backend: [
    {
      name: 'Node.js & Express',
      icon: FiServer,
      description: 'Server-side JavaScript development for building APIs and web applications.',
      tags: ['Node.js', 'Express']
    },
    {
      name: 'Database Management',
      icon: FiDatabase,
      description: 'Working with relational databases for data storage and management.',
      tags: ['MySQL']
    },
    {
      name: 'Cloud Services',
      icon: FiCloud,
      description: 'Backend-as-a-Service platform for rapid application development.',
      tags: ['Firebase', 'Authentication', 'Real-time Database']
    }
  ],
  mobile: [
    {
      name: 'React Native',
      icon: FiSmartphone,
      description: 'Cross-platform mobile app development using React Native framework.',
      tags: ['React Native', 'Mobile Development', 'Cross-platform']
    },
    {
      name: 'Java Development',
      icon: FiCode,
      description: 'Object-oriented programming and application development with Java.',
      tags: ['Java', 'OOP', 'Backend Development']
    },
    {
      name: 'PHP Development',
      icon: FiServer,
      description: 'Server-side scripting and web development with PHP.',
      tags: ['PHP', 'Web Development', 'Server-side']
    }
  ],
  creative: [
    {
      name: 'Digital Art',
      icon: FiImage,
      description: 'Creating stunning digital artwork across various styles and mediums.',
      tags: ['Concept Art', 'Illustration', 'Character Design']
    },
    {
      name: 'Logo Design',
      icon: FiTool,
      description: 'Crafting memorable brand identities and visual logos for businesses.',
      tags: ['Logo Design', 'Branding', 'Visual Identity']
    }
  ]
};

const tabConfig = [
  { key: 'frontend', label: 'Frontend', icon: FiCode },
  { key: 'backend', label: 'Backend', icon: FiServer },
  { key: 'mobile', label: 'Mobile & Languages', icon: FiSmartphone },
  { key: 'creative', label: 'Digital Art', icon: FiImage }
];

const Skills = () => {
  const [activeTab, setActiveTab] = useState('frontend');

  return (
    <SkillsContainer>
      <AnimatedBackground />
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          Skills & Expertise
        </SectionTitle>

        <SectionSubtitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          A comprehensive overview of my technical and creative capabilities
        </SectionSubtitle>

        <SkillsTabs
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {tabConfig.map((tab, index) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon size={18} />
              {tab.label}
            </TabButton>
          ))}
        </SkillsTabs>

        <AnimatePresence mode="wait">
          <SkillsGrid
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            {skillsData[activeTab].map((skill, index) => (
              <SkillCard
                key={skill.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <SkillHeader>
                  <SkillIcon>
                    <skill.icon />
                  </SkillIcon>
                  <SkillInfo>
                    <SkillName>{skill.name}</SkillName>
                  </SkillInfo>
                </SkillHeader>

                <SkillDescription>{skill.description}</SkillDescription>

                <SkillTags>
                  {skill.tags.map((tag) => (
                    <SkillTag key={tag}>{tag}</SkillTag>
                  ))}
                </SkillTags>
              </SkillCard>
            ))}
          </SkillsGrid>
        </AnimatePresence>
      </Container>
    </SkillsContainer>
  );
};

export default Skills;