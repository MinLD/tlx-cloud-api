import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { User } from "../../generated/prisma/client.js";
import { env } from "../../config/env.js";
import { userRepository } from "../users/user.repository.js";
import { AuthError } from "./auth.error.js";
import type {
  AuthUserResponseDto,
  IdentityResponseDto,
  LoginBodyDto,
  LoginResponseDto,
  RefreshResponseDto,
  RegisterBodyDto,
  RegisterResponseDto,
} from "./auth.dto.js";

type JwtPayload = {
  id: string;
};

type IdentityUser = NonNullable<Awaited<ReturnType<typeof userRepository.findIdentityById>>>;

const toAuthUserResponseDto = (user: Pick<User, "id" | "name" | "email">): AuthUserResponseDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const generateAccessToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign({ id: userId }, env.JWT_SECRET, options);
};

const generateRefreshToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, options);
};

const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (typeof decoded !== "object" || typeof decoded.id !== "string") {
      throw new AuthError("INVALID_TOKEN");
    }

    return { id: decoded.id };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError("INVALID_TOKEN");
  }
};

const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);

    if (typeof decoded !== "object" || typeof decoded.id !== "string") {
      throw new AuthError("INVALID_TOKEN");
    }

    return { id: decoded.id };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError("INVALID_TOKEN");
  }
};

const toIdentityResponseDto = (user: IdentityUser): IdentityResponseDto => {
  const roles = user.roles.map((userRole) => userRole.roleName);
  const permissions = [
    ...new Set(
      user.roles.flatMap((userRole) =>
        userRole.role.permissions.map((permission) => permission.permissionName),
      ),
    ),
  ];

  return {
    user: toAuthUserResponseDto(user),
    roles,
    permissions,
  };
};

export const authService = {
  async register(body: RegisterBodyDto): Promise<RegisterResponseDto> {
    const { name, email, password } = body;

    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw new AuthError("USER_ALREADY_EXISTS");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return toAuthUserResponseDto(user);
  },

  async login(body: LoginBodyDto): Promise<LoginResponseDto> {
    const { email, password } = body;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthError("INVALID_EMAIL");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthError("INVALID_PASSWORD");
    }

    return {
      accessToken: generateAccessToken(user.id),
      refreshToken: generateRefreshToken(user.id),
    };
  },

  async refresh(token: string): Promise<RefreshResponseDto> {
    const payload = verifyRefreshToken(token);
    const user = await userRepository.findById(payload.id);

    if (!user) {
      throw new AuthError("USER_NOT_FOUND");
    }

    return {
      accessToken: generateAccessToken(user.id),
    };
  },

  async authenticateAccessToken(token: string): Promise<IdentityResponseDto> {
    const payload = verifyAccessToken(token);
    const user = await userRepository.findIdentityById(payload.id);

    if (!user) {
      throw new AuthError("USER_NOT_FOUND");
    }

    return toIdentityResponseDto(user);
  },
};
