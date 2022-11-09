import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from "crypto";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"],
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is requires'],
        minLength: 8,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts"
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    recentSearches: [
        {
            type: String,
        }
    ],
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpires: {
        type: Date
    }
}, { timestamps: true })

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next();
    };
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const Users = mongoose.model("Users", userSchema);
export default Users;