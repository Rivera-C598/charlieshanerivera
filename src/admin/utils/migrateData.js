import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { projectsData } from '../../data/projects';

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
