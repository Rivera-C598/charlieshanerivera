// Font Configuration
// Change these to try different font combinations

export const fontConfig = {
  // Main body font
  primary: {
    name: 'Poppins',
    weights: '300;400;500;600;700',
    fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },

  // Code/monospace font
  mono: {
    name: 'JetBrains Mono',
    weights: '400;500;600',
    fallback: '"Fira Code", "Consolas", monospace'
  }
};

// Popular font combinations you can try:
export const fontPresets = {
  modern: {
    primary: { name: 'Inter', weights: '300;400;500;600;700' },
    mono: { name: 'JetBrains Mono', weights: '400;500;600' }
  },

  friendly: {
    primary: { name: 'Poppins', weights: '300;400;500;600;700' },
    mono: { name: 'Fira Code', weights: '400;500;600' }
  },

  elegant: {
    primary: { name: 'Playfair Display', weights: '400;500;600;700' },
    mono: { name: 'Source Code Pro', weights: '400;500;600' }
  },

  tech: {
    primary: { name: 'Space Grotesk', weights: '300;400;500;600;700' },
    mono: { name: 'JetBrains Mono', weights: '400;500;600' }
  },

  minimal: {
    primary: { name: 'Work Sans', weights: '300;400;500;600;700' },
    mono: { name: 'IBM Plex Mono', weights: '400;500;600' }
  }
};

// Generate Google Fonts URL
export const generateFontUrl = (preset = fontConfig) => {
  const primaryFont = `family=${preset.primary.name.replace(' ', '+')}:wght@${preset.primary.weights}`;
  const monoFont = `family=${preset.mono.name.replace(' ', '+')}:wght@${preset.mono.weights}`;

  return `https://fonts.googleapis.com/css2?${primaryFont}&${monoFont}&display=swap`;
};

// Generate CSS font-family string
export const generateFontFamily = (preset = fontConfig) => {
  return `'${preset.primary.name}', ${preset.primary.fallback}`;
};