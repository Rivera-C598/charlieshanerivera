import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiFolder, 
  FiImage, 
  FiStar, 
  FiTag, 
  FiLogOut,
  FiMenu,
  FiX,
  FiBarChart2
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.gradients.dark};
`;

const Sidebar = styled(motion.aside)`
  width: 250px;
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;

  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.isOpen ? '0' : '-100%'};
    transition: left 0.3s ease;
    box-shadow: ${props => props.isOpen ? '0 0 20px rgba(0, 0, 0, 0.5)' : 'none'};
  }
`;

const Logo = styled.div`
  padding: 0 1.5rem;
  margin-bottom: 2rem;
`;

const LogoText = styled.h2`
  font-size: 1.5rem;
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.lightText};
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  background: ${props => props.active ? 'rgba(0, 212, 255, 0.1)' : 'transparent'};

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: rgba(0, 212, 255, 0.05);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  color: ${props => props.theme.colors.secondary};
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;
  margin-top: auto;

  &:hover {
    background: rgba(255, 107, 107, 0.1);
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  font-weight: 700;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: ${props => props.theme.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.text};
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled(motion.div)`
  display: none;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`;

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: FiHome },
  { path: '/admin/projects', label: 'Projects', icon: FiFolder },
  { path: '/admin/art', label: 'Artworks', icon: FiImage },
  { path: '/admin/tags', label: 'Tags', icon: FiTag },
  { path: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
];

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/admin/login');
    }
  };

  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen}>
        <Logo>
          <LogoText>Admin Panel</LogoText>
        </Logo>

        <Nav>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              active={location.pathname === item.path ? 1 : 0}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              {item.label}
            </NavItem>
          ))}
        </Nav>

        <LogoutButton onClick={handleLogout}>
          <FiLogOut size={20} />
          Logout
        </LogoutButton>
      </Sidebar>

      <Overlay 
        isOpen={sidebarOpen}
        onClick={() => setSidebarOpen(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: sidebarOpen ? 1 : 0 }}
      />

      <MainContent>
        <Header>
          <PageTitle>{title}</PageTitle>
          <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </MobileMenuButton>
        </Header>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;
