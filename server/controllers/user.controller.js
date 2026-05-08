import userService from "../services/user.services.js";

const { createUserService } = userService;

const createUser = async (req, res) => {
  try {
    const user = await createUserService(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default createUser;
