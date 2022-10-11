import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
        minLength: 8
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
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

const Users = mongoose.model("Users", userSchema);
export default Users;