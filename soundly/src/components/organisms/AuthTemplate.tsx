import React from 'react';
import { Link } from 'react-router';

type AuthTemplateProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
};

const AuthTemplate: React.FC<AuthTemplateProps> = ({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        {footerText}{' '}
        <Link to={footerLink} className="font-medium text-green-600 hover:text-green-500">
          {footerLinkText}
        </Link>
      </div>
    </div>
  );
};

export default AuthTemplate;
