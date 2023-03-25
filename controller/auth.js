const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")
const fs = require("fs/promises");
const path = require("path");
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');

const { User } = require("../models/user")
const { HttpError, ctrlWrapper } = require("../helpers")
const sendEmail = require("../helpers/sendEmail")
const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use")
    }
    const verificationToken = uuidv4();
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
    }
    await sendEmail(verifyEmail)

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatarURL,
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw HttpError(404)
    }

    await User.findByIdAndUpdate(user._id, {
        verify: true, verificationToken: ""
    });

    res.json({ message: "Verification successful" });
}

const reSendEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw HttpError(400, "Missing required field email");
    }

    const { verificationToken } = await User.findOne({ email });

    if (!verificationToken) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
    }
    await sendEmail(verifyEmail)

    res.json({ "message": "Verification email sent" })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong"); // "Email invalid"
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Not authorized"); // "Password invalid"
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    if (!user.verify) {
        throw HttpError(401, "User is not verified"); // "Email invalid"
    }

    res.json({
        token,
        email: user.email,
        subscription: user.subscription,
    })
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    console.log(req.user);
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({
        message: "No Content"
    })
}

const updateSubscription = async (req, res) => {
    const { _id, email } = req.user;
    const { subscription } = req.body;
    await User.findByIdAndUpdate(_id, { subscription: subscription });

    res.json({
        email,
        subscription,
    })
}

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars')
const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;

    await Jimp.read(`${tempUpload}`)
        .then(image => {
            return image
                .resize(250, 250)
                .writeAsync(`${tempUpload}`); // save
        })
        .catch(err => {
            console.error(err);
        });

    const newFileName = `${_id}_${filename}`;
    const resultUpload = path.join(avatarsDir, newFileName);
    console.log('resultUpload', resultUpload);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", newFileName);
    console.log('avatarURL', avatarURL);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
        avatarURL
    })
}

module.exports = {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    reSendEmail: ctrlWrapper(reSendEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}