import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Models
import User from "../models/userModel.js";

// Register
router.post("/", async (req, res) => {
    const { email, username, password, passwordCheck } = req.body;

    // Not all fields
    if (!email || !username || !password)
        return res.status(400).json({ msg: "Not all fields filled" });
    // Email exists
    const emailExists = await User.findOne({ email });
    if (emailExists)
        return res.status(400).json({ msg: "Email already exists" });
    // Username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists)
        return res.status(400).json({ msg: "Username already exists" });
    // password length
    if (password.length < 8)
        return res
            .status(400)
            .json({ msg: "Password must be more than 8 characters" });
    // passwords match
    if (password !== passwordCheck)
        return res.status(400).json({ msg: "Passwords don't match" });

    // Create User

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        username,
        password: hashedPassword,
    });

    const user = await newUser.save();

    res.json({ username: user.username, id: user._id });
});

export default router;
