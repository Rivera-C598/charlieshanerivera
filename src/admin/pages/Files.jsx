import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiTrash2, FiDownload, FiFile, FiExternalLink } from 'react-icons/fi';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import AdminLayout from '../components/AdminLayout';
import { ToastProvider } from '../components/Toast';
import { useToast } from '../hooks/useToast';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const UploadButton = styled.label`
  background: ${props => props.theme.gradients.primary};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glow};
  }

  input {
    display: none;
  }
`;

const FilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FileCard = styled(motion.div)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FileIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: rgba(0, 212, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const FileName = styled.h3`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  word-break: break-word;
`;

const FileInfo = styled.div`
  color: ${props => props.theme.colors.lightText};
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FileActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const ActionButton = styled.button`
  flex: 1;
  background: ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 212, 255, 0.1)'};
  color: ${props => props.variant === 'danger' ? props.theme.colors.secondary : props.theme.colors.primary};
  border: 1px solid ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 212, 255, 0.3)'};
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.variant === 'danger' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(0, 212, 255, 0.2)'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.lightText};
`;

const UploadProgress = styled.div`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.theme.gradients.primary};
  border-radius: 4px;
`;

const ProgressText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ResumeBadge = styled.div`
  display: inline-block;
  background: ${props => props.theme.gradients.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const InfoBox = styled.div`
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.6;
`;

const AdminFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState('');
  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'files'));
      const filesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFiles(filesData);
    } catch (err) {
      error('Error', 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      error('File Too Large', 'Maximum file size is 10MB');
      return;
    }

    setUploading(true);
    setUploadingFileName(file.name);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload to Firebase Storage
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `downloads/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Save metadata to Firestore
      await addDoc(collection(db, 'files'), {
        name: file.name,
        storagePath: `downloads/${fileName}`,
        downloadURL,
        size: file.size,
        type: file.type,
        isResume: false,
        uploadedAt: new Date().toISOString()
      });

      success('Uploaded', `${file.name} uploaded successfully`);
      fetchFiles();
    } catch (err) {
      error('Upload Failed', err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadingFileName('');
      e.target.value = '';
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Delete "${file.name}"?`)) return;

    try {
      // Delete from Storage
      const storageRef = ref(storage, file.storagePath);
      await deleteObject(storageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'files', file.id));

      success('Deleted', 'File deleted successfully');
      fetchFiles();
    } catch (err) {
      error('Delete Failed', err.message);
    }
  };

  const handleDownload = (file) => {
    window.open(file.downloadURL, '_blank');
  };

  const handleSetAsResume = async (file) => {
    try {
      // First, unset all other files as resume
      const allFiles = await getDocs(collection(db, 'files'));
      const updatePromises = allFiles.docs.map(docSnap => {
        const docRef = doc(db, 'files', docSnap.id);
        return updateDoc(docRef, { isResume: docSnap.id === file.id });
      });
      
      await Promise.all(updatePromises);
      
      success('Resume Set', `${file.name} is now the resume file`);
      fetchFiles();
    } catch (err) {
      error('Failed', err.message);
    }
  };

  return (
    <AdminLayout title="Files & Downloads">
      <ToastProvider toasts={toasts} onClose={removeToast} />
      
      <InfoBox>
        <strong>📁 File Management</strong><br />
        Upload resumes, portfolios, certificates, or any downloadable files. Maximum file size: 10MB.<br />
        Supported formats: PDF, DOC, DOCX, ZIP, images, etc.
      </InfoBox>

      <Header>
        <h2 style={{ color: 'var(--color-text)', margin: 0 }}>
          {files.length} {files.length === 1 ? 'File' : 'Files'}
        </h2>
        <UploadButton>
          <FiUpload size={20} />
          Upload File
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </UploadButton>
      </Header>

      {uploading && (
        <UploadProgress>
          <ProgressText>Uploading {uploadingFileName}...</ProgressText>
          <ProgressBar>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </ProgressBar>
        </UploadProgress>
      )}

      {loading ? (
        <EmptyState>Loading files...</EmptyState>
      ) : files.length === 0 ? (
        <EmptyState>
          No files uploaded yet. Click "Upload File" to add your first file.
        </EmptyState>
      ) : (
        <FilesGrid>
          {files.map((file, index) => (
            <FileCard
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FileIcon>
                <FiFile size={28} />
              </FileIcon>
              
              {file.isResume && <ResumeBadge>📄 Resume</ResumeBadge>}
              
              <FileName>{file.name}</FileName>
              
              <FileInfo>
                <div>Size: {formatFileSize(file.size)}</div>
                <div>Type: {file.type || 'Unknown'}</div>
                <div>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</div>
              </FileInfo>

              <FileActions>
                {!file.isResume && (
                  <ActionButton onClick={() => handleSetAsResume(file)}>
                    <FiFile size={16} />
                    Set as Resume
                  </ActionButton>
                )}
                <ActionButton onClick={() => handleDownload(file)}>
                  <FiDownload size={16} />
                  {file.isResume ? 'Download' : 'View'}
                </ActionButton>
                <ActionButton variant="danger" onClick={() => handleDelete(file)}>
                  <FiTrash2 size={16} />
                </ActionButton>
              </FileActions>
            </FileCard>
          ))}
        </FilesGrid>
      )}
    </AdminLayout>
  );
};

export default AdminFiles;
