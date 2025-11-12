# Faunagram v2 - Urban Wildlife Social Media App

A modern React + TypeScript frontend for Faunagram, built with Vite, Tailwind CSS, and TanStack Query.

## 🚀 Tech Stack

- **React 19** with **TypeScript**
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Powerful data synchronization for React
- **React Router** - Declarative routing for React
- **Axios** - HTTP client

## 📁 Project Structure

```
src/
├── api/              # API client functions
├── components/       # React components
│   ├── layout/      # Layout components (Header, Container)
│   └── ui/          # Reusable UI components (Button, Input, Card, etc.)
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── pages/           # Page components
├── types/           # TypeScript type definitions
└── main.tsx         # Application entry point
```

## 🎨 Design Theme

Urban Animal Theme with vibrant colors:
- **Primary Green**: #00C853
- **Secondary Orange**: #FF6B35
- **Accent Blue**: #00B4DB
- **Accent Purple**: #9C27B0

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
VITE_API_BASE_URL=https://faunagram-api-express.vercel.app/api/v1
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📝 Environment Variables

- `VITE_API_BASE_URL` - Base URL for the API (defaults to production API)

## 🚢 Deployment

The app is configured for Vercel deployment. The `vercel.json` file includes:
- Build configuration
- SPA routing rewrites
- Framework detection

## 🔐 Authentication

The app uses JWT tokens stored in localStorage. The `useAuth` hook provides:
- `user` - Current user object
- `login()` - Login function
- `signup()` - Signup function
- `logout()` - Logout function

## 📱 Features

- ✅ User authentication (Login/Signup)
- ✅ Protected routes
- ✅ Home feed with sightings
- ✅ Responsive design
- ✅ Modern UI components
- ✅ API integration with TanStack Query

## 🎯 Next Steps

- [ ] Post sighting page
- [ ] User profiles
- [ ] Animals directory
- [ ] Comments functionality
- [ ] Like functionality
- [ ] Image upload
- [ ] Edit/Delete sightings

## 📄 License

ISC
