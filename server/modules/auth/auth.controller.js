import { signupService } from "./auth.service";

const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const registeredUser = await signupService(name, email, password, confirmPassword);
    res.status(201).json({message:"User created successfully", registeredUser});
  } catch (error) {
    res.status(400).json({error});
  }

};
