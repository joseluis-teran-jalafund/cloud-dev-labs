import { useAuth } from '../contexts/AuthContext';
import { googleProvider, facebookProvider } from '../services/firebase/FirebaseConfig';
import { Button } from '../components/atoms/Button';
import { ProviderLinks } from '../components/organisms/ProviderLinks';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { useNavigate } from 'react-router';

export const ProfilePage = () => {
  const { currentUser, logout, linkProvider } = useAuth();
  const navigate = useNavigate();

  const isGoogleLinked = currentUser?.providerData.some(
    (provider) => provider.providerId === googleProvider.providerId
  );
  
  const isFacebookLinked = currentUser?.providerData.some(
    (provider) => provider.providerId === facebookProvider.providerId
  );

  const handleLinkGoogle = async () => {
    try {
      await linkProvider(googleProvider);
      alert('Google account linked successfully!');
    } catch (err) {
      alert('Failed to link Google account');
      console.error(err);
    }
  };

  const handleLinkFacebook = async () => {
    try {
      await linkProvider(facebookProvider);
      alert('Facebook account linked successfully!');
    } catch (err) {
      alert('Failed to link Facebook account');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  if (!currentUser) {
    return (
      <AuthTemplate title="Profile">
        <div className="text-center">Please log in to view your profile</div>
      </AuthTemplate>
    );
  }

  return (
    <AuthTemplate title="Your Profile">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Account Information</h3>
          <p>Email: {currentUser.email}</p>
          <p>
            Connected providers:{' '}
            {currentUser.providerData.map((provider) => (
              <span key={provider.providerId} className="capitalize">
                {' '}
                {provider.providerId.split('.')[0]}
              </span>
            ))}
          </p>
        </div>

        {(!isGoogleLinked || !isFacebookLinked) && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Link Additional Providers</h3>
            <ProviderLinks
              onGoogleClick={!isGoogleLinked ? handleLinkGoogle : undefined}
              onFacebookClick={!isFacebookLinked ? handleLinkFacebook : undefined}
              className="space-y-3"
            />
          </div>
        )}

        <Button
          onClick={handleLogout}
          variant="danger"
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </AuthTemplate>
  );
};
