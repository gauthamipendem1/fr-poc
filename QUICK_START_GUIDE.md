# ForgeRock Angular Integration - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- ForgeRock Access Management instance configured
- Basic understanding of Angular and CSS

## 📋 Quick Setup Checklist

### 1. Clone & Install
```bash
git clone <your-repo>
cd fr-poc
npm install
npm run start
```

### 2. Configure ForgeRock Environment
Update `src/environments/environment.ts`:
```typescript
export const environment = {
  fr: {
    serverConfig: {
      baseUrl: 'https://your-forgerock-instance.com/am',
      timeout: '5000'
    },
    treeLogin: 'Login',      // Your login tree name
    treeRegister: 'Registration'  // Your registration tree name
  }
};
```

### 3. Test Default Authentication
- Navigate to `https://localhost:4200/login`
- Verify connection to ForgeRock
- Test basic username/password flow

## 🎨 Creating Your First Brand

### Step 1: Create Brand CSS File
Create `/public/assets/styles/brands/my-brand.css`:

```css
/* My Brand Theme */
:root {
  --brand-primary: #your-primary-color;
  --brand-secondary: #your-secondary-color;
}

/* Page Background */
.min-h-screen {
  background: linear-gradient(135deg, #color1, #color2) !important;
  font-family: 'Your Font', sans-serif !important;
}

/* Form Inputs */
input, select, textarea, .form-input {
  border: 2px solid #your-border-color !important;
  border-radius: 8px !important;
  padding: 12px !important;
}

/* Buttons */
button, .btn-primary {
  background: var(--brand-primary) !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 12px 24px !important;
}

/* Headers */
h1, h2, h3, .page-title {
  color: var(--brand-primary) !important;
  font-weight: bold !important;
}
```

### Step 2: Add Brand Configuration
Update `src/app/services/branding.service.ts`:

```typescript
private brandConfigs: { [key: string]: BrandConfig } = {
  // ... existing brands
  'my-brand': {
    name: 'My Brand',
    cssFile: 'my-brand.css',
    theme: {
      primaryColor: '#your-primary-color',
      secondaryColor: '#your-secondary-color',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      borderRadius: '8px',
      fontFamily: 'Your Font, sans-serif'
    },
    title: 'My Brand Authentication',
    layout: 'modern',
    spacing: {
      container: '2rem',
      input: '12px',
      button: '12px 24px',
      margin: '1rem'
    },
    typography: {
      scale: 'medium',
      weight: 'normal'
    }
  }
};
```

### Step 3: Add Route Configuration
Update `src/app/app.routes.ts`:

```typescript
export const routes: Routes = [
  // ... existing routes
  {
    path: 'my-brand',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  }
];
```

### Step 4: Test Your Brand
- Navigate to `https://localhost:4200/my-brand/login`
- Verify your custom styling appears
- Test authentication flow with your brand

## 🔧 Common Customizations

### Brand Color Scheme
```css
:root {
  --brand-primary: #1e40af;      /* Main brand color */
  --brand-secondary: #3b82f6;    /* Accent color */
  --brand-bg: #f8fafc;           /* Page background */
  --brand-text: #1e293b;         /* Text color */
}
```

### Layout Styles
```css
/* Compact Layout */
.callback-container {
  padding: 1rem !important;
  margin-bottom: 0.5rem !important;
}

/* Spacious Layout */
.callback-container {
  padding: 3rem !important;
  margin-bottom: 2rem !important;
}
```

### Interactive Effects
```css
/* Hover Effects */
button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
}

/* Focus Effects */
input:focus {
  transform: scale(1.02) !important;
  box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1) !important;
}
```

## 🔐 ForgeRock Tree Configuration

### Basic Login Tree
1. **Username Collector Node** → Collects username
2. **Password Collector Node** → Collects password  
3. **Data Store Decision Node** → Validates credentials
4. **Success/Failure Outcomes**

### Multi-Factor Authentication Tree
1. **Username/Password Collection**
2. **Choice Collector Node** → SMS or Email MFA
3. **MFA Evaluation** → Send code and validate
4. **Success Outcome**

### Social Login Tree  
1. **Choice Collector Node** → Google, Facebook, or Traditional
2. **Social Provider Nodes** → Handle OAuth flows
3. **Account Linking** → Connect social to local account
4. **Success Outcome**

## 📱 Testing Different Scenarios

### Test Authentication Flows
```bash
# Test different brand URLs
https://localhost:4200/a/login       # Brand A
https://localhost:4200/b/login       # Brand B
https://localhost:4200/my-brand/login # Your custom brand
```

### Test Callback Types
Use the test page to verify all callback types render correctly:
```bash
https://localhost:4200/my-brand/test-callbacks
```

## 🐛 Troubleshooting

### Common Issues & Solutions

**Brand CSS Not Loading**
- Check file path: `/public/assets/styles/brands/[name].css`
- Verify CSS file syntax
- Check browser developer tools for 404 errors

**Authentication Not Working**
- Verify ForgeRock environment configuration
- Check CORS settings in ForgeRock
- Validate tree names match configuration

**Styling Not Applying**
- Ensure CSS rules use `!important`
- Check CSS selector specificity
- Verify brand configuration matches route

**Component Not Rendering**
- Check if callback type is supported
- Verify callback mapping in `callback-mapper.ts`
- Add component to page template imports

### Debug Steps
1. **Check Browser Console** for JavaScript errors
2. **Network Tab** to verify API calls to ForgeRock
3. **Developer Tools** to inspect CSS loading
4. **Angular DevTools** to check component state

## 📚 Next Steps

### Advanced Customizations
- **Custom Animations**: Add CSS transitions and animations
- **Responsive Design**: Optimize for different screen sizes
- **Accessibility**: Add ARIA labels and keyboard navigation
- **Analytics**: Integrate tracking for authentication events

### Production Deployment
- **Environment Configuration**: Set up production ForgeRock URLs
- **SSL/HTTPS**: Ensure secure connections (required for WebAuthn)
- **Performance Optimization**: Bundle optimization and CDN setup
- **Monitoring**: Set up error tracking and analytics

### Team Collaboration
- **Design Handoff**: Process for designers to create brand CSS
- **Brand Review**: Testing and approval workflow for new brands
- **Documentation**: Maintain brand style guides and specifications

## 💡 Pro Tips

### CSS Best Practices
- Use CSS custom properties for consistency
- Always include `!important` to override defaults
- Test across different browsers and devices
- Consider dark mode and accessibility

### ForgeRock Best Practices  
- Keep authentication trees simple and focused
- Test tree changes in development first
- Document tree logic and decision points
- Monitor authentication success rates

### Performance Tips
- Minimize CSS file sizes
- Use efficient CSS selectors
- Leverage browser caching for brand assets
- Monitor page load times across brands

## 🆘 Support Resources

### Documentation Links
- **Technical Documentation**: `TECHNICAL_DOCUMENTATION.md`
- **Business Documentation**: `BUSINESS_DOCUMENTATION.md`
- **ForgeRock SDK Docs**: [Official ForgeRock Documentation](https://sdks.forgerock.com/)

### Code Examples
- **Callback Components**: `src/app/callbacks/`
- **Brand Service**: `src/app/services/branding.service.ts`
- **Example CSS Files**: `public/assets/styles/brands/`

### Development Tools
- **Angular CLI**: Component generation and builds
- **Browser DevTools**: CSS inspection and debugging
- **ForgeRock Admin Console**: Tree configuration and testing

Ready to build amazing authentication experiences! 🎉