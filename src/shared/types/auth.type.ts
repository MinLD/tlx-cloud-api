export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type AuthUserResponse = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  accessToken: string;
};

export type RegisterResponse = AuthUserResponse;
