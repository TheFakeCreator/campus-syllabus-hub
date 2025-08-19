# Security Guide

This document outlines the security measures implemented in Campus Syllabus Hub and provides guidelines for maintaining a secure application.

## 🔒 Security Overview

Campus Syllabus Hub implements security measures at multiple levels:

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Data Protection**: Input validation, sanitization, and secure storage
- **Communication Security**: HTTPS, secure cookies, CORS protection
- **Infrastructure Security**: Rate limiting, monitoring, and security headers
- **Code Security**: Dependency scanning, secure coding practices

## 🛡️ Authentication & Authorization

### JWT Token Strategy

The application uses a dual-token approach for secure authentication:

#### Access Tokens
- **Purpose**: Short-lived tokens for API access
- **Lifetime**: 15 minutes (configurable)
- **Storage**: httpOnly cookie (client-side inaccessible)
- **Payload**: User ID, email, role, expiration

#### Refresh Tokens
- **Purpose**: Long-lived tokens for access token renewal
- **Lifetime**: 7 days (configurable)
- **Storage**: httpOnly cookie with secure flag
- **Rotation**: New refresh token issued on each use

### Implementation

```typescript
// Token generation (apps/api/src/utils/tokens.ts)
export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL,
    issuer: 'campus-syllabus-hub',
    audience: 'api',
  });
};

export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_TTL,
    issuer: 'campus-syllabus-hub',
    audience: 'refresh',
  });
};
```

### Cookie Security

```typescript
// Secure cookie configuration
const cookieOptions = {
  httpOnly: true,           // Prevent XSS attacks
  secure: env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax' as const, // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
  path: '/',
};
```

### Role-Based Access Control (RBAC)

The application implements three user roles with hierarchical permissions:

#### Student (Default)
- View approved resources and roadmaps
- Rate and comment on resources
- Track personal progress
- Access public content

#### Moderator
- All student permissions
- Add new resources and roadmaps
- Edit own content
- Moderate user comments

#### Admin
- All moderator permissions
- Approve/reject content
- Manage user accounts
- Access analytics and reports
- Delete any content

### Protected Route Implementation

```typescript
// Middleware for authentication
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based authorization
export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

## 🔐 Data Protection

### Password Security

```typescript
// Password hashing with bcrypt
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // Configurable, minimum 10

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.passwordHash = await bcrypt.hash(this.password, salt);
    this.password = undefined; // Remove plain password
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password: string) {
  return bcrypt.compare(password, this.passwordHash);
};
```

### Input Validation & Sanitization

#### Zod Schema Validation
```typescript
// Comprehensive validation schemas
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .transform(email => email.trim()),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
           'Password must contain at least one lowercase, uppercase, and number'),
  
  role: z.enum(['student', 'moderator', 'admin']).default('student')
});
```

#### MongoDB Injection Prevention
```typescript
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// Apply sanitization middleware
app.use(mongoSanitize()); // Remove $ and . from user input
app.use(xss()); // Clean user input from malicious HTML
```

### Database Security

#### Connection Security
```typescript
// Secure MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      // Security options
      authSource: 'admin',
      ssl: env.NODE_ENV === 'production',
      sslValidate: true,
      
      // Connection options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

#### Data Exposure Prevention
```typescript
// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  delete userObject.__v;
  return userObject;
};

// Projection in queries
const user = await User.findById(id).select('-passwordHash -__v');
```

## 🌐 Network Security

### HTTPS Configuration

```typescript
// Force HTTPS in production
app.use((req, res, next) => {
  if (env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.get('host')}${req.url}`);
  }
  next();
});
```

### Security Headers with Helmet

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", env.CORS_ORIGIN],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));
```

### CORS Configuration

```typescript
import cors from 'cors';

app.use(cors({
  origin: env.CORS_ORIGIN.split(','), // Whitelist specific origins
  credentials: true,                   // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight for 24 hours
}));
```

## 🚦 Rate Limiting

### Implementation
```typescript
import rateLimit from 'express-rate-limit';

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/v1/auth/', authLimiter);
```

### Advanced Rate Limiting
```typescript
// User-specific rate limiting
const createUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    return req.user?.id || req.ip; // Use user ID if authenticated
  },
});
```

## 🔍 Security Monitoring & Logging

### Structured Logging with Pino

```typescript
import pino from 'pino';

const logger = pino({
  level: env.LOG_LEVEL || 'info',
  ...(env.NODE_ENV === 'production' && {
    // Production logging format
    formatters: {
      level: (label) => ({ level: label }),
      time: () => ({ time: new Date().toISOString() }),
    },
  }),
});

// Security event logging
export const logSecurityEvent = (event: string, details: any, req?: Request) => {
  logger.warn({
    event,
    details,
    ip: req?.ip,
    userAgent: req?.get('User-Agent'),
    userId: req?.user?.id,
    timestamp: new Date().toISOString(),
  }, 'Security Event');
};
```

### Audit Trail
```typescript
// Log authentication events
export const logAuthEvent = (event: string, userId: string, ip: string, success: boolean) => {
  logger.info({
    event,
    userId,
    ip,
    success,
    timestamp: new Date().toISOString(),
  }, 'Authentication Event');
};

// Usage in auth controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    
    logAuthEvent('LOGIN_SUCCESS', user.id, req.ip, true);
    
    // Set tokens and respond
  } catch (error) {
    logAuthEvent('LOGIN_FAILED', email, req.ip, false);
    throw error;
  }
};
```

## 🚨 Incident Response

### Error Handling
```typescript
// Global error handler
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  
  // Log the error
  logger.error({
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
  }, 'Application Error');

  // Don't leak error details in production
  if (env.NODE_ENV === 'production') {
    message = 'Something went wrong';
  } else {
    message = error.message;
  }

  res.status(statusCode).json({
    error: { message, ...(env.NODE_ENV !== 'production' && { stack: error.stack }) }
  });
};
```

### Security Incident Detection
```typescript
// Detect suspicious activity
export const detectSuspiciousActivity = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /(\<|\%3C)script/i,     // XSS attempts
    /union.*select/i,        // SQL injection attempts
    /(\$where|\$ne)/i,       // MongoDB injection attempts
  ];

  const userInput = JSON.stringify(req.body) + req.url;
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userInput)) {
      logSecurityEvent('SUSPICIOUS_REQUEST', {
        pattern: pattern.source,
        input: userInput,
      }, req);
      
      return res.status(400).json({ error: 'Invalid request' });
    }
  }
  
  next();
};
```

## 🔧 Frontend Security

### XSS Prevention
```typescript
// Sanitize user-generated content
import DOMPurify from 'dompurify';

const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
};

// Component usage
const ResourceDescription = ({ description }: { description: string }) => {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: sanitizeHtml(description) 
      }} 
    />
  );
};
```

### Secure HTTP Client
```typescript
// Axios configuration with security measures
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000, // Prevent hanging requests
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection
  },
});

// Request interceptor for security headers
api.interceptors.request.use((config) => {
  // Add CSRF token if available
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  
  return config;
});
```

### Content Security Policy (CSP)
```html
<!-- Meta tag for additional CSP -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' ${VITE_API_URL};
">
```

## 🔐 Environment Security

### Environment Variables Management
```bash
# .env.sample (safe to commit)
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/campus_syllabus_hub
JWT_ACCESS_SECRET=change-me-to-a-secure-random-string
JWT_REFRESH_SECRET=change-me-to-another-secure-random-string

# Production environment variables (never commit)
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_ACCESS_SECRET=super-secure-random-256-bit-string
JWT_REFRESH_SECRET=another-super-secure-random-256-bit-string
```

### Secret Generation
```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 64
```

## 📋 Security Checklist

### Development
- [ ] All environment variables are properly configured
- [ ] No secrets committed to git
- [ ] Input validation implemented for all endpoints
- [ ] Rate limiting configured appropriately
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] Dependency vulnerabilities checked regularly

### Deployment
- [ ] Database access restricted to application servers
- [ ] Secrets stored in secure secret management system
- [ ] Regular security updates applied
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery procedures tested
- [ ] Access logs monitored for suspicious activity

### Code Review
- [ ] Authentication and authorization logic reviewed
- [ ] Input validation and sanitization verified
- [ ] No sensitive data logged
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies are up to date and secure

## 🚨 Security Incident Response

### Immediate Response
1. **Assess the Threat**: Determine the scope and impact
2. **Contain the Incident**: Implement immediate protective measures
3. **Investigate**: Analyze logs and identify the attack vector
4. **Notify Stakeholders**: Inform relevant parties
5. **Document**: Record all actions taken

### Recovery
1. **Fix Vulnerabilities**: Address the root cause
2. **Update Security Measures**: Strengthen defenses
3. **Monitor**: Watch for additional threats
4. **Review**: Conduct post-incident review

### Contact Information
- **Security Team**: security@campus-syllabus-hub.com
- **Emergency Contact**: +1-XXX-XXX-XXXX
- **GitHub Security**: Use private vulnerability reporting

## 📚 Security Resources

### Tools and Libraries
- **OWASP ZAP**: Web application security scanner
- **npm audit**: Check for vulnerable dependencies
- **Snyk**: Continuous security monitoring
- **ESLint Security Plugin**: Static code analysis for security issues

### Best Practices
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)

### Regular Security Tasks
- **Weekly**: Review security logs and alerts
- **Monthly**: Update dependencies and run security scans
- **Quarterly**: Conduct security reviews and penetration testing
- **Annually**: Full security audit and policy review

Remember: Security is an ongoing process, not a one-time setup. Stay vigilant and keep security measures up to date!
