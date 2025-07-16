import React from 'react';
import Button from '../atoms/Button';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

type SocialButtonsProps = {
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  loading?: boolean;
};

const SocialButtons: React.FC<SocialButtonsProps> = ({ 
  onGoogleClick, 
  onFacebookClick,
  loading = false
}) => {
  return (
    <div className="space-y-3">
      <Button 
        onClick={onGoogleClick} 
        variant="secondary" 
        className="w-full flex items-center justify-center gap-2"
        disabled={loading}
      >
        <FaGoogle /> Sign in with Google
      </Button>
      <Button 
        onClick={onFacebookClick} 
        variant="secondary" 
        className="w-full flex items-center justify-center gap-2"
        disabled={loading}
      >
        <FaFacebook /> Sign in with Facebook
      </Button>
    </div>
  );
};

export default SocialButtons;
