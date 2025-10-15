export interface AuthOutcome {
  type: 'LoginSuccess' | 'LoginFailure' | 'Step';
  sessionToken?: string;
  successUrl?: string;
  realm?: string;
  detail?: any;
}

export interface TokenInfo {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface UserInfo {
  sub?: string;
  name?: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: any;
}