import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { usersApi } from '../api/users';
import { sightingsApi } from '../api/sightings';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const userId = id ? parseInt(id) : 0;
  const isOwnProfile = currentUser?.id === userId;

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getById(userId),
    enabled: !!userId,
  });

  const { data: sightings, isLoading: sightingsLoading } = useQuery({
    queryKey: ['sightings', 'user', userId],
    queryFn: async () => {
      const allSightings = await sightingsApi.getAll();
      return allSightings.filter(s => s.user_id === userId);
    },
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => usersApi.delete(userId),
    onSuccess: () => {
      if (isOwnProfile) {
        navigate('/login');
      } else {
        navigate('/users');
      }
    },
  });

  if (userLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar
            src={user.avatar_url}
            alt={user.username}
            size="xl"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              {user.name}
            </h1>
            <p className="text-xl text-gray-600 mb-4">@{user.username}</p>
            <p className="text-sm text-gray-500 mb-4">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
            {isOwnProfile && (
              <div className="flex gap-2 justify-center md:justify-start">
                <Link to={`/users/${userId}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                      deleteMutation.mutate();
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete Account
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* User's Sightings */}
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">
          {isOwnProfile ? 'My Sightings' : `${user.name}'s Sightings`}
        </h2>

        {sightingsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading sightings...</p>
          </div>
        ) : !sightings || sightings.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🦝</div>
              <p className="text-gray-600">
                {isOwnProfile 
                  ? "You haven't posted any sightings yet." 
                  : `${user.name} hasn't posted any sightings yet.`}
              </p>
              {isOwnProfile && (
                <Link to="/post-sighting" className="mt-4 inline-block">
                  <Button variant="primary">Post Your First Sighting</Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sightings.map((sighting) => (
              <Card key={sighting.id} hover>
                {sighting.image_url && (
                  <img
                    src={sighting.image_url}
                    alt={sighting.title}
                    className="w-full h-48 object-cover rounded-t-card mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {sighting.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {sighting.body}
                </p>
                {sighting.animal && (
                  <div className="mb-4">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {sighting.animal.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    ❤️ {sighting.likes}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(sighting.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

