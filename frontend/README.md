# Frontend Documentation

NFL Journey Frontend - React + TypeScript application with Vite.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Generating Documentation](#generating-documentation)
- [Available Scripts](#available-scripts)

## 🔧 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- Backend server running (see [Backend README](../backend/README.md))

## 📦 Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

### Development Mode:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Production Build:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Admin dashboard components
│   │   ├── shopping/        # Shopping cart components
│   │   ├── auth/            # Authentication components
│   │   └── ...              # Other components
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── TeamsPage.tsx
│   │   ├── StadiumsPage.tsx
│   │   ├── AlgorithmsPage.tsx
│   │   ├── ShoppingPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ...
│   ├── store/               # Redux store
│   │   ├── apis/            # RTK Query APIs
│   │   ├── slices/          # Redux slices
│   │   └── types/           # TypeScript types
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   ├── constants/            # Constants
│   ├── assets/              # Images, fonts, etc.
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── tsconfig.json            # TypeScript config
```

## ✨ Key Features

### Pages
- **Home Page**: Hero section with search
- **Teams Page**: Browse and filter NFL teams
- **Stadiums Page**: View stadium information
- **Algorithms Page**: Visualize graph algorithms (DFS, BFS, Dijkstra, A*, Kruskal)
- **Trip Planning**: Custom and optimal trip planning
- **Shopping Page**: Browse and purchase souvenirs
- **Admin Dashboard**: Manage teams, stadiums, and souvenirs

### Components
- **TeamCard**: Display team information
- **StadiumCard**: Display stadium details
- **SouvenirCard**: Display souvenirs with add to cart
- **Map**: Interactive map visualization
- **FilterSection**: Advanced filtering and sorting
- **ShoppingCart**: Shopping cart functionality

### State Management
- **Redux Toolkit**: Global state management
- **RTK Query**: API data fetching and caching
- **Local State**: React hooks for component state

## 📚 Generating Documentation

### Generate TypeDoc documentation:
```bash
npm run docs
```

This creates HTML documentation in the `docs/` folder.

### Watch mode (auto-regenerate on file changes):
```bash
npm run docs:watch
```

### View documentation:
Open `docs/index.html` in your browser.

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server
```

### Building
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Documentation
```bash
npm run docs         # Generate TypeDoc documentation
npm run docs:watch   # Watch mode for docs
```

## 🎨 Tech Stack

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Redux Toolkit**: State management
- **RTK Query**: Data fetching
- **React Router**: Routing
- **Framer Motion**: Animations
- **dnd-kit**: Drag and drop

## 🔌 API Integration

The frontend communicates with the backend API through RTK Query:

- **teamsApi**: Team-related endpoints
- **stadiumsApi**: Stadium-related endpoints
- **algorithmApi**: Graph algorithm endpoints
- **souvenirsApi**: Souvenir management
- **purchaseApi**: Shopping cart and purchases
- **adminApi**: Admin authentication

## 📱 Features

### User Features
- Browse teams and stadiums
- Filter and search functionality
- Visualize graph algorithms
- Plan custom trips
- Shop for souvenirs
- Track purchases

### Admin Features
- Login/authentication
- Manage teams (CRUD)
- Manage stadiums (CRUD)
- Manage souvenirs (CRUD)
- View purchase history

## 🎯 Key Components

### Custom Hooks
- `useFilter`: Filtering logic
- `useTeamEdit`: Team editing
- `useStadiumEdit`: Stadium editing
- `useSouvenirEdit`: Souvenir editing
- `useAlgorithmData`: Algorithm data fetching
- `useMapAnimation`: Map animations

### Utilities
- `dropdownTransformers`: Transform data for dropdowns
- `filterConfigs`: Filter configurations
- `formFields`: Form field definitions

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors
```bash
# Check TypeScript compilation
npm run build
```

### Port Already in Use
Change the port in `vite.config.ts` or use:
```bash
npm run dev -- --port 3000
```

## 📝 Notes

- The app uses TypeScript for type safety
- Tailwind CSS for styling
- RTK Query handles all API calls
- Components are organized by feature
- Documentation is generated using TypeDoc

## 🔗 Related

- [Backend Documentation](../backend/README.md)
- [Main README](../README.md)
