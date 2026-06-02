import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";
import generateToken from "../shared/utils/generateToken.js";
import { AuthError } from "../shared/errors/auth.error.js";
import type {
  AuthUserResponse,
  LoginBody,
  LoginResponse,
  RegisterBody,
  RegisterResponse,
} from "../shared/types/auth.type.js";

const toAuthUserResponse = (user: {
  id: string;
  name: string;
  email: string;
}): AuthUserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const authService = {
  async register(body: RegisterBody): Promise<RegisterResponse> {
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

    return toAuthUserResponse(user);
  },

  async login(body: LoginBody): Promise<LoginResponse> {
    const { email, password } = body;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthError("INVALID_EMAIL");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthError("INVALID_PASSWORD");
    }

    const accessToken = generateToken(user.id);

    return {
      accessToken
    };
  },
};