import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode, FiUser, FiMail, FiMenu, FiX } from 'react-icons/fi';
import RotatingProfilePicture from './RotatingProfilePicture';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.scrolled ? 
    'rgba(10, 10, 15, 0.95)' : 
    'rgba(10, 10, 15, 0.8)'};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;



const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 15, 0.98);
  backdrop-filter: blur(20px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  @media (min-width: 769px) {
    display: none;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(({ active, ...props }) => <Link {...props} />)`
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: rgba(0, 212, 255, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -8px;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background: ${props => props.theme.gradients.primary};
    transform: translateX(-50%);
    transition: width 0.3s ease;
    border-radius: 1px;
  }

  &:hover::after {
    width: 100%;
  }
`;

const MobileNavLink = styled(NavLink)`
  font-size: 1.2rem;
  padding: 1rem 2rem;
  
  &::after {
    display: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const navItems = [
  { path: '/', label: 'Home', icon: FiUser, type: 'route' },
  { path: '#about', label: 'About', icon: FiUser, type: 'scroll' },
  { path: '#skills', label: 'Skills', icon: FiCode, type: 'scroll' },
  { path: '#projects', label: 'Projects', icon: FiCode, type: 'scroll' },
  { path: '#contact', label: 'Contact', icon: FiMail, type: 'scroll' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <Nav
        scrolled={scrolled}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NavContainer>
          <LogoContainer to="/">
            <RotatingProfilePicture size="40px" />

          </LogoContainer>
          
          <NavList>
            {navItems.map(({ path, label, icon: Icon, type }) => (
              <NavItem key={path}>
                {type === 'scroll' ? (
                  <NavLink 
                    as="a"
                    href={path}
                    active={false}
                    onClick={(e) => {
                      e.preventDefault();
                      // If not on home page, navigate to home first
                      if (location.pathname !== '/') {
                        window.location.href = `/${path}`;
                      } else {
                        const element = document.querySelector(path);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </NavLink>
                ) : (
                  <NavLink 
                    to={path} 
                    active={location.pathname === path}
                    onClick={(e) => {
                      // If clicking Home while already on home page, scroll to top
                      if (path === '/' && location.pathname === '/') {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </NavLink>
                )}
              </NavItem>
            ))}
          </NavList>

          <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </MobileMenuButton>
        </NavContainer>
      </Nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CloseButton onClick={() => setMobileMenuOpen(false)}>
              <FiX />
            </CloseButton>
            
            {navItems.map(({ path, label, icon: Icon, type }) => (
              <motion.div
                key={path}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {type === 'scroll' ? (
                  <MobileNavLink 
                    as="a"
                    href={path}
                    active={false}
                    onClick={(e) => {
                      e.preventDefault();
                      // If not on home page, navigate to home first
                      if (location.pathname !== '/') {
                        window.location.href = `/${path}`;
                      } else {
                        const element = document.querySelector(path);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon size={20} />
                    {label}
                  </MobileNavLink>
                ) : (
                  <MobileNavLink 
                    to={path} 
                    active={location.pathname === path}
                    onClick={(e) => {
                      // If clicking Home while already on home page, scroll to top
                      if (path === '/' && location.pathname === '/') {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon size={20} />
                    {label}
                  </MobileNavLink>
                )}
              </motion.div>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
