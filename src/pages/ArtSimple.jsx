import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import AnimatedBackground from '../components/AnimatedBackground';

const ArtContainer = styled.section`
  padding: 8rem 2rem 4rem;
  min-height: 100vh;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.gradients.dark};
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
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

const ArtGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ArtItem = styled(motion.div)`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 15px;
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
  }

  &:hover img {
    transform: scale(1.05);
  }

  &:hover > div:last-child {
    transform: translateY(0);
  }
`;

const ArtImage = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    height: 280px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

const ArtOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem 1.5rem 1.5rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
`;

const ArtTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ArtDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  overflow: auto;
`;

const ModalImageSection = styled.div`
  flex: 1;
  overflow: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  position: relative;
  min-height: 100vh;
`;

const ModalImageContainer = styled.div`
  position: relative;
  width: auto;
  height: auto;
  max-width: 90vw;
  max-height: 90vh;
  overflow: ${props => props.isZoomed ? 'hidden' : 'visible'};
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  cursor: ${props => props.isZoomed ? 'grab' : 'zoom-in'};
  display: inline-block;
  background: rgba(0, 0, 0, 0.1);

  &:active {
    cursor: ${props => props.isZoomed ? 'grabbing' : 'zoom-in'};
  }
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
  transform: ${props => `scale(${props.scale}) translate(${props.translateX}px, ${props.translateY}px)`};
  transform-origin: center center;
  display: block;
`;

const ModalSidebar = styled.div`
  width: 400px;
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  padding: 0;

  @media (max-width: 1200px) {
    width: 350px;
  }

  @media (max-width: 1024px) {
    width: 320px;
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    right: ${props => props.sidebarOpen ? '0' : '-100%'};
    width: 100%;
    height: 100%;
    transition: right 0.3s ease;
    z-index: 1001;
  }

  @media (max-width: 480px) {
    width: 100vw;
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

const ArtworkTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ArtworkYear = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: 1rem;
  font-weight: 500;
`;

const SidebarContent = styled.div`
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SidebarSectionTitle = styled.h3`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.lightText};
  line-height: 1.6;
  font-size: 0.95rem;
`;

const MetadataGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const MetadataItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const MetadataLabel = styled.span`
  color: ${props => props.theme.colors.muted};
  font-size: 0.9rem;
  font-weight: 500;
`;

const MetadataValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  text-align: right;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: rgba(0, 212, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ProcessSection = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 1002;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
`;

const ZoomHint = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1003;
`;

const MobileToggleButton = styled.button`
  display: none;
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  background: ${props => props.theme.colors.primary};
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
  z-index: 1002;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(0, 212, 255, 0.5);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavigationButtons = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;
  pointer-events: none;
`;

const NavButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  pointer-events: all;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const CrossNavigation = styled(motion.div)`
  margin-top: 6rem;
  display: flex;
  justify-content: center;
`;

const CrossNavCard = styled.div`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const CrossNavTitle = styled.h3`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const CrossNavDescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const CrossNavButton = styled(motion.create(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.gradients.primary};
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadows.glow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glowHover};
  }
`;

const artworksData = [
  {
    id: 1,
    title: "Ashes Beneath the Orbit's Roar",
    description: 'latest work so far',
    longDescription: 'When the sky cracks and the roar returns, the ashes shall rise once more. From the orbit’s edge, he descends not as flame, but as memory of fire.',
    medium: 'Digital Art',
    dimensions: null,
    year: '2024',
    software: 'Krita',
    tags: ['Character Design', 'Digital Art', 'Concept Art', 'Featured'],
    thumbnailUrl: '/assets/art/ashes-beneath-orbits-roar-bg.png',
    imageUrl: '/assets/art/ashes-beneath-orbits-roar-bg.png',
    process: '',
    inspiration: 'Inspired by cosmic mythology and the concept of divine destruction as a force of renewal.',
    techniques: ['Digital Painting', 'Character Design', 'Atmospheric Lighting', 'Color Theory'],
    featured: true
  },
  {
    id: 2,
    title: 'Celes - Remastered',
    description: '',
    longDescription: '',
    medium: 'Digital Art',
    dimensions: '',
    year: '2024',
    software: 'Krita',
    tags: ['Original Character', 'Character Design', 'Digital Art', 'Featured'],
    thumbnailUrl: '/assets/art/celes-remastered-bg.png',
    imageUrl: '/assets/art/celes-remastered-bg.png',
    process: '',
    inspiration: 'Redraw for an old Original Character.',
    techniques: ['Character Design', 'Digital Painting', 'Costume Design', 'Expression Work'],
    featured: true
  },
  {
    id: 3,
    title: 'Peace Among Worlds',
    description: '',
    longDescription: 'A personal artwork of mine, I didnt really have much of a plan for the whole process, I just thought about an angel flying with a weapon or something but I decided to take it in a more unorthodox direction',
    medium: 'Digital Art',
    dimensions: null,
    year: '2024',
    software: 'Krita',
    tags: ['Conceptual', 'Religious', 'Provocative', 'Digital Art'],
    thumbnailUrl: '/assets/art/peace-among-worlds.jpg',
    imageUrl: '/assets/art/peace-among-worlds.jpg',
    process: '',
    inspiration: 'Inspired by classical religious art and modern irreverent humor.',
    techniques: ['Digital Painting', 'Symbolic Art', 'Conceptual Design'],
  },
  {
    id: 4,
    title: 'Breaking Out of Character',
    description: '',
    longDescription: '',
    medium: 'Digital Art',
    dimensions: '',
    year: '2019',
    software: 'Krita',
    tags: ['Meta Art', 'Character Design', 'Conceptual', 'Digital Art'],
    thumbnailUrl: '/assets/art/breaking-out-of-character.png',
    imageUrl: '/assets/art/breaking-out-of-character.png',
    process: '',
    inspiration: '',
    techniques: ['Character Design', 'Conceptual Art', 'Digital Painting'],
  },
  {
    id: 5,
    title: 'Celestial Outlaw',
    description: 'A handful of interesting characters forged into one',
    longDescription: '',
    medium: 'Digital Art',
    dimensions: null,
    year: '2019',
    software: 'Krita',
    tags: ['Character Design', 'Fantasy', 'Celestial', 'Outlaw'],
    thumbnailUrl: '/assets/art/celestial-outlaw.png',
    imageUrl: '/assets/art/celestial-outlaw.png',
    process: '',
    inspiration: '',
    techniques: ['Character Design', 'Fantasy Art', 'Digital Painting'],
  },
  {
    id: 6,
    title: 'Damsel',
    description: 'some photo study I did years ago',
    longDescription: '',
    medium: 'Digital Art',
    dimensions: '',
    year: '2024',
    software: 'Krita',
    tags: ['Character Design', 'Fantasy', 'Digital Art'],
    thumbnailUrl: '/assets/art/damsel.png',
    imageUrl: '/assets/art/damsel.png',
    process: '',
    inspiration: '',
    techniques: ['Character Design', 'Fantasy Art', 'Digital Painting'],
  },
  {
    id: 7,
    title: 'Environment Studies',
    description: '',
    longDescription: 'finally touched some grass here. decided to draw some grass too',
    medium: 'Digital Art',
    dimensions: null,
    year: '2024',
    software: 'Krita',
    tags: ['Environment Art', 'Atmospheric', 'Studies', 'Digital Painting'],
    thumbnailUrl: '/assets/art/environment-studies.png',
    imageUrl: '/assets/art/environment-studies.png',
    process: '',
    inspiration: 'Inspired by various natural environments and their emotional impact.',
    techniques: ['Environment Design', 'Atmospheric Rendering', 'Digital Painting'],
  },
  {
    id: 8,
    title: 'Frigid Demise',
    description: 'The trouble is, you think you have time',
    longDescription: '',
    medium: 'Digital Art',
    dimensions: '2000 × 1980 px',
    year: '2020',
    software: 'Krita',
    tags: ['Dark Art', 'Winter', 'Mortality', 'Atmospheric'],
    thumbnailUrl: '/assets/art/frigid-demise.jpg',
    imageUrl: '/assets/art/frigid-demise.jpg',
    process: '',
    inspiration: 'Inspired by winter landscapes and themes of mortality.',
    techniques: ['Atmospheric Art', 'Color Theory', 'Digital Painting'],
  },
  {
    id: 9,
    title: 'Lone Custodian',
    description: 'A solitary guardian in an empty world',
    longDescription: '',
    medium: 'Digital Art',
    dimensions: '2435 x 3276px',
    year: '2020',
    software: 'Krita',
    tags: ['Character Design', 'Post-Apocalyptic', 'Solitude', 'Guardian'],
    thumbnailUrl: '/assets/art/lone-custodian.jpg',
    imageUrl: '/assets/art/lone-custodian.jpg',
    process: 'emphasize themes of solitude and duty.',
    inspiration: 'Inspired by post-apocalyptic fiction and themes of guardianship.',
    techniques: ['Character Design', 'Environment Art', 'Storytelling'],
  },
  {
    id: 10,
    title: 'Memories',
    description: 'Memories of my cat chonky',
    longDescription: 'his names chonky, he was very round when he was little so I named him that, he mostly sleeps all the time but quick on his feet when its time for food',
    medium: 'Digital Art',
    dimensions: null,
    year: '2024',
    software: 'Krita',
    tags: ['Abstract', 'Memories', 'Emotional', 'Conceptual'],
    thumbnailUrl: '/assets/art/memories.png',
    imageUrl: '/assets/art/memories.png',
    process: 'Created through intuitive painting techniques to capture the feeling of memory.',
    inspiration: 'Inspired by the ephemeral nature of human memory and nostalgia.',
    techniques: ['Abstract Art', 'Emotional Expression', 'Digital Painting'],
  },
  {
    id: 11,
    title: 'Popol and Kupa',
    description: 'Popol and Kupa from Mobile Legends Fanart',
    longDescription: '',
    medium: 'Digital Art',
    dimensions: '1920 × 1080 px',
    year: '2024',
    software: 'Krita',
    tags: ['Fan Art', 'Character Design', 'Digital Art', 'Tribute'],
    thumbnailUrl: '/assets/art/popol-and-kupa.png',
    imageUrl: '/assets/art/popol-and-kupa.png',
    process: '',
    inspiration: '',
    techniques: ['Fan Art', 'Character Design', 'Digital Painting'],
  },
  {
    id: 12,
    title: 'Stay',
    description: 'As the fire crackles, sparks in the dark, two strangers snuggled, both cozy, tired, and warm.',
    longDescription: '',
    medium: 'Digital Art',
    dimensions: '1920 × 1080 px',
    year: '2021',
    software: 'Krita',
    tags: ['Emotional', 'Character Art', 'Relationship', 'Digital Art'],
    thumbnailUrl: '/assets/art/stay.png',
    imageUrl: '/assets/art/stay.png',
    process: 'Developed to capture raw emotion and human connection.',
    inspiration: 'Inspired by moments of emotional vulnerability and human connection.',
    techniques: ['Emotional Art', 'Character Design', 'Digital Painting'],
  },
];

const ArtSimple = () => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageTransform, setImageTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const openModal = (artwork) => {
    const index = artworksData.findIndex(art => art.id === artwork.id);
    setCurrentIndex(index);
    setSelectedArtwork(artwork);
    setSidebarOpen(false);
    setImageTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  const closeModal = () => {
    setSelectedArtwork(null);
    setSidebarOpen(false);
    setImageTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  const navigateArtwork = (direction) => {
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % artworksData.length
      : (currentIndex - 1 + artworksData.length) % artworksData.length;

    setCurrentIndex(newIndex);
    setSelectedArtwork(artworksData[newIndex]);
    // Reset zoom and pan when changing artwork
    setImageTransform({ scale: 1, translateX: 0, translateY: 0 });
    setIsDragging(false);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    // Only handle single clicks when not dragging
    if (!isDragging) {
      if (imageTransform.scale === 1) {
        // Zoom in to 2x
        setImageTransform({ scale: 2, translateX: 0, translateY: 0 });
      } else {
        // Zoom out to fit
        setImageTransform({ scale: 1, translateX: 0, translateY: 0 });
      }
    }
  };

  const handleMouseDown = (e) => {
    if (imageTransform.scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && imageTransform.scale > 1) {
      e.preventDefault();
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setImageTransform(prev => {
        // Apply movement with smoother multiplier
        const newTranslateX = prev.translateX + deltaX;
        const newTranslateY = prev.translateY + deltaY;

        // Basic bounds checking to prevent dragging too far
        const maxTranslate = 200;
        const boundedX = Math.max(-maxTranslate, Math.min(maxTranslate, newTranslateX));
        const boundedY = Math.max(-maxTranslate, Math.min(maxTranslate, newTranslateY));

        return {
          ...prev,
          translateX: boundedX,
          translateY: boundedY
        };
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      e.preventDefault();
    }
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;

    setImageTransform(prev => {
      const newScale = Math.max(0.5, Math.min(4, prev.scale + delta));

      // Reset translation when zooming out to 1x or less
      if (newScale <= 1) {
        return { scale: 1, translateX: 0, translateY: 0 };
      }

      return { ...prev, scale: newScale };
    });
  };

  const handleKeyPress = (e) => {
    if (!selectedArtwork) return;

    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigateArtwork('prev');
    if (e.key === 'ArrowRight') navigateArtwork('next');
    if (e.key === 'i' || e.key === 'I') setSidebarOpen(!sidebarOpen);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedArtwork, currentIndex, sidebarOpen]);

  useEffect(() => {
    if (selectedArtwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedArtwork]);

  return (
    <ArtContainer>
      <AnimatedBackground />
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Art Gallery
        </SectionTitle>
        <ArtGrid
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {artworksData.map((artwork, index) => (
            <ArtItem
              key={artwork.id}
              onClick={() => openModal(artwork)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <ArtImage src={artwork.thumbnailUrl || artwork.imageUrl} alt={artwork.title} />
              <ArtOverlay>
                <ArtTitle>{artwork.title}</ArtTitle>
                <ArtDescription>{artwork.description}</ArtDescription>
              </ArtOverlay>
            </ArtItem>
          ))}
        </ArtGrid>

        {/* Cross-Navigation to Projects */}
        <CrossNavigation
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <CrossNavCard>
            <CrossNavTitle>Explore My Development Projects</CrossNavTitle>
            <CrossNavDescription>
              Check out my coding projects, web applications, and technical solutions.
            </CrossNavDescription>
            <CrossNavButton
              to="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
              <FiArrowRight size={18} />
            </CrossNavButton>
          </CrossNavCard>
        </CrossNavigation>
      </Container>

      {selectedArtwork && (
        <Modal onClick={closeModal}>
          <ModalImageSection onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <ModalImageContainer
                isZoomed={imageTransform.scale > 1}
                onClick={handleImageClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                <ModalImage
                  src={selectedArtwork.imageUrl}
                  alt={selectedArtwork.title}
                  scale={imageTransform.scale}
                  translateX={imageTransform.translateX}
                  translateY={imageTransform.translateY}
                />
              </ModalImageContainer>
            </div>

            <NavigationButtons>
              <NavButton
                onClick={() => navigateArtwork('prev')}
                disabled={artworksData.length <= 1}
              >
                ‹
              </NavButton>
              <NavButton
                onClick={() => navigateArtwork('next')}
                disabled={artworksData.length <= 1}
              >
                ›
              </NavButton>
            </NavigationButtons>

            <ZoomHint show={imageTransform.scale === 1}>
              Click to zoom • Scroll wheel to zoom • Drag to pan when zoomed
            </ZoomHint>

            <MobileToggleButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              ℹ️
            </MobileToggleButton>
          </ModalImageSection>

          <ModalSidebar sidebarOpen={sidebarOpen} onClick={(e) => e.stopPropagation()}>
            <SidebarHeader>
              <ArtworkTitle>{selectedArtwork.title}</ArtworkTitle>
              <ArtworkYear>{selectedArtwork.year}</ArtworkYear>
            </SidebarHeader>

            <SidebarContent>
              <Section>
                <SidebarSectionTitle>Description</SidebarSectionTitle>
                <Description>{selectedArtwork.longDescription}</Description>
              </Section>

              <Section>
                <SidebarSectionTitle>Details</SidebarSectionTitle>
                <MetadataGrid>
                  <MetadataItem>
                    <MetadataLabel>Medium</MetadataLabel>
                    <MetadataValue>{selectedArtwork.medium}</MetadataValue>
                  </MetadataItem>
                  <MetadataItem>
                    <MetadataLabel>Dimensions</MetadataLabel>
                    <MetadataValue>{selectedArtwork.dimensions}</MetadataValue>
                  </MetadataItem>
                  <MetadataItem>
                    <MetadataLabel>Software</MetadataLabel>
                    <MetadataValue>{selectedArtwork.software}</MetadataValue>
                  </MetadataItem>
                </MetadataGrid>
              </Section>

              <Section>
                <SidebarSectionTitle>Tags</SidebarSectionTitle>
                <TagsContainer>
                  {selectedArtwork.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagsContainer>
              </Section>

              {selectedArtwork.techniques && (
                <Section>
                  <SidebarSectionTitle>Techniques</SidebarSectionTitle>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {selectedArtwork.techniques.map((technique, index) => (
                      <li key={index} style={{
                        color: '#a0a0a0',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ color: '#00d4ff', fontWeight: 'bold', marginRight: '0.5rem' }}>•</span>
                        {technique}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {selectedArtwork.inspiration && (
                <Section>
                  <SidebarSectionTitle>Inspiration</SidebarSectionTitle>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '1rem'
                  }}>
                    <Description>{selectedArtwork.inspiration}</Description>
                  </div>
                </Section>
              )}

              <Section>
                <SidebarSectionTitle>Process</SidebarSectionTitle>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <Description>{selectedArtwork.process}</Description>
                </div>
              </Section>
            </SidebarContent>
          </ModalSidebar>

          <CloseButton onClick={closeModal}>&times;</CloseButton>
        </Modal>
      )}
    </ArtContainer>
  );
};

export default ArtSimple;