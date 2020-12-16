import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true, minLength: 8 },
});

const User = mongoose.model("users", UserSchema);
export default User;
