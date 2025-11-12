import { Link } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b-2 border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/home' : '/login'} className="flex flex-col items-center">
            <h1 className="text-3xl font-display font-black text-primary">
              Faunagram
            </h1>
            <p className="text-xs text-gray-500 italic">all things urban wildlife</p>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/users"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Users"
                >
                  <span className="text-2xl">👥</span>
                </Link>
                <Link
                  to="/animals"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Animals"
                >
                  <span className="text-2xl">🐾</span>
                </Link>
                <Link
                  to="/post-sighting"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Post Sighting"
                >
                  <span className="text-2xl">📷</span>
                </Link>
                <Link
                  to={`/users/${user.id}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Avatar src={user.avatar_url} alt={user.username} size="sm" />
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button variant="outline" size="sm">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    Log In
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

