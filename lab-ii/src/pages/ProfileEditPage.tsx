import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/atoms/Button';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { useNavigate } from 'react-router';
import { ProfileForm } from '../components/organisms/ProfileForm';

export const ProfileEditPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  const handleSaveSuccess = () => {
    navigate('/profile');
  };

  if (!currentUser) {
    return (
      <AuthTemplate title="Profile">
        <div className="text-center">Please log in to view your profile</div>
      </AuthTemplate>
    );
  }

  return (
    <AuthTemplate title="Edit Profile">
      <div className="space-y-6">
        <ProfileForm onSaveSuccess={handleSaveSuccess} />
        
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/profile')}
            variant="secondary"
            className="flex-1"
          >
            Back to Profile
          </Button>
          <Button
            onClick={handleLogout}
            variant="danger"
            className="flex-1"
          >
            Logout
          </Button>
        </div>
      </div>
    </AuthTemplate>
  );
};
