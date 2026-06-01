import { userRepository } from "../repositories/user.repository.js";

export const userService = {
  getUsers() {
    return userRepository.findAll();
  }
};