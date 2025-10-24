// CSS Variable Utilities
// Use these instead of hardcoded values

export const colors = {
  // Main colors
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  text: 'var(--color-text)',
  textLight: 'var(--color-text-light)',
  textMuted: 'var(--color-text-muted)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',

  // Alpha colors
  primary10: 'var(--color-primary-10)',
  primary20: 'var(--color-primary-20)',
  primary30: 'var(--color-primary-30)',
  accent10: 'var(--color-accent-10)',
  secondary05: 'var(--color-secondary-05)',
  success05: 'var(--color-success-05)',
  white05: 'var(--color-white-05)',
  white10: 'var(--color-white-10)',
  white20: 'var(--color-white-20)',
  black50: 'var(--color-black-50)',
  black70: 'var(--color-black-70)',
  black90: 'var(--color-black-90)',
  black95: 'var(--color-black-95)',
};

export const gradients = {
  primary: 'var(--gradient-primary)',
  secondary: 'var(--gradient-secondary)',
  dark: 'var(--gradient-dark)',
  card: 'var(--gradient-card)',
};

export const shadows = {
  small: 'var(--shadow-small)',
  medium: 'var(--shadow-medium)',
  large: 'var(--shadow-large)',
  glow: 'var(--shadow-glow)',
  glowHover: 'var(--shadow-glow-hover)',
};

export const spacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  '3xl': 'var(--spacing-3xl)',
  '4xl': 'var(--spacing-4xl)',
};

export const radius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  full: 'var(--radius-full)',
};

export const fonts = {
  xs: 'var(--font-xs)',
  sm: 'var(--font-sm)',
  base: 'var(--font-base)',
  lg: 'var(--font-lg)',
  xl: 'var(--font-xl)',
  '2xl': 'var(--font-2xl)',
  '3xl': 'var(--font-3xl)',
  '4xl': 'var(--font-4xl)',
};

export const zIndex = {
  dropdown: 'var(--z-dropdown)',
  modal: 'var(--z-modal)',
  tooltip: 'var(--z-tooltip)',
};

// Common styled component patterns
export const commonStyles = {
  // Card pattern
  card: `
    background: ${gradients.card};
    backdrop-filter: blur(20px);
    border: 1px solid ${colors.white10};
    border-radius: ${radius.xl};
  `,
  
  // Button primary pattern
  buttonPrimary: `
    background: ${gradients.primary};
    color: white;
    border: none;
    padding: ${spacing.sm} ${spacing.lg};
    border-radius: ${radius.full};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: ${shadows.glow};

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${shadows.glowHover};
    }
  `,

  // Button secondary pattern
  buttonSecondary: `
    background: transparent;
    color: ${colors.primary};
    border: 2px solid ${colors.primary};
    padding: ${spacing.sm} ${spacing.lg};
    border-radius: ${radius.full};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: ${colors.primary};
      color: ${colors.background};
      transform: translateY(-2px);
    }
  `,

  // Section title pattern
  sectionTitle: `
    text-align: center;
    font-size: clamp(2.5rem, 6vw, 4rem);
    background: ${gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: ${spacing.sm};
    font-weight: 700;
  `,
};

// Usage examples:
/*
import { colors, spacing, radius, commonStyles } from '../styles/utils';

const MyButton = styled.button`
  ${commonStyles.buttonPrimary}
`;

const MyCard = styled.div`
  ${commonStyles.card}
  padding: ${spacing.lg};
`;

const MyTitle = styled.h2`
  color: ${colors.primary};
  margin-bottom: ${spacing.md};
  border-radius: ${radius.lg};
`;
*/