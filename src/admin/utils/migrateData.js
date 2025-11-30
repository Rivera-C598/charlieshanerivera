import { collection, addDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { projectsData } from '../../data/projects';
import { 
  FiCode, FiZap, FiLayers, FiServer, FiDatabase, FiCloud, 
  FiImage, FiMonitor, FiTool, FiSmartphone 
} from 'react-icons/fi';

// Hardcoded artwork data to migrate
const artworksData = [
  {
    title: "Ashes Beneath the Orbit's Roar",
    description: "When the sky cracks and the roar returns, the ashes shall rise once more. From the orbit's edge, he descends not as flame, but as memory of fire.",
    imageUrl: "/assets/art/ashes-beneath-orbits-roar-bg.png",
    tags: ["Character Design", "Digital Art", "Concept Art", "Featured"],
    featured: true
  },
  {
    title: "Celes - Remastered",
    description: "Redraw for an old Original Character.",
    imageUrl: "/assets/art/celes-remastered-bg.png",
    tags: ["Original Character", "Character Design", "Digital Art", "Featured"],
    featured: true
  },
  {
    title: "Peace Among Worlds",
    description: "A personal artwork of mine, I didnt really have much of a plan for the whole process, I just thought about an angel flying with a weapon or something but I decided to take it in a more unorthodox direction",
    imageUrl: "/assets/art/peace-among-worlds.jpg",
    tags: ["Conceptual", "Religious", "Provocative", "Digital Art"],
    featured: false
  },
  {
    title: "Breaking Out of Character",
    description: "A meta exploration of character design and artistic boundaries.",
    imageUrl: "/assets/art/breaking-out-of-character.png",
    tags: ["Meta Art", "Character Design", "Conceptual", "Digital Art"],
    featured: false
  },
  {
    title: "Celestial Outlaw",
    description: "A handful of interesting characters forged into one",
    imageUrl: "/assets/art/celestial-outlaw.png",
    tags: ["Character Design", "Fantasy", "Celestial", "Outlaw"],
    featured: false
  },
  {
    title: "Damsel",
    description: "some photo study I did years ago",
    imageUrl: "/assets/art/damsel.png",
    tags: ["Character Design", "Fantasy", "Digital Art"],
    featured: false
  },
  {
    title: "Environment Studies",
    description: "finally touched some grass here. decided to draw some grass too",
    imageUrl: "/assets/art/environment-studies.png",
    tags: ["Environment Art", "Atmospheric", "Studies", "Digital Painting"],
    featured: false
  },
  {
    title: "Frigid Demise",
    description: "The trouble is, you think you have time",
    imageUrl: "/assets/art/frigid-demise.jpg",
    tags: ["Dark Art", "Winter", "Mortality", "Atmospheric"],
    featured: false
  },
  {
    title: "Lone Custodian",
    description: "A solitary guardian in an empty world",
    imageUrl: "/assets/art/lone-custodian.jpg",
    tags: ["Character Design", "Post-Apocalyptic", "Solitude", "Guardian"],
    featured: false
  },
  {
    title: "Memories",
    description: "Memories of my cat chonky - his names chonky, he was very round when he was little so I named him that, he mostly sleeps all the time but quick on his feet when its time for food",
    imageUrl: "/assets/art/memories.png",
    tags: ["Abstract", "Memories", "Emotional", "Conceptual"],
    featured: false
  },
  {
    title: "Popol and Kupa",
    description: "Popol and Kupa from Mobile Legends Fanart",
    imageUrl: "/assets/art/popol-and-kupa.png",
    tags: ["Fan Art", "Character Design", "Digital Art", "Tribute"],
    featured: false
  },
  {
    title: "Stay",
    description: "As the fire crackles, sparks in the dark, two strangers snuggled, both cozy, tired, and warm.",
    imageUrl: "/assets/art/stay.png",
    tags: ["Emotional", "Character Art", "Relationship", "Digital Art"],
    featured: false
  }
];

/**
 * Migrate projects from projects.js to Firestore
 */
export const migrateProjects = async () => {
  try {
    // Check if projects already exist
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    if (projectsSnapshot.size > 0) {
      return {
        success: false,
        error: 'Projects already exist in Firestore. Delete them first if you want to re-migrate.'
      };
    }

    let count = 0;
    const projectsCollection = collection(db, 'projects');

    // Migrate each project
    for (const project of projectsData) {
      const projectData = {
        title: project.title,
        description: project.longDescription || project.description,
        category: project.category,
        technologies: project.technologies || [],
        features: project.features || [],
        imageUrl: project.imageUrl || project.image || '',
        liveUrl: project.liveLink || project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(projectsCollection, projectData);
      count++;
    }

    return {
      success: true,
      count
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Migrate artworks to Firestore
 */
export const migrateArtworks = async (force = false) => {
  try {
    const artworksCollection = collection(db, 'artworks');
    const artworksSnapshot = await getDocs(artworksCollection);
    
    // If force is true, delete existing artworks first
    if (force && artworksSnapshot.size > 0) {
      const deletePromises = artworksSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
    } else if (artworksSnapshot.size > 0) {
      return {
        success: false,
        error: 'Artworks already exist in Firestore. Delete them first if you want to re-migrate.'
      };
    }

    let count = 0;

    // Migrate each artwork
    for (const artwork of artworksData) {
      const artworkData = {
        title: artwork.title,
        description: artwork.description,
        imageUrl: artwork.imageUrl,
        tags: artwork.tags || [],
        featured: artwork.featured || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(artworksCollection, artworkData);
      count++;
    }

    return {
      success: true,
      count
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};


// Hardcoded skills data to migrate
const skillsData = {
  frontend: [
    {
      name: 'React & Next.js',
      level: 'Expert',
      progress: 95,
      icon: 'FiCode',
      description: 'Building modern, scalable web applications with React ecosystem and server-side rendering.',
      tags: ['React', 'Next.js', 'TypeScript', 'Redux', 'Context API']
    },
    {
      name: 'JavaScript & TypeScript',
      level: 'Expert',
      progress: 90,
      icon: 'FiZap',
      description: 'Advanced JavaScript programming with TypeScript for type-safe, maintainable code.',
      tags: ['ES6+', 'TypeScript', 'Async/Await', 'Modules', 'Testing']
    },
    {
      name: 'CSS & Styling',
      level: 'Advanced',
      progress: 85,
      icon: 'FiLayers',
      description: 'Modern CSS techniques, animations, and responsive design with various frameworks.',
      tags: ['CSS3', 'Sass', 'Styled Components', 'Tailwind', 'Framer Motion']
    }
  ],
  backend: [
    {
      name: 'Node.js & Express',
      level: 'Advanced',
      progress: 85,
      icon: 'FiServer',
      description: 'Building robust APIs and server-side applications with Node.js ecosystem.',
      tags: ['Express', 'Fastify', 'REST APIs', 'GraphQL', 'Middleware']
    },
    {
      name: 'Databases',
      level: 'Advanced',
      progress: 80,
      icon: 'FiDatabase',
      description: 'Working with both SQL and NoSQL databases for optimal data management.',
      tags: ['MongoDB', 'PostgreSQL', 'Redis', 'Prisma', 'Mongoose']
    },
    {
      name: 'Cloud & DevOps',
      level: 'Intermediate',
      progress: 75,
      icon: 'FiCloud',
      description: 'Deploying and managing applications on cloud platforms with modern DevOps practices.',
      tags: ['AWS', 'Docker', 'CI/CD', 'Vercel', 'GitHub Actions']
    }
  ],
  creative: [
    {
      name: 'Digital Art & Design',
      level: 'Advanced',
      progress: 90,
      icon: 'FiImage',
      description: 'Creating stunning digital artwork, illustrations, and visual designs.',
      tags: ['Photoshop', 'Procreate', 'Illustrator', 'Digital Painting', 'Concept Art']
    },
    {
      name: '3D Modeling & Animation',
      level: 'Intermediate',
      progress: 70,
      icon: 'FiMonitor',
      description: 'Building 3D models, scenes, and animations for various creative projects.',
      tags: ['Blender', 'Cinema 4D', '3D Modeling', 'Animation', 'Rendering']
    },
    {
      name: 'UI/UX Design',
      level: 'Advanced',
      progress: 85,
      icon: 'FiTool',
      description: 'Designing intuitive user interfaces and experiences with modern design principles.',
      tags: ['Figma', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems']
    }
  ],
  mobile: [
    {
      name: 'React Native',
      level: 'Intermediate',
      progress: 75,
      icon: 'FiSmartphone',
      description: 'Cross-platform mobile development with React Native and Expo.',
      tags: ['React Native', 'Expo', 'Navigation', 'Native Modules', 'App Store']
    },
    {
      name: 'Mobile UI/UX',
      level: 'Advanced',
      progress: 80,
      icon: 'FiLayers',
      description: 'Designing mobile-first interfaces with platform-specific guidelines.',
      tags: ['iOS Design', 'Material Design', 'Mobile Patterns', 'Responsive', 'Accessibility']
    }
  ]
};

/**
 * Migrate skills to Firestore
 */
export const migrateSkills = async (force = false) => {
  try {
    const skillsCollection = collection(db, 'skills');
    const skillsSnapshot = await getDocs(skillsCollection);
    
    // If force is true, delete existing skills first
    if (force && skillsSnapshot.size > 0) {
      const deletePromises = skillsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
    } else if (skillsSnapshot.size > 0) {
      return {
        success: false,
        error: 'Skills already exist in Firestore. Use force=true to re-migrate.'
      };
    }

    let count = 0;

    // Migrate each skill from all categories
    for (const [category, skills] of Object.entries(skillsData)) {
      for (const skill of skills) {
        const skillData = {
          name: skill.name,
          category: category,
          level: skill.level,
          progress: skill.progress,
          icon: skill.icon,
          description: skill.description,
          tags: skill.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await addDoc(skillsCollection, skillData);
        count++;
      }
    }

    return {
      success: true,
      count
    };
  } catch (error) {
    console.error('Skills migration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};


/**
 * Add categories to existing artworks
 */
export const addCategoriesToArtworks = async () => {
  try {
    const artworksSnapshot = await getDocs(collection(db, 'artworks'));
    let updatedCount = 0;

    for (const docSnap of artworksSnapshot.docs) {
      const data = docSnap.data();
      
      // Skip if already has category
      if (data.category) continue;

      // Auto-categorize based on tags or set to General
      let category = 'General';
      const tags = data.tags || [];
      
      if (tags.some(tag => tag.toLowerCase().includes('character'))) {
        category = 'Character Design';
      } else if (tags.some(tag => tag.toLowerCase().includes('environment'))) {
        category = 'Environment Art';
      } else if (tags.some(tag => tag.toLowerCase().includes('logo') || tag.toLowerCase().includes('branding'))) {
        category = 'Logos & Branding';
      } else if (tags.some(tag => tag.toLowerCase().includes('concept'))) {
        category = 'Concept Art';
      } else if (tags.some(tag => tag.toLowerCase().includes('fan'))) {
        category = 'Fan Art';
      } else if (tags.some(tag => tag.toLowerCase().includes('stud'))) {
        category = 'Studies';
      }

      await updateDoc(docSnap.ref, { category });
      updatedCount++;
    }

    return {
      success: true,
      count: updatedCount
    };
  } catch (error) {
    console.error('Category migration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
