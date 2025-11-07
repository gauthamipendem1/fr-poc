# ForgeRock Angular Integration

A comprehensive Angular application that provides dynamic authentication UI rendering and complete brand customization for ForgeRock Access Management integration.

## 🌟 Key Features

- **🔄 Dynamic UI Rendering**: Automatically adapts to ForgeRock authentication tree changes
- **🎨 Complete Brand Customization**: Teams can supply their own CSS files for full visual control
- **📱 Mobile-First Design**: Responsive layouts optimized for all devices
- **🔒 Comprehensive Authentication**: Supports all 26 ForgeRock callback types
- **⚡ Real-Time Updates**: No code deployments needed for authentication flow changes
- **🏢 Multi-Brand Support**: Unlimited brands with URL-based routing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- ForgeRock Access Management instance
- Angular CLI

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd fr-poc

# Install dependencies
npm install

# Start development server
npm run start

# Open browser
https://localhost:4200
```

### Test Different Brands
```bash
https://localhost:4200/a/login        # Brand A (Professional Blue)
https://localhost:4200/b/login        # Brand B (Modern Red)
https://localhost:4200/c/login        # Brand C (Compact Green)
https://localhost:4200/minimal/login  # Minimal Theme
https://localhost:4200/mobile/login   # Mobile Optimized
```

## 📖 Documentation

### For Developers
- **[Technical Documentation](./TECHNICAL_DOCUMENTATION.md)**: Comprehensive technical guide for developers
- **[Quick Start Guide](./QUICK_START_GUIDE.md)**: Get up and running in 5 minutes

### For Business/Product Teams
- **[Business Documentation](./BUSINESS_DOCUMENTATION.md)**: Functional overview and business benefits

## 🏗️ Architecture Overview

### Core Components
```
┌─────────────────────────────────────────────┐
│              Angular Application             │
├─────────────────────────────────────────────┤
│  🎨 BrandingService                         │
│  ├── Dynamic CSS loading                   │
│  ├── Brand detection from URL              │
│  └── Theme customization                   │
├─────────────────────────────────────────────┤
│  🔄 TreeRunnerService                       │
│  ├── ForgeRock communication               │
│  ├── Authentication state management       │
│  └── Dynamic step processing               │
├─────────────────────────────────────────────┤
│  🧩 Callback Components (26 types)         │
│  ├── Username/Password inputs              │
│  ├── Multi-factor authentication           │
│  ├── Social login options                  │
│  └── Advanced security features            │
└─────────────────────────────────────────────┘
```

### Supported Authentication Methods
- **Basic Authentication**: Username/password, email authentication
- **Multi-Factor Authentication**: WebAuthn (biometrics), SMS/Email OTP, Knowledge-based auth
- **Advanced Security**: reCAPTCHA, PingOne Protect, device profiling
- **Social Authentication**: Google, Facebook, enterprise SAML
- **Enterprise Features**: SSO integration, conditional authentication

## 🎨 Brand Customization

### Creating a New Brand

1. **Create CSS File**: `/public/assets/styles/brands/your-brand.css`
```css
/* Complete visual control */
.min-h-screen {
  background: linear-gradient(45deg, #your-color1, #your-color2) !important;
}

input, button, .form-input {
  /* Your brand styling */
}
```

2. **Add Brand Configuration**: Update `BrandingService`
3. **Add Route**: Configure URL routing
4. **Test**: Navigate to `/your-brand/login`

### Brand Examples
- **Enterprise**: Professional blue theme with corporate styling
- **Consumer**: Modern red theme with dynamic effects  
- **Compact**: Green theme optimized for efficiency
- **Minimal**: Clean, distraction-free interface
- **Mobile**: Touch-optimized layouts for mobile apps

## 🔐 ForgeRock Integration

### Supported Callback Types (26 Total)
| Category | Callback Types |
|----------|---------------|
| **Basic Input** | Name, Password, Text Input, Number Input, Boolean Input |
| **Authentication** | WebAuthn Registration/Authentication, Choice Selection |
| **Security** | reCAPTCHA (v2 & Enterprise), Device Profile, Metadata |
| **Multi-Factor** | SMS/Email OTP, Knowledge-based Authentication |
| **User Management** | Validated Username/Password Creation, String/Number Attributes |
| **Advanced** | Polling Wait, Redirect, Select Identity Provider, Terms & Conditions |
| **Enterprise** | Suspended Text Output, PingOne Protect (Initialize & Evaluation) |

### Dynamic UI Flow
```
ForgeRock Tree Change → SDK Response → UI Auto-Update → User Interaction
```

No application deployment needed for authentication flow modifications!

## 🛠️ Development

### Project Structure
```
src/
├── app/
│   ├── auth/                    # Authentication logic
│   │   ├── tree-runner.service.ts
│   │   ├── callback-mapper.ts
│   │   └── models/
│   ├── callbacks/               # 26 callback components
│   │   ├── base-branded-callback.ts
│   │   ├── name-callback/
│   │   ├── password-callback/
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── login/
│   │   ├── register/
│   │   └── account/
│   ├── services/
│   │   └── branding.service.ts  # Brand management
│   └── app.routes.ts            # Multi-brand routing
├── environments/                # ForgeRock configuration
└── styles.css                   # Base styling

public/assets/styles/brands/     # Brand CSS files
├── a.css                        # Brand A styling
├── b.css                        # Brand B styling
└── your-brand.css               # Custom brand
```

### Adding New Callback Types
1. Generate component: `ng generate component callbacks/new-callback --standalone`
2. Extend `BaseBrandedCallback`
3. Implement `BaseCallbackInterface`
4. Update `callback-mapper.ts`
5. Add to page templates

### Available Scripts
```bash
npm run start       # Development server
npm run build       # Production build
npm run test        # Run tests
npm run lint        # Code linting
```

## 🔧 Configuration

### Environment Setup
```typescript
// src/environments/environment.ts
export const environment = {
  fr: {
    serverConfig: {
      baseUrl: 'https://your-forgerock-instance.com/am',
      timeout: '5000'
    },
    treeLogin: 'Login',
    treeRegister: 'Registration'
  }
};
```

### ForgeRock Requirements
- **Authentication Trees**: Configured in ForgeRock AM
- **OAuth 2.0 Client**: Registered for your application
- **CORS Settings**: Allow your application domain
- **HTTPS**: Required for WebAuthn functionality

## 📋 Feature Comparison

| Feature | Traditional Auth | ForgeRock Integration |
|---------|-----------------|----------------------|
| **UI Changes** | Code + Deploy | ForgeRock Config Only |
| **New Auth Methods** | Development Required | Configuration Only |
| **Brand Support** | Single Theme | Unlimited Brands |
| **Mobile Optimization** | Manual Implementation | Built-in Responsive |
| **Security Updates** | Code Changes | Instant Policy Updates |
| **A/B Testing** | Complex Setup | Tree Configuration |

## 🚦 Getting Help

### Common Issues
- **Brand not loading**: Check CSS file path and syntax
- **Authentication errors**: Verify ForgeRock configuration and CORS
- **Styling conflicts**: Ensure CSS uses `!important` declarations

### Documentation
- **Technical Details**: See [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
- **Business Overview**: See [Business Documentation](./BUSINESS_DOCUMENTATION.md)
- **Quick Setup**: See [Quick Start Guide](./QUICK_START_GUIDE.md)

### Support Resources
- **ForgeRock SDK Documentation**: [Official Docs](https://sdks.forgerock.com/)
- **Angular Documentation**: [Angular.dev](https://angular.dev)
- **Example Code**: Check `/src/app/callbacks/` for implementation examples

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines
- Follow Angular style guide
- Add tests for new callback components
- Update documentation for new features
- Test across multiple brands and devices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

### Upcoming Features
- **Advanced Analytics**: Authentication flow analytics and reporting
- **Theme Builder**: Visual interface for creating brand themes
- **Component Library**: Reusable authentication components
- **Advanced Layouts**: Additional layout options for specialized use cases
- **Integration Templates**: Pre-built configurations for common scenarios

---

**Built with ❤️ using Angular + ForgeRock**

*Ready to revolutionize your authentication experience!* 🚀