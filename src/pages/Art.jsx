import React, { useState } from 'react';
import styled from '@emotion/styled';

const ArtContainer = styled.section`
  padding: 8rem 2rem 4rem;
  min-height: 100vh;
  color: ${props => props.theme.colors.text};
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4rem;
  font-weight: 700;
`;

const ArtGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(250px, auto);
  grid-auto-flow: dense;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ArtOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none; /* Allows click events to pass through */
`;

const ArtTitle = styled.h3`
  font-size: 1.5rem;
  text-align: center;
  padding: 1rem;
`;

const ArtItem = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  ${(props) => {
    switch (props.layout) {
      case 'large':
        return `
          grid-column: span 2;
          grid-row: span 2;
        `;
      case 'horizontal':
        return `grid-column: span 2;`;
      case 'vertical':
        return `grid-row: span 2;`;
      default:
        return ``;
    }
  }}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);

    ${ArtOverlay} {
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    grid-column: span 1;
    grid-row: span 1;
  }
`;

const ArtImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  overflow-y: auto;
  padding: 4rem 0;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  max-width: 900px;
  margin: 0 auto;
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 30px;
  background: transparent;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  z-index: 1001;
`;

const Art = () => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <ArtContainer>
      <SectionTitle>Art Gallery</SectionTitle>
      <ArtGrid>
        {artworksData.map((artwork) => (
          <ArtItem key={artwork.id} layout={artwork.layout} onClick={() => openModal(artwork)}>
            <ArtImage src={artwork.thumbnail} alt={artwork.title} />
            <ArtOverlay>
              <ArtTitle>{artwork.title}</ArtTitle>
            </ArtOverlay>
          </ArtItem>
        ))}
      </ArtGrid>
      {selectedArtwork && (
        <Modal onClick={closeModal}>
          <CloseButton onClick={closeModal}>&times;</CloseButton>
          <ModalContent>
            {selectedArtwork.images.map((imageUrl, index) => (
              <ModalImage key={index} src={imageUrl} alt={`${selectedArtwork.title} - ${index + 1}`} />
            ))}
          </ModalContent>
        </Modal>
      )}
    </ArtContainer>
  );
};

export default Art;
