import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { usersApi } from '../api/users';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';

export default function UsersPage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load users. Please try again later.</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No users yet!</h2>
        <p className="text-gray-600">Be the first to join Faunagram.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-gray-800 mb-6">
        Community Members 👥
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <Link key={user.id} to={`/users/${user.id}`}>
            <Card hover className="text-center">
              <div className="flex flex-col items-center">
                <Avatar
                  src={user.avatar_url}
                  alt={user.username}
                  size="lg"
                  className="mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h3>
                <p className="text-gray-600 mb-2">@{user.username}</p>
                <p className="text-sm text-gray-500">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

