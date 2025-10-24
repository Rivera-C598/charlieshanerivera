import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, Global, css } from '@emotion/react';
import styled from '@emotion/styled';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Art from './pages/Art';
import Skills from './pages/Skills';
import Contact from './pages/Contact';

const theme = {
  colors: {
    primary: '#00d4ff',
    secondary: '#ff6b6b',
    accent: '#7c3aed',
    background: '#0a0a0f',
    cardBackground: 'rgba(20, 20, 35, 0.8)',
    surface: '#1a1a2e',
    text: '#ffffff',
    lightText: '#a0a0a0',
    muted: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
    secondary: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
    dark: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
    card: 'linear-gradient(135deg, rgba(20, 20, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
    large: '0 8px 32px rgba(0, 0, 0, 0.2)',
    glow: '0 0 20px rgba(0, 212, 255, 0.3)',
    glowHover: '0 0 30px rgba(0, 212, 255, 0.5)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  },
};

const GlobalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: ${theme.gradients.dark};
    background-attachment: fixed;
    color: ${theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 107, 107, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    color: ${theme.colors.text};
    font-weight: 600;
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: ${theme.colors.lightText};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    background: rgba(0, 212, 255, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
  }

  ::selection {
    background: rgba(0, 212, 255, 0.3);
    color: ${theme.colors.text};
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.accent};
  }
`;

const AppContainer = styled.div`
  /* Add any overall app container styles here if needed */
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Global styles={GlobalStyles} />
      <BrowserRouter>
        <AppContainer>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/art" element={<Art />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
