import React from 'react';
import { Button } from '../atoms/Button';

type ProviderButtonProps = {
  provider: 'google' | 'facebook';
  onClick: () => void;
};

export const ProviderButton: React.FC<ProviderButtonProps> = ({ provider, onClick }) => {
  const providerData = {
    google: {
      text: 'Continue with Google',
      color: 'bg-red-600 hover:bg-red-700',
      icon: 'G',
    },
    facebook: {
      text: 'Continue with Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: 'f',
    },
  };

  return (
    <Button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 ${providerData[provider].color}`}
    >
      <span className="font-bold">{providerData[provider].icon}</span>
      {providerData[provider].text}
    </Button>
  );
};
