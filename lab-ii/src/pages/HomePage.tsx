import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { googleProvider, facebookProvider } from '../services/firebase/FirebaseConfig';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { Button } from '../components/atoms/Button';
import { ProviderLinks } from '../components/organisms/ProviderLinks';

export const HomePage = () => {
  const { currentUser, signInWithProvider } = useAuth();

  const handleGoogleLogin = () => signInWithProvider(googleProvider);
  const handleFacebookLogin = () => signInWithProvider(facebookProvider);

  return (
    <AuthTemplate
      title="Welcome to Firebase Auth App"
      footerText={currentUser ? '' : "Don't have an account?"}
      footerLink="/signup"
      footerLinkText="Sign up with email"
    >
      {currentUser ? (
        <div className="text-center space-y-4">
          <p className="text-lg">You are logged in as {currentUser.email}</p>
          <Link to="/profile">
            <Button variant="secondary" className="w-full">
              Go to Profile
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Login with Email
            </Button>
          </Link>
          <ProviderLinks
            onGoogleClick={handleGoogleLogin}
            onFacebookClick={handleFacebookLogin}
            showOr={true}
            className="mb-6"
          />
        </>
      )}
    </AuthTemplate>
  );
};
