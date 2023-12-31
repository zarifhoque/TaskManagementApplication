/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthGuard = ({ children }) => {
	const isAuthenticated = useSelector((state) => state.auth.currentUser);
	const location = useLocation();

	if (!isAuthenticated) {
		// Redirect to the signin page if not authenticated
		return <Navigate to='/signin' state={{ from: location }} />;
	}

	// Render the protected content if authenticated
	return children;
};

export default AuthGuard;
