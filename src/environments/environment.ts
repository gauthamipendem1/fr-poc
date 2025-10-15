export const environment = {
  production: false,
  fr: {
    // Development: Use relative path - proxy will handle routing
    amUrl: '/am',
    // Production URL for reference
    prodAmUrl: 'https://cdk.example.com/am',
    realmPath: '',
    clientId: 'web',
    redirectUri: 'https://localhost:4200/callback',
    scope: 'openid profile email',
    treeLogin: 'Login',
    treeRegister: 'Registration'
  }
};