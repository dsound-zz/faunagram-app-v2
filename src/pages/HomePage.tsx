import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sightingsApi } from '../api/sightings';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';

export default function HomePage() {
  const { data: sightings, isLoading, error } = useQuery({
    queryKey: ['sightings'],
    queryFn: sightingsApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Loading sightings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load sightings. Please try again later.</p>
      </div>
    );
  }

  if (!sightings || sightings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🦝</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No sightings yet!</h2>
        <p className="text-gray-600 mb-6">Be the first to share an urban wildlife sighting.</p>
        <Link to="/post-sighting">
          <Button variant="primary">
            Post Your First Sighting
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-800">
          Urban Wildlife Feed 🐾
        </h1>
        <Link to="/post-sighting">
          <Button variant="primary">
            + Post Sighting
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sightings.map((sighting) => (
          <Card key={sighting.id} hover>
            {sighting.image_path && (
              <img
                src={sighting.image_path}
                alt={sighting.title}
                className="w-full h-48 object-cover rounded-t-card mb-4"
              />
            )}
            <div className="flex items-center gap-2 mb-2">
              <Avatar
                src={sighting.user?.avatar_url}
                alt={sighting.user?.username || 'User'}
                size="sm"
              />
              <span className="font-semibold text-gray-800">
                {sighting.user?.username || 'Unknown'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{sighting.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{sighting.body}</p>
            {sighting.animal && (
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {sighting.animal.name}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // TODO: Implement like functionality
                  console.log('Like', sighting.id);
                }}
              >
                ❤️ {sighting.likes}
              </Button>
              <span className="text-sm text-gray-500">
                {new Date(sighting.created_at).toLocaleDateString()}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

