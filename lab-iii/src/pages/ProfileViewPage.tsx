import { useAuth } from '../contexts/AuthContext';
import { googleProvider, facebookProvider } from '../services/firebase/FirebaseConfig';
import { Button } from '../components/atoms/Button';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { useNavigate } from 'react-router';
import { ProviderLinks } from '../components/organisms/ProviderLinks';

export const ProfileViewPage = () => {
  const { currentUser, userProfile, logout, linkProvider } = useAuth();
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
    <AuthTemplate title="Your Profile" wide>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Button
            onClick={() => navigate('/')}
            variant="secondary"
            className="flex-1 py-4 text-lg"
          >
            Back to Home
        </Button>

        <div className="bg-white shadow rounded-lg p-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-700 border-b pb-3">Account Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-md font-medium text-gray-500">Email</p>
                  <p className="text-lg text-gray-800 mt-1">{currentUser.email}</p>
                </div>
                
                {userProfile?.address && (
                  <div>
                    <p className="text-md font-medium text-gray-500">Address</p>
                    <p className="text-lg text-gray-800 mt-1">{userProfile.address}</p>
                  </div>
                )}
                
                {userProfile?.birthDate && (
                  <div>
                    <p className="text-md font-medium text-gray-500">Birth Date</p>
                    <p className="text-lg text-gray-800 mt-1">
                      {new Date(userProfile.birthDate).toLocaleDateString()}
                      {userProfile.age && ` (${userProfile.age} years old)`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-700 border-b pb-3">Connected Accounts</h3>
              <div className="space-y-4">
                <p className="text-md font-medium text-gray-500">Login Methods</p>
                <div className="mt-4 space-y-4">
                  {currentUser.providerData.map((provider) => (
                    <div key={provider.providerId} className="flex items-center space-x-4">
                      <span className="inline-block w-8 h-8">
                        {provider.providerId.includes('google') && (
                          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-full h-full" />
                        )}
                        {provider.providerId.includes('facebook') && (
                          <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-full h-full" />
                        )}
                        {provider.providerId.includes('password') && (
                          <span className="text-gray-500 text-2xl">✉️</span>
                        )}
                      </span>
                      <span className="capitalize text-lg text-gray-800">
                        {provider.providerId.split('.')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {(!isGoogleLinked || !isFacebookLinked) && (
          <div className="bg-white shadow rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">Link Additional Providers</h3>
            <ProviderLinks
              onGoogleClick={!isGoogleLinked ? handleLinkGoogle : undefined}
              onFacebookClick={!isFacebookLinked ? handleLinkFacebook : undefined}
              className="space-y-4"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6">
          <Button
            onClick={() => navigate('/edit-profile')}
            variant="primary"
            className="flex-1 py-4 text-lg"
          >
            Edit Profile
          </Button>
          <Button
            onClick={handleLogout}
            variant="danger"
            className="flex-1 py-4 text-lg"
          >
            Logout
          </Button>
        </div>
      </div>
    </AuthTemplate>
  );
};
