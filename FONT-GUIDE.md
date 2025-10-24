# Easy Font Changes 🎨

## Quick Font Switch (2 steps only!)

### Step 1: Update the font URL in `index.html`
Replace the Google Fonts link with your preferred fonts:

```html
<!-- Current: Poppins + JetBrains Mono -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<!-- Example alternatives: -->
<!-- Modern: Inter + Fira Code -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">

<!-- Elegant: Playfair Display + Source Code Pro -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet">

<!-- Tech: Space Grotesk + JetBrains Mono -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Step 2: Update the font family in `src/App.jsx`
Find this line in the GlobalStyles:
```javascript
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Replace 'Poppins' with your chosen font:
```javascript
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// or
font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

That's it! The font will change across your entire site automatically.

## Popular Font Combinations

### 🔥 Modern & Clean
- **Primary:** Inter
- **Code:** Fira Code
- **Vibe:** Professional, readable, tech-focused

### 🎨 Creative & Friendly  
- **Primary:** Poppins (current)
- **Code:** JetBrains Mono
- **Vibe:** Approachable, modern, creative

### ✨ Elegant & Sophisticated
- **Primary:** Playfair Display
- **Code:** Source Code Pro
- **Vibe:** Artistic, elegant, unique

### 🚀 Tech & Futuristic
- **Primary:** Space Grotesk
- **Code:** JetBrains Mono
- **Vibe:** Cutting-edge, geometric, tech-forward

### 📝 Minimal & Clean
- **Primary:** Work Sans
- **Code:** IBM Plex Mono
- **Vibe:** Simple, clean, professional

## Finding More Fonts
- Browse [Google Fonts](https://fonts.google.com)
- Look for fonts with multiple weights (300, 400, 500, 600, 700)
- Test readability at different sizes
- Consider your brand personality

## Pro Tips
- Stick to 2 fonts max (one for text, one for code)
- Always include fallback fonts
- Test on different devices
- Consider loading performance (fewer weights = faster loading)