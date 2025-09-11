import { UserService } from "../services/user.service.js";
import { AuthService } from "../services/auth.service.js";
import { validateUserSchema } from "../schemas/user.schema.js";

export class AuthController {

  static register = async (req, res) => {
    try {
      
      if (req.body?.role) {
          return res.status(400).json({error: 'Invalid Fields'});
      }

      const { error, value } = validateUserSchema.validate(req.body)
      if (error) {
        return res.status(400).json({ error: error.details[0].message })
      }
  
      const user = await UserService.saveUser(req.body)
      const userToken = AuthService.getToken(user)
      
      res.status(201).json({
        message: "User created successfully", 
        user: {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }, 
        token: userToken
      })
  
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        return res.status(400).json({ error: 'This email address is already in use' });
      }
      res.status(500).json({ error: error.message })
    }
  }

  static login = async (req, res) => {
    try {
      
      const { email, password } = req.body;

      if ( !email || !password ) {
        return res.status(400).json({ error: "Credentials Required" })
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }

      const user = await UserService.findByEmail(email)
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" })
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const userToken = AuthService.getToken(user)
      res.json({ 
        token: userToken,
        user: {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        } 
      })
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

