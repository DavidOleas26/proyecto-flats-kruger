import jwt from "jsonwebtoken";
import configs from "../configs/configs.js";

export class AuthService {

  static getToken = ( user ) => {
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        userName: user.firstName,
        userLastName: user.lastName,
      },
      configs.JWT_SECRET,
      {
        expiresIn: "6h",
      }
    )
    return token
  }

}