import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from '@emotion/styled';

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.gradients.dark};
`;

const LoadingText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
`;

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!user || !isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
