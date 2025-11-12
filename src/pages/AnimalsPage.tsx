import { useQuery } from '@tanstack/react-query';
import { animalsApi } from '../api/animals';
import { Card } from '../components/ui/Card';

export default function AnimalsPage() {
  const { data: animals, isLoading, error } = useQuery({
    queryKey: ['animals'],
    queryFn: animalsApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Loading animals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load animals. Please try again later.</p>
      </div>
    );
  }

  if (!animals || animals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🐾</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No animals yet!</h2>
        <p className="text-gray-600">Animals will appear here once added.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-gray-800 mb-6">
        Urban Wildlife Directory 🐾
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {animals.map((animal) => (
          <Card key={animal.id} hover>
            {animal.image && (
              <img
                src={animal.image}
                alt={animal.name}
                className="w-full h-48 object-cover rounded-t-card mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {animal.name}
            </h3>
            {animal.genus && animal.species && (
              <p className="text-sm text-gray-600 italic mb-2">
                {animal.genus} {animal.species}
              </p>
            )}
            {animal.description && (
              <p className="text-sm text-gray-600 line-clamp-3">
                {animal.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {animal.cls && (
                <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  {animal.cls}
                </span>
              )}
              {animal.order && (
                <span className="inline-block bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">
                  {animal.order}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

