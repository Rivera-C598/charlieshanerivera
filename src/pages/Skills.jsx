import React from 'react';
import styled from '@emotion/styled';

const SkillsContainer = styled.div`
  padding: 5rem 5%;
  background-color: #0f0f1a;
  color: #e0e0e0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 3rem;
  color: #94d3fd;
  margin-bottom: 4rem;
  text-shadow: 0 0 15px rgba(148, 211, 253, 0.5);
`;

const SkillsTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
`;

const TabButton = styled.button`
  background-color: transparent;
  border: 2px solid #94d3fd;
  color: #94d3fd;
  padding: 1rem 2rem;
  margin: 0 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover, &.active {
    background-color: #94d3fd;
    color: #0f0f1a;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SkillCard = styled.div`
  background-color: #1a1a2e;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  }
`;

const SkillIcon = styled.div`
  font-size: 4rem;
  color: #94d3fd;
  margin-bottom: 1.5rem;
`;

const SkillName = styled.h3`
  font-size: 1.5rem;
  color: #e0e0e0;
`;

const Skills = () => {
  const [activeTab, setActiveTab] = React.useState('Technical');

  const skillsData = {
    Technical: [
      { name: 'JavaScript', icon: '💻' },
      { name: 'React', icon: '⚛️' },
      { name: 'Node.js', icon: '🚀' },
      { name: 'Python', icon: '🐍' },
      { name: 'Firebase', icon: '🔥' },
      { name: 'SQL', icon: '💾' },
    ],
    Creative: [
      { name: 'UI/UX Design', icon: '🎨' },
      { name: 'Figma', icon: '✒️' },
      { name: 'Photoshop', icon: '🖌️' },
      { name: 'Illustration', icon: '✏️' },
    ],
  };

  return (
    <SkillsContainer>
      <SectionTitle>My Expertise</SectionTitle>
      <SkillsTabs>
        <TabButton 
          className={activeTab === 'Technical' ? 'active' : ''} 
          onClick={() => setActiveTab('Technical')}
        >
          Technical
        </TabButton>
        <TabButton 
          className={activeTab === 'Creative' ? 'active' : ''} 
          onClick={() => setActiveTab('Creative')}
        >
          Creative
        </TabButton>
      </SkillsTabs>
      <SkillsGrid>
        {skillsData[activeTab].map((skill, index) => (
          <SkillCard key={index}>
            <SkillIcon>{skill.icon}</SkillIcon>
            <SkillName>{skill.name}</SkillName>
          </SkillCard>
        ))}
      </SkillsGrid>
    </SkillsContainer>
  );
};

export default Skills;