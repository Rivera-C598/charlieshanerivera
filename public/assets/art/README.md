# Art Images

Put your artwork images here:

## Featured Artwork (Dual Versions):
- `ashes-beneath-orbits-roar.png` - Transparent version for featured cards
- `ashes-beneath-orbits-roar-bg.jpg` - Background version for art gallery
- `celes-remastered.png` - Transparent version for featured cards  
- `celes-remastered-bg.jpg` - Background version for art gallery

## Supporting Images for Featured Art:
- `ashes-beneath-orbits-roar/` folder:
  - `process-1.jpg` - Work in progress shots
  - `process-2.jpg` - Different angles/views
  - `detail-1.jpg` - Close-up details
- `celes-remastered/` folder:
  - `process-1.jpg` - Creation process
  - `variations.jpg` - Different versions
  - `detail-1.jpg` - Character details

## Other Artwork:
- `peace-among-worlds.jpg` - Angel middle finger to heavens
- `closer.jpg`
- `walk.jpg`
- `memories.jpg`
- `environment-studies.jpg`
- `portrait-study-1.jpg`
- `portrait-study-2.jpg`
- `exiles-oath.jpg`
- `popol-and-kupa.jpg` - Fan Art
- `frost-flare.jpg`
- `stay.jpg`
- `frigid-demise.jpg`
- `damsel.jpg`
- `lone-custodian.jpg`
- `breaking-out-of-character.jpg`
- `sorrowful-discernment.jpg`
- `celestial-outlaw.jpg`

## Image Guidelines:
- **Featured art**: Use PNG with transparent backgrounds for 3D effect
- **Other art**: JPG or PNG format
- **Recommended size**: 1200x1200px or larger for quality
- **File naming**: Use hyphens instead of spaces
- **Supporting images**: Create subfolders for process shots and details

## Special Art Card Features

Art pieces with `isTransparent: true` in the FeaturedProjects component will display using the special art card with:
- ✨ Featured badge
- Animated glow effects with color transitions
- 3D hover transformations (translateY + rotateX)
- Special overlay styling with gradient backgrounds
- Enhanced visual presentation with drop shadows
- Custom tag styling with neon blue accents

## Adding New Featured Art

For featured artworks, you need TWO versions of each image:

### For FeaturedProjects Component:
1. Add transparent PNG version (e.g., `artwork-name.png`)
2. Update `featuredProjects.art` array in `src/components/FeaturedProjects.jsx`
3. Set `imageUrl` to the transparent version
4. Set `galleryImageUrl` to the background version
5. Set `isTransparent: true` and `featured: true`

### For Art Gallery:
1. Add background version (e.g., `artwork-name-bg.jpg`)
2. Update `artworksData` array in `src/pages/ArtSimple.jsx`
3. Set both `thumbnailUrl` and `imageUrl` to the background version
4. Include both versions in the `images` array for modal viewing

This dual-image approach ensures:
- ✨ Special transparent cards in Featured Projects
- 🖼️ Proper background display in the main Art Gallery
- 🔍 Both versions viewable in the modal gallery