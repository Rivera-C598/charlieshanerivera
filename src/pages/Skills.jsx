import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCode, FiImage, FiDatabase, FiCloud, FiSmartphone, FiTool,
  FiMonitor, FiLayers, FiServer, FiZap
} from 'react-icons/fi';
import AnimatedBackground from '../components/AnimatedBackground';

const SkillsContainer = styled.section`
  padding: 8rem 2rem;
  min-height: 100vh;
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

const SkillLevel = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
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
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.lightText};
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.theme.gradients.primary};
  border-radius: 3px;
`;

const skillsData = {
  frontend: [
    {
      name: 'React & Next.js',
      level: 'Expert',
      progress: 95,
      icon: FiCode,
      description: 'Building modern, scalable web applications with React ecosystem and server-side rendering.',
      tags: ['React', 'Next.js', 'TypeScript', 'Redux', 'Context API']
    },
    {
      name: 'JavaScript & TypeScript',
      level: 'Expert',
      progress: 90,
      icon: FiZap,
      description: 'Advanced JavaScript programming with TypeScript for type-safe, maintainable code.',
      tags: ['ES6+', 'TypeScript', 'Async/Await', 'Modules', 'Testing']
    },
    {
      name: 'CSS & Styling',
      level: 'Advanced',
      progress: 85,
      icon: FiLayers,
      description: 'Modern CSS techniques, animations, and responsive design with various frameworks.',
      tags: ['CSS3', 'Sass', 'Styled Components', 'Tailwind', 'Framer Motion']
    }
  ],
  backend: [
    {
      name: 'Node.js & Express',
      level: 'Advanced',
      progress: 85,
      icon: FiServer,
      description: 'Building robust APIs and server-side applications with Node.js ecosystem.',
      tags: ['Express', 'Fastify', 'REST APIs', 'GraphQL', 'Middleware']
    },
    {
      name: 'Databases',
      level: 'Advanced',
      progress: 80,
      icon: FiDatabase,
      description: 'Working with both SQL and NoSQL databases for optimal data management.',
      tags: ['MongoDB', 'PostgreSQL', 'Redis', 'Prisma', 'Mongoose']
    },
    {
      name: 'Cloud & DevOps',
      level: 'Intermediate',
      progress: 75,
      icon: FiCloud,
      description: 'Deploying and managing applications on cloud platforms with modern DevOps practices.',
      tags: ['AWS', 'Docker', 'CI/CD', 'Vercel', 'GitHub Actions']
    }
  ],
  creative: [
    {
      name: 'Digital Art & Design',
      level: 'Advanced',
      progress: 90,
      icon: FiImage,
      description: 'Creating stunning digital artwork, illustrations, and visual designs.',
      tags: ['Photoshop', 'Procreate', 'Illustrator', 'Digital Painting', 'Concept Art']
    },
    {
      name: '3D Modeling & Animation',
      level: 'Intermediate',
      progress: 70,
      icon: FiMonitor,
      description: 'Building 3D models, scenes, and animations for various creative projects.',
      tags: ['Blender', 'Cinema 4D', '3D Modeling', 'Animation', 'Rendering']
    },
    {
      name: 'UI/UX Design',
      level: 'Advanced',
      progress: 85,
      icon: FiTool,
      description: 'Designing intuitive user interfaces and experiences with modern design principles.',
      tags: ['Figma', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems']
    }
  ],
  mobile: [
    {
      name: 'React Native',
      level: 'Intermediate',
      progress: 75,
      icon: FiSmartphone,
      description: 'Cross-platform mobile development with React Native and Expo.',
      tags: ['React Native', 'Expo', 'Navigation', 'Native Modules', 'App Store']
    },
    {
      name: 'Mobile UI/UX',
      level: 'Advanced',
      progress: 80,
      icon: FiLayers,
      description: 'Designing mobile-first interfaces with platform-specific guidelines.',
      tags: ['iOS Design', 'Material Design', 'Mobile Patterns', 'Responsive', 'Accessibility']
    }
  ]
};

const tabConfig = [
  { key: 'frontend', label: 'Frontend', icon: FiCode },
  { key: 'backend', label: 'Backend', icon: FiServer },
  { key: 'creative', label: 'Creative', icon: FiImage },
  { key: 'mobile', label: 'Mobile', icon: FiSmartphone }
];

const Skills = () => {
  const [activeTab, setActiveTab] = useState('frontend');

  return (
    <SkillsContainer>
      <AnimatedBackground />
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Skills & Expertise
        </SectionTitle>

        <SectionSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A comprehensive overview of my technical and creative capabilities
        </SectionSubtitle>

        <SkillsTabs
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {tabConfig.map((tab, index) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
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
                    <SkillLevel>{skill.level}</SkillLevel>
                  </SkillInfo>
                </SkillHeader>

                <SkillDescription>{skill.description}</SkillDescription>

                <ProgressBar>
                  <ProgressFill
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </ProgressBar>

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