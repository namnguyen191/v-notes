import { Brand } from '@v-notes/shared/helpers';

export type AccessToken = Brand<string, 'AccessToken'>;

export type AccessTokenResponse = {
  access_token: AccessToken;
};

export type SignUpRequestBody = {
  email: string;
  password: string;
};

export type SignInRequestBody = SignUpRequestBody;

export type SignUpResponse = AccessTokenResponse;
export type SignInResponse = AccessTokenResponse;
