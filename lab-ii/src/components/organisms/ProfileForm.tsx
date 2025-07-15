import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

interface ProfileFormProps {
  onSaveSuccess?: () => void;
}

export const ProfileForm = ({ onSaveSuccess }: ProfileFormProps) => {
  const { currentUser, userProfile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    address: '',
    birthDate: '',
  });
  const [age, setAge] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        address: userProfile.address || '',
        birthDate: userProfile.birthDate?.split('T')[0] || '',
      });
      setAge(userProfile.age);
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'birthDate' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      
      if (today.getMonth() < birthDate.getMonth() || 
          (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      setAge(calculatedAge);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile({
        address: formData.address,
        birthDate: formData.birthDate,
        age: age,
      });
      setSuccess('Profile updated successfully!');
      onSaveSuccess?.();
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return <div>Please log in</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" key={currentUser.uid}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="email"
          value={currentUser.email || ''}
          readOnly
          className="w-full bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <Input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Birth Date
        </label>
        <Input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Age
        </label>
        <Input
          type="text"
          value={age?.toString() || ''}
          readOnly
          className="w-full bg-gray-100"
        />
      </div>

      {error && <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="p-2 bg-green-100 text-green-700 rounded">{success}</div>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
};
