import React from 'react';
import { Link } from 'react-router';

type AuthTemplateProps = {
  children: React.ReactNode;
  title?: string;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
  wide?: boolean;
};

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  children,
  title = '',
  footerText = '',
  footerLink = '/',
  footerLinkText = '',
  wide = false,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className={`sm:mx-auto sm:w-full ${wide ? 'sm:max-w-4xl' : 'sm:max-w-md'}`}>
        {title && <h1 className="text-center text-3xl font-extrabold text-gray-900">{title}</h1>}
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full ${wide ? 'sm:max-w-4xl' : 'sm:max-w-md'}`}>
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-8">
          {children}
        </div>
      </div>

      {(footerText || footerLinkText) && (
        <div className="mt-8 text-center">
          <span className="text-gray-600">{footerText} </span>
          <Link to={footerLink} className="font-medium text-blue-600 hover:text-blue-500">
            {footerLinkText}
          </Link>
        </div>
      )}
    </div>
  );
};
