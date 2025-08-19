# Frontend Development Guide

## Overview

The frontend is built with React 18, TypeScript, Vite, and Tailwind CSS. It follows modern React patterns with hooks, context, and a component-based architecture.

## Tech Stack

- **Build Tool**: Vite 5
- **Framework**: React 18 with TypeScript 5
- **Styling**: Tailwind CSS v3 with dark mode
- **Routing**: React Router v6
- **State Management**: Zustand (lightweight alternative to Redux)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

## Project Structure

```
apps/web/src/
├── app/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Basic UI primitives (buttons, inputs, etc.)
│   │   ├── layout/        # Layout components (Header, Footer, etc.)
│   │   ├── cards/         # Card components for resources, subjects
│   │   └── forms/         # Form components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and API client
│   ├── routes/            # Page route components (legacy, being migrated)
│   ├── store/             # Zustand state management
│   ├── styles/            # Global styles and Tailwind config
│   └── types/             # TypeScript type definitions
├── components/            # Page-level components (Header, Footer)
├── features/              # Feature-specific components
├── layouts/               # Layout wrappers
├── lib/                   # Core utilities (API client, auth helpers)
├── pages/                 # Route page components
└── types/                 # Shared TypeScript definitions
```

## Key Concepts

### Component Architecture

#### 1. **Page Components** (`pages/`)
Route-level components that represent full pages:

```typescript
// pages/Home.tsx
import { useState, useEffect } from 'react';
import { getRoadmaps } from '../lib/roadmaps';

const Home = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  
  // Page logic here
  
  return (
    <div>
      {/* Page content */}
    </div>
  );
};
```

#### 2. **Feature Components** (`components/`)
Reusable components specific to business logic:

```typescript
// components/ResourceCard.tsx
interface ResourceCardProps {
  resource: Resource;
  onRate?: (rating: number) => void;
}

export const ResourceCard = ({ resource, onRate }: ResourceCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Resource display logic */}
    </div>
  );
};
```

#### 3. **UI Primitives** (`app/components/ui/`)
Basic, highly reusable UI components:

```typescript
// app/components/ui/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

### State Management with Zustand

#### Global Store Structure
```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
```

#### Usage in Components
```typescript
import { useAuthStore } from '../store/authStore';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  return (
    <header>
      {isAuthenticated ? (
        <div>
          Welcome, {user?.name}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
};
```

### API Integration

#### API Client Setup
```typescript
// lib/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Add any request modifications here
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        await api.post('/auth/refresh');
        return api(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

#### Feature-Specific API Functions
```typescript
// lib/roadmaps.ts
import { api } from './api';
import type { RoadmapDTO, RoadmapFilters } from '../types/api';

export const getRoadmaps = async (
  filters: RoadmapFilters = {}
): Promise<RoadmapResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/roadmaps?${params}`);
  return response.data;
};

export const createRoadmap = async (
  roadmapData: CreateRoadmapRequest
): Promise<RoadmapDTO> => {
  const response = await api.post('/roadmaps', roadmapData);
  return response.data;
};
```

### Form Handling

#### React Hook Form + Zod Validation
```typescript
// components/CreateResourceForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  url: z.string().url('Must be a valid URL'),
  type: z.enum(['syllabus', 'lecture', 'notes', 'book']),
  description: z.string().max(500).optional(),
  topics: z.array(z.string()),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

export const CreateResourceForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      topics: [],
    },
  });

  const onSubmit = async (data: ResourceFormData) => {
    try {
      await createResource(data);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <input
          {...register('title')}
          className="w-full border rounded px-3 py-2"
        />
        {errors.title && (
          <p className="text-red-600 text-sm">{errors.title.message}</p>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? 'Creating...' : 'Create Resource'}
      </button>
    </form>
  );
};
```

### Routing with React Router

#### Route Configuration
```typescript
// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/subject/:code" element={<Subject />} />
        <Route path="/roadmaps" element={<Roadmaps />} />
        <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
        <Route 
          path="/roadmaps/create" 
          element={
            <ProtectedRoute roles={['moderator', 'admin']}>
              <CreateRoadmap />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
```

#### Protected Routes
```typescript
// components/ProtectedRoute.tsx
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

### Styling with Tailwind CSS

#### Design System
```css
/* tailwind.config.js */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
```

#### Component Styling Patterns
```typescript
// Using class-variance-authority for component variants
import { cva } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-lg border shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        elevated: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export const Card = ({ variant, size, className, children, ...props }) => (
  <div className={cardVariants({ variant, size, className })} {...props}>
    {children}
  </div>
);
```

### Custom Hooks

#### Data Fetching Hook
```typescript
// hooks/useRoadmaps.ts
import { useState, useEffect } from 'react';
import { getRoadmaps } from '../lib/roadmaps';
import type { RoadmapFilters } from '../types/api';

export const useRoadmaps = (filters: RoadmapFilters = {}) => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const response = await getRoadmaps(filters);
        setRoadmaps(response.roadmaps);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch roadmaps');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, [JSON.stringify(filters)]); // Re-run when filters change

  return { roadmaps, loading, error, refetch: () => fetchRoadmaps() };
};
```

#### Local Storage Hook
```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};
```

### Testing

#### Component Testing
```typescript
// __tests__/ResourceCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ResourceCard } from '../components/ResourceCard';

const mockResource = {
  _id: '1',
  title: 'Test Resource',
  type: 'lecture',
  url: 'https://example.com',
  description: 'Test description',
  provider: 'Test Provider',
  topics: ['test'],
  tags: ['beginner'],
  qualityScore: 85,
};

describe('ResourceCard', () => {
  it('renders resource information correctly', () => {
    render(<ResourceCard resource={mockResource} />);
    
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
    expect(screen.getByText('Test Provider')).toBeInTheDocument();
    expect(screen.getByText('lecture')).toBeInTheDocument();
  });

  it('calls onRate when rating is clicked', () => {
    const mockOnRate = jest.fn();
    render(<ResourceCard resource={mockResource} onRate={mockOnRate} />);
    
    const ratingButton = screen.getByRole('button', { name: /rate/i });
    fireEvent.click(ratingButton);
    
    expect(mockOnRate).toHaveBeenCalledWith(5);
  });
});
```

#### API Testing with MSW
```typescript
// __tests__/setup.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  rest.get('/api/v1/roadmaps', (req, res, ctx) => {
    return res(
      ctx.json({
        roadmaps: [
          {
            _id: '1',
            title: 'Test Roadmap',
            type: 'midsem',
            difficulty: 'beginner',
          },
        ],
        pagination: { page: 1, total: 1 },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Best Practices

### Performance

1. **Code Splitting**: Use `React.lazy()` for route-based code splitting
2. **Memoization**: Use `React.memo()` and `useMemo()` for expensive computations
3. **Image Optimization**: Use proper loading strategies and formats
4. **Bundle Analysis**: Regularly check bundle size with `pnpm run build && pnpm run analyze`

### Accessibility

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Add labels for screen readers
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Color Contrast**: Maintain WCAG AA compliance

### TypeScript

1. **Strict Mode**: Keep TypeScript strict mode enabled
2. **Type Definitions**: Create comprehensive interfaces for all data structures
3. **Generic Components**: Use generics for reusable components
4. **Utility Types**: Leverage TypeScript utility types (Pick, Omit, Partial)

### Error Handling

1. **Error Boundaries**: Implement error boundaries for graceful failures
2. **User Feedback**: Provide clear error messages to users
3. **Logging**: Log errors for debugging in development
4. **Fallbacks**: Provide fallback UI for failed states

## Development Workflow

1. **Start Development**: `pnpm dev`
2. **Type Checking**: `pnpm typecheck`
3. **Linting**: `pnpm lint` (with `--fix` to auto-fix)
4. **Testing**: `pnpm test` (with `--watch` for development)
5. **Build**: `pnpm build`
6. **Preview Build**: `pnpm preview`

## Environment Variables

```bash
# .env.sample
VITE_API_URL=http://localhost:4000/api/v1
VITE_APP_NAME=Campus Syllabus Hub
VITE_APP_VERSION=1.0.0
```

**Note**: All environment variables must be prefixed with `VITE_` to be accessible in the browser.
