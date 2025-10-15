export const environment = {
  production: true,
  fr: {
    // Production: Use full AM URL
    amUrl: 'https://cdk.example.com/am',
    // Development URL for reference
    devAmUrl: 'https://localhost:4200/am',
    realmPath: '',
    clientId: 'web',
    redirectUri: 'https://yourapp.example.com/callback',
    scope: 'openid profile email',
    treeLogin: 'Login',
    treeRegister: 'RegistrationTree'
  }
};