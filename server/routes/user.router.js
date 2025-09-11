import express from "express";
import { UserController } from "../controllers/user.controller.js";

// Middlewares authentication and authorization
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { AuthorizationMiddleware } from "../middlewares/userAuthorization.middleware.js";
import { UserMiddleware } from "../middlewares/user.middleware.js";
import { upload } from "../middlewares/uploadCloudinary.middleware.js";

const userRouter = express.Router();

userRouter.use(authenticationMiddleware)

userRouter.get('/:id/profile-image', UserController.getUserProfileImageById);

userRouter.post("/upload-profile-image", upload.single('profileImage'), UserController.uploadProfileImage)

userRouter.get("/", 
  AuthorizationMiddleware.authAdminMiddleware, 
  UserMiddleware.validateQueryMiddleware, 
  UserMiddleware.buildQueryMiddleware ,
  UserController.getAllUsers
);

userRouter.get("/:id", UserController.getUserById);

userRouter.patch("/:id", 
  AuthorizationMiddleware.authUserMiddleware, 
  AuthorizationMiddleware.authUserUpdateMiddleware, 
  UserController.updateUser
);

userRouter.delete("/:id", 
  AuthorizationMiddleware.authUserMiddleware, 
  UserController.deleteUser
);

export default userRouter;
