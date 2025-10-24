import React from 'react';
import styled from '@emotion/styled';

const SidebarContainer = styled.div`
  width: ${props => props.width || '400px'};
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  padding: 0;

  @media (max-width: 1024px) {
    width: 350px;
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-100%'};
    width: 100%;
    height: 100%;
    transition: right 0.3s ease;
    z-index: 1001;
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  z-index: 10;
`;

const SidebarContent = styled.div`
  padding: 2rem;
`;

const Sidebar = ({ 
  isOpen, 
  width,
  header, 
  children, 
  onClick 
}) => {
  return (
    <SidebarContainer 
      isOpen={isOpen} 
      width={width}
      onClick={onClick}
    >
      {header && (
        <SidebarHeader>
          {header}
        </SidebarHeader>
      )}
      
      <SidebarContent>
        {children}
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;