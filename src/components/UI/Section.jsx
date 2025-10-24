import styled from '@emotion/styled';

export const Section = styled.div`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Description = styled.p`
  color: ${props => props.theme.colors.lightText};
  line-height: 1.6;
  font-size: 0.95rem;
`;

export const MetadataGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

export const MetadataItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

export const MetadataLabel = styled.span`
  color: ${props => props.theme.colors.muted};
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 80px;
`;

export const MetadataValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  text-align: right;
  flex: 1;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Tag = styled.span`
  background: ${props => props.variant === 'primary' ? 
    'rgba(0, 212, 255, 0.1)' : 
    'rgba(124, 58, 237, 0.1)'};
  color: ${props => props.variant === 'primary' ? 
    props.theme.colors.primary : 
    props.theme.colors.accent};
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;