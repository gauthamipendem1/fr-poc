# ForgeRock Angular Authentication App

A modern Angular application demonstrating ForgeRock authentication trees integration with advanced features including WebAuthn/Passkeys, multi-factor authentication, and OIDC PKCE flow.

## Features

- ✅ **Authentication Trees**: Full support for ForgeRock login and registration trees
- ✅ **WebAuthn/Passkeys**: Biometric authentication and security key support
- ✅ **Multi-Factor Authentication**: SMS, Email, OTP support via callback components
- ✅ **OIDC PKCE Flow**: Secure token management with ForgeRock SDK
- ✅ **Responsive UI**: Tailwind CSS with accessible components
- ✅ **Reactive Forms**: Angular reactive forms with validation
- ✅ **Route Guards**: Protected routes with authentication
- ✅ **Token Management**: Secure token storage and refresh handling

## Architecture

### Core Components

- **TreeRunnerService**: Orchestrates ForgeRock authentication tree execution
- **Callback Components**: Reusable UI components for each ForgeRock callback type
- **Auth Guard**: Protects routes requiring authentication
- **Auth Interceptor**: Automatically adds Bearer tokens to API requests

### Supported Callback Types

- `NameCallback` - Username input
- `PasswordCallback` - Password input with visibility toggle
- `ChoiceCallback` - Single/multi-select options
- `TextOutputCallback` - Information, warning, and error messages
- `WebAuthnRegistrationCallback` - Passkey registration
- `WebAuthnAuthenticationCallback` - Passkey authentication
- `BooleanAttributeInputCallback` - Boolean input fields
- `KbaCreateCallback` - Knowledge-based authentication setup
- `ReCaptchaCallback` - CAPTCHA verification
- `PollingWaitCallback` - Polling for async operations

## Prerequisites

- Node.js 18+ and npm
- ForgeRock 7.4 CDK deployment
- Modern browser with WebAuthn support (for passkeys)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure ForgeRock Environment

Update `src/environments/environment.ts` with your ForgeRock settings:

```typescript
export const environment = {
  production: false,
  fr: {
    amUrl: 'https://your-cdk.example.com/am',
    realmPath: '/your-realm',
    clientId: 'your-oidc-client-id',
    redirectUri: 'https://localhost:4200/callback',
    scope: 'openid profile email',
    treeLogin: 'YourLoginTree',
    treeRegister: 'YourRegistrationTree'
  }
};
```

### 3. ForgeRock Configuration Requirements

Ensure your ForgeRock environment has:

- **OIDC Client** configured with:
  - Client ID matching `environment.fr.clientId`
  - PKCE enabled
  - Redirect URI: `https://localhost:4200/callback`
  - Scopes: `openid profile email`

- **Authentication Trees**:
  - Login tree with username/password and WebAuthn nodes
  - Registration tree with user creation and optional WebAuthn registration

### 4. SSL Certificate (Required for WebAuthn)

WebAuthn requires HTTPS. Generate a self-signed certificate for development:

```bash
# Generate SSL certificate for localhost
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"

# Move to Angular project
mkdir ssl
mv cert.pem key.pem ssl/
```

Update `angular.json` to use HTTPS:

```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "ssl": true,
    "sslCert": "ssl/cert.pem",
    "sslKey": "ssl/key.pem"
  }
}
```

## Running the Application

### Development Server (with CORS Proxy)

The application includes a proxy configuration to bypass CORS restrictions during development:

```bash
npm start
# This runs: ng serve --ssl --proxy-config proxy.conf.json
```

**What the proxy does:**
- Forwards `/am`, `/oauth2`, and `/json` requests from `localhost:4200` to `https://cdk.example.com`
- Avoids browser CORS errors during development
- Automatically handles authentication tree calls and token requests
- SDK configured to use `https://localhost:4200/am` which gets proxied to the real ForgeRock server
- Ignores SSL certificate validation (`secure: false`) for development with self-signed certs

Navigate to `https://localhost:4200`. Accept the self-signed certificate warning.

**Alternative start commands:**
```bash
npm run start:http          # HTTP version with proxy
npm run start:no-proxy      # HTTPS without proxy (may have CORS issues)
```

**Important:** This proxy is **only for local development**. In production:
- Host your Angular app under the same domain as ForgeRock AM, OR
- Use a reverse proxy (nginx, Apache, etc.) to serve both applications, OR
- Configure proper CORS headers in ForgeRock AM

### Build for Production

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## Application Flow

### 1. Login Flow (`/login`)
1. User navigates to login page
2. TreeRunnerService starts the configured login tree
3. Callbacks are rendered dynamically based on tree configuration
4. User completes authentication steps (username/password, WebAuthn, MFA)
5. On success, user is redirected to account page

### 2. Registration Flow (`/register`)
1. User navigates to registration page
2. TreeRunnerService starts the configured registration tree
3. User completes registration steps (profile info, password, WebAuthn setup)
4. On success, user is redirected to account page

### 3. WebAuthn/Passkey Support
- **Registration**: Offered during registration or from account page
- **Authentication**: Available as login option for returning users
- **Fallback**: Always provides password-based alternatives

### 4. Token Management
- Tokens stored securely using ForgeRock SDK TokenManager
- Automatic token refresh handled by SDK
- Auth guard protects routes requiring valid tokens

## Project Structure

```
src/
├── app/
│   ├── auth/                           # Authentication services and guards
│   │   ├── fr-sdk.config.ts           # ForgeRock SDK configuration
│   │   ├── tree-runner.service.ts     # Tree orchestration service
│   │   ├── auth.guard.ts              # Route protection
│   │   ├── auth.interceptor.ts        # HTTP token interceptor
│   │   ├── callback-mapper.ts         # Callback type mappings
│   │   └── models/                    # TypeScript interfaces
│   ├── callbacks/                     # Reusable callback components
│   │   ├── name-callback/
│   │   ├── password-callback/
│   │   ├── webauthn-register-callback/
│   │   └── ...
│   ├── pages/                         # Main application pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── callback/
│   │   ├── account/
│   │   └── logout/
│   ├── app.routes.ts                  # Application routing
│   └── app.config.ts                  # Application configuration
├── environments/                      # Environment configurations
└── styles.css                        # Global Tailwind CSS
```

## Customization

### Adding New Callback Types

1. Create component in `src/app/callbacks/new-callback/`
2. Implement `BaseCallbackInterface`
3. Add mapping to `callback-mapper.ts`
4. Import and use in page templates

### Styling

The application uses Tailwind CSS with `@tailwindcss/forms` for consistent form styling. Customize in:
- `tailwind.config.js` for theme modifications
- Component templates for specific styling
- `src/styles.css` for global styles

### Authentication Trees

Configure your ForgeRock trees to include desired authentication factors:
- Username/Password nodes
- WebAuthn Registration/Authentication nodes
- OTP/SMS/Email nodes for MFA
- Choice nodes for authentication method selection

## Security Considerations

- ✅ HTTPS required for WebAuthn
- ✅ Tokens stored using ForgeRock SDK secure storage
- ✅ PKCE flow prevents authorization code interception
- ✅ CSP headers recommended for production
- ✅ No sensitive data logged to console
- ✅ Auth guard protects sensitive routes

## Browser Support

- **WebAuthn**: Chrome 67+, Firefox 60+, Safari 14+, Edge 18+
- **Application**: Modern browsers supporting ES2020
- **Fallback**: Password authentication always available

## Troubleshooting

### Common Issues

**WebAuthn not working**: Ensure HTTPS is enabled and browser supports WebAuthn

**Authentication failures**: Check ForgeRock logs and verify tree configuration

**Token issues**: Clear browser storage and retry authentication

**CORS errors**: 
- For development: Use the included proxy configuration (`npm start`)
- For production: Configure CORS in ForgeRock AM or use same-origin deployment
- Check that `proxy.conf.json` target URL matches your ForgeRock deployment

### Development Tips

- Use browser DevTools to inspect ForgeRock SDK operations
- Check Network tab for authentication tree API calls
- Verify token payload using JWT debugger tools
- Test with different authentication tree configurations

## Production Deployment

1. Update `environment.prod.ts` with production ForgeRock URLs
2. Configure proper SSL certificates
3. Set up proper CORS policies in ForgeRock
4. Implement proper CSP headers
5. Configure token refresh policies
6. Set up monitoring for authentication failures

## Contributing

1. Follow Angular style guide
2. Use TypeScript strict mode
3. Implement proper error handling
4. Add JSDoc comments for public APIs
5. Test with various ForgeRock tree configurations

## License

This project is provided as a demonstration of ForgeRock authentication integration patterns.