import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Models
import User from "../models/userModel.js";

// Middleware
const auth = async (req, res, next) => {
    try {
        // Token Accepted
        const token = req.header("auth-token");
        if (!token)
            return res
                .status(401)
                .json({ msg: "No user token, access denied" });

        // Token Valid
        const validToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!validToken)
            return res.status(401).json({ msg: "User token not accepted" });

        req.user = validToken.id;
        next();
    } catch (err) {
        return res.status(500).json();
    }
};

// Register
router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Form Filled
        if (!email || !password)
            return res.status(400).json({ msg: "Not all fields filled" });
        // Email/User exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User doesn't exist" });
        // Correct password
        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch)
            return res.status(400).json({ msg: "Password Incorrect" });
        // Create JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/validToken", async (req, res) => {
    // Token Accepted
    const token = req.header("auth-token");
    if (!token) return res.json(false);

    // Token Valid
    const validToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!validToken) return res.json(false);

    // User exists
    const userExists = await User.findById(validToken.id);
    if (!userExists) return res.json(false);

    return res.json(true);
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);

    res.json({
        id: user._id,
        username: user.username,
    });
});

export default router;
