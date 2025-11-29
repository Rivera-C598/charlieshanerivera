import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../config/firebase';

const UploadContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.isDragging ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragging ? 'rgba(0, 212, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(0, 212, 255, 0.05);
  }
`;

const UploadIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: ${props => props.theme.colors.lightText};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const UploadHint = styled.p`
  color: ${props => props.theme.colors.muted};
  font-size: 0.8rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  position: relative;
  margin-top: 1rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  display: block;
`;

const RemoveButton = styled(motion.button)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 107, 107, 0.9);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 107, 107, 1);
  }
`;

const UploadProgress = styled.div`
  margin-top: 1rem;
  text-align: center;
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
`;

const ImageUpload = ({ label, value, onChange, folder = 'projects' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await uploadImage(file);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${filename}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const url = await getDownloadURL(storageRef);
      
      onChange(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        // Extract filename from URL and delete from storage
        // Note: This is optional - you might want to keep images
        onChange('');
      } catch (error) {
        console.error('Error removing image:', error);
      }
    }
  };

  return (
    <UploadContainer>
      {label && <Label>{label}</Label>}
      
      {!value ? (
        <>
          <UploadArea
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <UploadIcon>
              <FiUpload size={32} />
            </UploadIcon>
            <UploadText>
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </UploadText>
            <UploadHint>PNG, JPG, GIF up to 10MB</UploadHint>
          </UploadArea>
          <HiddenInput
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </>
      ) : (
        <PreviewContainer>
          <PreviewImage src={value} alt="Preview" />
          <RemoveButton
            onClick={handleRemove}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX size={20} />
          </RemoveButton>
        </PreviewContainer>
      )}
      
      {uploading && <UploadProgress>Uploading image...</UploadProgress>}
    </UploadContainer>
  );
};

export default ImageUpload;
