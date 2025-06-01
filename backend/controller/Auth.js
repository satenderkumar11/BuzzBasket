const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../model/User");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log("user already exists");
      return res
        .status(400)
        .json({ status: "error", message: "Sorry, this user already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    console.log("salt ", salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hashedPassword ", hashedPassword);
    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      maxAge: 3600000, // 1 hour in milliseconds
      secure: true, // must be true on HTTPS
      sameSite: 'none' 

    });

    res.status(201).json({
      status: "success",
      message: "User is successfully created and token is generated",
      user,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('name email password');
    
    if (!user) {
      return res.status(401).json({
        status: "error",
        message:
          "Sorry, this does not match our records. Check your spelling and try again.",
      });
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({
          status: "error",
          message:
            "Sorry, this does not match our records. Check your spelling and try again.",
        });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      maxAge: 3600000, // 1 hour in milliseconds
      secure: true, // must be true on HTTPS
      sameSite: 'none' 
    });

    console.log({ user });
    res.status(200).json({
      status: "success",
      message: "User successfully logged in",
      user,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getUserByToken = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(204).json({
        status: "error",
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("email name");

    if (!user) {
      res.clearCookie("token");
      return res.status(204).json({
        status: "error",
        message: "User not found mapped on this token",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User details fetched successfully",
      user,
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: err.message,
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    return res.status(200).json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to log out",
      error: error.message,
    });
  }
};
