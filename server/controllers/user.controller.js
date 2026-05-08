import createUserService from "../services/user.services.js"

const createUser = async (req,res)=>{
  try {
    const user = await createUserService(req.body);
    res.json(user)
  } catch (error) {
    res.json(500).json({error: error.message})
  }
}

export default createUser;