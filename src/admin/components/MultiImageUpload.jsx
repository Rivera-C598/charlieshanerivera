import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../config/firebase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UploadArea = styled.label`
  border: 2px dashed rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(0, 212, 255, 0.05);

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(0, 212, 255, 0.1);
  }

  input {
    display: none;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const UploadHint = styled.div`
  color: ${props => props.theme.colors.lightText};
  font-size: 0.85rem;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ImageCard = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 107, 107, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 107, 107, 1);
    transform: scale(1.1);
  }
`;

const ThumbnailBadge = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: ${props => props.theme.gradients.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const CaptionInput = styled.input`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  padding: 0.5rem;
  font-size: 0.8rem;
  
  &:focus {
    outline: none;
    background: rgba(0, 0, 0, 0.9);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.theme.gradients.primary};
`;

const MultiImageUpload = ({ images = [], onChange, maxImages = 10, folder = 'images' }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImages = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update progress
        setUploadProgress(((i + 1) / totalFiles) * 100);

        // Upload to Firebase Storage
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `${folder}/${fileName}`);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        uploadedImages.push({
          url,
          storagePath: `${folder}/${fileName}`,
          caption: ''
        });
      }

      // Add new images to existing ones
      onChange([...images, ...uploadedImages]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleRemove = async (index) => {
    const image = images[index];
    
    try {
      // Delete from Storage if it has a storagePath
      if (image.storagePath) {
        const storageRef = ref(storage, image.storagePath);
        await deleteObject(storageRef);
      }

      // Remove from array
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image: ' + error.message);
    }
  };

  const handleCaptionChange = (index, caption) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], caption };
    onChange(newImages);
  };

  const handleSetThumbnail = (index) => {
    // Move selected image to first position
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    onChange(newImages);
  };

  return (
    <Container>
      {images.length < maxImages && (
        <UploadArea>
          <UploadIcon>
            <FiUpload />
          </UploadIcon>
          <UploadText>
            {uploading ? 'Uploading...' : 'Click to upload images'}
          </UploadText>
          <UploadHint>
            {images.length}/{maxImages} images • PNG, JPG up to 5MB each
          </UploadHint>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </UploadArea>
      )}

      {uploading && (
        <ProgressBar>
          <ProgressFill
            initial={{ width: 0 }}
            animate={{ width: `${uploadProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </ProgressBar>
      )}

      {images.length > 0 && (
        <ImagesGrid>
          <AnimatePresence>
            {images.map((image, index) => (
              <ImageCard
                key={image.url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => index !== 0 && handleSetThumbnail(index)}
                style={{ cursor: index !== 0 ? 'pointer' : 'default' }}
              >
                <Image src={image.url} alt={image.caption || `Image ${index + 1}`} />
                
                {index === 0 && (
                  <ThumbnailBadge>
                    <FiImage size={12} style={{ marginRight: '0.25rem' }} />
                    Thumbnail
                  </ThumbnailBadge>
                )}
                
                <RemoveButton onClick={(e) => { e.stopPropagation(); handleRemove(index); }}>
                  <FiX size={16} />
                </RemoveButton>

                <CaptionInput
                  type="text"
                  placeholder="Add caption..."
                  value={image.caption || ''}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </ImageCard>
            ))}
          </AnimatePresence>
        </ImagesGrid>
      )}

      {images.length > 1 && (
        <UploadHint style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          💡 First image is the thumbnail. Click other images to set as thumbnail.
        </UploadHint>
      )}
    </Container>
  );
};

export default MultiImageUpload;
