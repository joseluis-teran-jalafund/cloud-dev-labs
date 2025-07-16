import React from 'react';
import { ProviderButton } from '../molecules/ProviderButton';

type ProviderLinksProps = {
  onGoogleClick?: () => void;
  onFacebookClick?: () => void;
  showOr?: boolean;
  className?: string;
};

export const ProviderLinks: React.FC<ProviderLinksProps> = ({
  onGoogleClick,
  onFacebookClick,
  showOr = false,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {showOr && (
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
      )}

      {onGoogleClick && (
        <ProviderButton provider="google" onClick={onGoogleClick} />
      )}
      {onFacebookClick && (
        <ProviderButton provider="facebook" onClick={onFacebookClick} />
      )}
    </div>
  );
};
