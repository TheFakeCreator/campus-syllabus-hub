# Contributing Guide

Welcome to Campus Syllabus Hub! We're excited that you want to contribute to making education more accessible for students. This guide will help you get started with contributing to the project.

## 🎯 Ways to Contribute

### 📝 **Content Contributions**
- Add educational resources (lecture links, notes, books)
- Create learning roadmaps for subjects
- Improve existing resource descriptions and categorizations
- Translate content for different languages

### 💻 **Code Contributions**
- Fix bugs and issues
- Implement new features
- Improve performance and optimization
- Add tests and documentation
- Enhance UI/UX design

### 📚 **Documentation**
- Improve existing documentation
- Add tutorials and guides
- Create API examples
- Write troubleshooting guides

### 🐛 **Issue Reporting**
- Report bugs with detailed reproduction steps
- Suggest new features and improvements
- Provide feedback on existing features
- Help triage and investigate existing issues

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/campus-syllabus-hub.git
cd campus-syllabus-hub

# Add the original repository as upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/campus-syllabus-hub.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.sample apps/api/.env
cp apps/web/.env.sample apps/web/.env

# Edit .env files with your configuration
# Start MongoDB (local or use MongoDB Atlas)

# Seed the database
cd apps/api && pnpm seed

# Start development servers
pnpm -r dev
```

### 3. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

## 📋 Development Workflow

### Code Style and Standards

We use automated tools to maintain code quality:

- **ESLint**: For JavaScript/TypeScript linting
- **Prettier**: For code formatting
- **Husky**: For pre-commit hooks
- **Commitlint**: For conventional commit messages

### Before You Code

1. **Check existing issues** to avoid duplicate work
2. **Discuss major changes** by creating an issue first
3. **Read the codebase** to understand the architecture
4. **Run tests** to ensure everything works locally

### While Coding

1. **Write tests** for new features and bug fixes
2. **Follow TypeScript best practices**
3. **Add proper error handling**
4. **Update documentation** for API changes
5. **Keep commits small and focused**

### Code Quality Checklist

- [ ] Code follows project conventions
- [ ] All tests pass (`pnpm -r test`)
- [ ] TypeScript compiles without errors (`pnpm -r typecheck`)
- [ ] Linting passes (`pnpm -r lint`)
- [ ] No security vulnerabilities introduced
- [ ] Performance considerations addressed
- [ ] Accessibility guidelines followed

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm -r test

# Run tests in watch mode
pnpm -r test --watch

# Run tests with coverage
pnpm -r test --coverage

# Run specific test file
pnpm --filter api test -- auth.test.ts
```

### Writing Tests

#### Backend (API) Tests
```typescript
// apps/api/src/features/auth/auth.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student' as const
    };

    const result = await authService.register(userData);
    
    expect(result.user.email).toBe(userData.email);
    expect(result.user.passwordHash).toBeUndefined();
  });
});
```

#### Frontend Tests
```typescript
// apps/web/src/components/ResourceCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ResourceCard } from './ResourceCard';

describe('ResourceCard', () => {
  const mockResource = {
    _id: '1',
    title: 'Test Resource',
    type: 'lecture' as const,
    url: 'https://example.com',
    // ... other required properties
  };

  it('renders resource information', () => {
    render(<ResourceCard resource={mockResource} />);
    
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
    expect(screen.getByText('lecture')).toBeInTheDocument();
  });
});
```

## 🎨 UI/UX Guidelines

### Design System

We use Tailwind CSS with a consistent design system:

```typescript
// Design tokens
const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  }
};

const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};
```

### Component Guidelines

1. **Accessibility First**: Use semantic HTML and ARIA labels
2. **Mobile Responsive**: Design for mobile-first approach
3. **Dark Mode Support**: Ensure components work in both themes
4. **Loading States**: Provide feedback for async operations
5. **Error States**: Handle errors gracefully with helpful messages

### Design Principles

- **Clarity**: Clear, understandable interface
- **Consistency**: Consistent patterns across the app
- **Efficiency**: Help users complete tasks quickly
- **Accessibility**: Usable by everyone, including assistive technologies

## 📝 Commit Message Guidelines

We follow [Conventional Commits](https://conventionalcommits.org/) specification:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(roadmaps): add progress tracking functionality

fix(auth): resolve token refresh infinite loop

docs(api): update authentication endpoints documentation

style(components): improve button component styling

refactor(database): optimize resource queries

test(auth): add integration tests for login flow

chore(deps): update dependencies to latest versions
```

## 🔍 Pull Request Process

### Before Submitting

1. **Rebase your branch** with the latest main branch
2. **Run all tests** and ensure they pass
3. **Update documentation** if needed
4. **Add changeset** for significant changes
5. **Self-review** your code

### PR Title and Description

Use a clear, descriptive title following conventional commits format:

```markdown
feat(roadmaps): add progress tracking functionality

## Description
This PR adds progress tracking functionality to roadmaps, allowing users to mark steps as completed and track their overall progress.

## Changes
- Add progress tracking state management
- Implement step completion UI
- Add progress persistence to localStorage
- Update roadmap detail page with progress indicators

## Testing
- [ ] All existing tests pass
- [ ] Added unit tests for progress tracking
- [ ] Tested manually in browser
- [ ] Tested on mobile devices

## Screenshots
[Add screenshots if UI changes]

## Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Accessibility considered
```

### Review Process

1. **Automated Checks**: CI will run tests, linting, and type checking
2. **Code Review**: Team members will review your code
3. **Feedback**: Address feedback and update your PR
4. **Approval**: PR needs at least one approval to merge
5. **Merge**: Maintainers will merge approved PRs

## 🏗️ Architecture Guidelines

### Backend (API)

#### File Organization
```
apps/api/src/
├── features/              # Feature-based modules
│   ├── auth/             # Authentication feature
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.schemas.ts  # Zod validation schemas
│   │   └── auth.types.ts    # TypeScript types
│   └── resources/        # Resources feature
├── middleware/           # Express middlewares
├── utils/               # Utility functions
└── types/              # Shared TypeScript definitions
```

#### Principles
- **Feature-based organization**: Group related files together
- **Single responsibility**: Each file has a clear purpose
- **Type safety**: Use TypeScript everywhere
- **Validation**: Validate all inputs with Zod
- **Error handling**: Consistent error responses

### Frontend (Web)

#### Component Structure
```typescript
// Preferred component structure
interface ComponentProps {
  // Props definition
}

export const Component = ({ prop1, prop2 }: ComponentProps) => {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

#### State Management
- **Local state**: Use `useState` for component-specific state
- **Global state**: Use Zustand for app-wide state
- **Server state**: Use custom hooks with proper caching
- **Form state**: Use React Hook Form for complex forms

## 🚨 Security Guidelines

### Backend Security

1. **Input Validation**: Validate all inputs with Zod schemas
2. **Authentication**: Use JWT with proper expiration
3. **Authorization**: Check user roles for protected routes
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Sanitization**: Sanitize database queries and user inputs
6. **HTTPS**: Use HTTPS in production
7. **Environment Variables**: Never commit secrets to git

### Frontend Security

1. **XSS Prevention**: Sanitize user-generated content
2. **CSRF Protection**: Use proper CSRF tokens
3. **Content Security Policy**: Implement CSP headers
4. **Dependency Security**: Regularly update dependencies
5. **Secure Storage**: Use httpOnly cookies for tokens

## 📊 Performance Guidelines

### Backend Performance

1. **Database Optimization**: Use proper indexes and queries
2. **Caching**: Implement caching for frequently accessed data
3. **Pagination**: Always paginate large datasets
4. **Rate Limiting**: Prevent abuse and DoS attacks
5. **Monitoring**: Log performance metrics

### Frontend Performance

1. **Code Splitting**: Use lazy loading for routes
2. **Image Optimization**: Optimize images and use proper formats
3. **Bundle Size**: Monitor and optimize bundle size
4. **Caching**: Implement proper caching strategies
5. **Lazy Loading**: Load content as needed

## 🔧 Debugging and Troubleshooting

### Common Issues

#### Development Setup
```bash
# Clear all caches and reinstall
rm -rf node_modules apps/*/node_modules
rm pnpm-lock.yaml
pnpm install

# Reset database
cd apps/api && pnpm seed

# Check environment variables
cat apps/api/.env
cat apps/web/.env
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
mongosh --eval "db.runCommand('ping')"

# Check connection string
echo $MONGO_URI
```

#### TypeScript Errors
```bash
# Type check all packages
pnpm -r typecheck

# Clear TypeScript cache
rm -rf apps/*/tsconfig.tsbuildinfo
```

### Getting Help

1. **Check Documentation**: Read the docs and API reference
2. **Search Issues**: Look for existing GitHub issues
3. **Ask Questions**: Create a discussion or issue
4. **Community**: Join our community channels

## 🎉 Recognition

We appreciate all contributions! Contributors will be:

- **Listed** in our contributors section
- **Credited** in release notes for significant contributions
- **Invited** to join our contributors team
- **Recognized** in our community channels

## 📞 Contact

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community discussions
- **Email**: For security issues or private matters

Thank you for contributing to Campus Syllabus Hub! Together, we're making education more accessible for students everywhere. 🎓
