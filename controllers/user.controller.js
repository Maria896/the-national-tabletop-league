import {
  register,
  verifyUserEmail,
  login,
  forgotPasword,
  resetUserPasword,
  getUsers,
} from "../services/user.service.js";

// Path     :   /api/user/register
// Method   :   Post
// Access   :   Public
// Desc     :   Register New User
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, region, state, password } = req.body;

    const { status, message } = await register(
      firstName,
      lastName,
      email,
      region,
      state,
      password
    );
    res.send({
      status: status,
      message: message,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Path     :   /api/user/verify-email/:token
// Method   :   Get
// Access   :   Public
// Desc     :   Verify email of new user
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    //console.log(token);
    const { status, message } = await verifyUserEmail(token);
    res.send({
      status: status,
      message: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Path     :   /api/user/login
// Method   :   Post
// Access   :   Public
// Desc     :   Login User
export const loginUser = async (req, res) => {
  const { email, password, token } = req.body;
  try {
    const { status, message, token } = await login(email, password);
    res.send({
      status: status,
      message: message,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Path     :   /api/user/
// Method   :   Get
// Access   :   Private
// Desc     :   Get All users
export const getAllUsers = async (req, res) => {
  const userId = req.userId;
  try {
    const { status, message, users } = await getUsers(userId);
    res.send({
      status: status,
      message: message,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Path     :   /api/user/google-login
// Method   :   Post
// Access   :   Public
// Desc     :   Login User Via Google
export const googlelogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

    res.json(await googlelogin(tokenId));
  } catch (err) {
    console.log({ err });
    const { status } = err;
    const s = status ? status : "500";
    res.status(s).send({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    res.json(await forgotPasword(email));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reset password
export const resetUserPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    const { token } = req.params;
    res.json(await resetUserPasword(password, confirmPassword, token));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
