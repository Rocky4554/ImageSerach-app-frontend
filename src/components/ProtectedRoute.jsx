import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authAPI } from '../api/client';

function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authAPI.getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !data?.data?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;