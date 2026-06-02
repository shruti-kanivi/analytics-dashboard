const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      user,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'Analytics User',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};