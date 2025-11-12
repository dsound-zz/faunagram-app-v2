import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { animalsApi } from '../api/animals';
import { sightingsApi } from '../api/sightings';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export default function PostSightingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [animalId, setAnimalId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  const { data: animals, isLoading: animalsLoading } = useQuery({
    queryKey: ['animals'],
    queryFn: animalsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => sightingsApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sightings'] });
      navigate('/home');
    },
    onError: (err: any) => {
      setError(err.response?.data?.errors || 'Failed to create sighting');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !body || !animalId) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user) {
      setError('You must be logged in to post a sighting');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('user_id', user.id.toString());
    formData.append('animal_id', animalId);
    
    if (image) {
      formData.append('image', image);
    }

    createMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">You must be logged in to post a sighting.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h1 className="text-3xl font-display font-bold text-center mb-6 text-primary">
          Post a Sighting 📷
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Spotted a Red Tailed Hawk!"
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="Tell us about your sighting..."
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Animal *
            </label>
            {animalsLoading ? (
              <p className="text-gray-500">Loading animals...</p>
            ) : (
              <select
                value={animalId}
                onChange={(e) => setAnimalId(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              >
                <option value="">Select an animal...</option>
                {animals?.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-button text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/home')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending}
              className="flex-1"
            >
              Post Sighting
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

