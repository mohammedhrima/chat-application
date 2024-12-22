import User from "../model/userModel.js"
import bcrypt from "bcrypt"

export async function Login(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
}

export async function Signup(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ username })
    if (userExists)
      return res.json({ msg: "Username already used", status: false });
    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword });
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
}

export async function Clear(req, res, next) {
  try {
    const result = await User.deleteMany({});
    
    return res.json({ status: true, msg: `${result.deletedCount} users deleted` });
  } catch (error) {
    next(error);
  }
}