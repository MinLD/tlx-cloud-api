export type UserResponse = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type GetUsersResponse = UserResponse[];