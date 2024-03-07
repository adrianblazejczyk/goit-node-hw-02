const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const jimp = require("jimp");
const { nanoid } = require("nanoid");

const { userSchema, userEmail } = require("../validators/userValidator");
const {
  addNewUser,
  findUserByEmail,
  updateToken,
  updateSub,
  findUserById,
  updateAvat,
  verificateEmail,
} = require("../services/userService");

const { sendVerificationEmail } = require("../services/emailSender");
const { generateUniqueFileName } = require("../services/avatarServices");

const { SECRET_KEY } = process.env;

const handleJoiError = (status, message, res) => {
  res.status(status).json({ message: message });
};
const signup = async (req, res, next) => {
  try {
    const generatedToken = nanoid();
    const { error } = userSchema.validate(req.body);
    if (error) return handleJoiError(400, error.message, res);
    const { password, email, subscription } = req.body;
    const isEmailTaken = await findUserByEmail(email);
    if (isEmailTaken) return handleJoiError(400, "Email in use", res);
    const avatarURL = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "identicon",
    });
    const fixedAvatarURL = `https:${avatarURL}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await addNewUser({
      ...req.body,
      password: hashedPassword,
      avatarURL: fixedAvatarURL,
      verificationToken: generatedToken,
    });

    await sendVerificationEmail(email, generatedToken);

    res.status(201).json({
      email: response.email,
      subscription: response.subscription,
      avatarURL: fixedAvatarURL,
    });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const { error } = userSchema.validate(req.body);
    if (error) return handleJoiError(400, error.message, res);
    const userData = await findUserByEmail(email);
    if (!userData)
      return handleJoiError(401, "Email or password is wrong", res);
    if (!userData.verify) return handleJoiError(403, "Unverified account", res);
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid)
      return handleJoiError(401, "Email or password is wrong", res);
    const payload = { id: userData._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "8h" });
    await updateToken(userData._id, token);

    res.status(201).json({
      token: token,
      user: {
        email: userData.email,
        subscription: userData.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    const dataUser = await findUserById(id);
    if (!dataUser) return handleJoiError("Not authorized", res);
    await updateToken(id, null);
    res.status(204).json({ message: "No Content" });
  } catch (error) {
    next(error);
  }
};
const getUserFromToken = async (req, res, next) => {
  try {
    const { id } = req.user;
    const dataUser = await findUserById(id);
    if (!dataUser) return handleJoiError("Not authorized", res);
    res
      .status(200)
      .json({ email: dataUser.email, subscription: dataUser.subscription });
  } catch (error) {
    next(error);
  }
};
const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { subscription } = req.body;

    const allowedSubscriptions = ["starter", "pro", "business"];
    if (!allowedSubscriptions.includes(subscription))
      return res.status(400).json({ message: "Invalid subscription value" });

    const updatedUser = await updateSub(id, { subscription: subscription });

    if (updatedUser)
      return res.json({
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      });

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    next(error);
  }
};
const updateAvatar = async (req, res, next) => {
  try {
    const userAvatarFileName = generateUniqueFileName(req.file.filename);
    const userAvatarPath = req.file.path;
    jimp
      .read(userAvatarPath)
      .then((avatar) => {
        return avatar.resize(250, 250).quality(80);
      })
      .then((avatar) => {
        const destinationPath = path.join(
          "public",
          "avatars",
          userAvatarFileName
        );
        return avatar.writeAsync(destinationPath);
      })
      .then(() => {
        const { id } = req.user;
        const avatarURLdata = { avatarURL: `/avatars/${userAvatarFileName}` };
        updateAvat(id, avatarURLdata);
        return res
          .status(200)
          .json({ message: "Avatar uploaded successfully", avatarURLdata });
      })
      .catch((error) => {
        console.error("Error:", error);
        return res.status(500).json({ error: "Error processing the avatar" });
      });
  } catch (error) {
    next(error);
  }
};
const verifyUserByToken = async (req, res, next) => {
  try {
    const verificationToken = req.params.verificationToken;
    const a = await verificateEmail(verificationToken);
    console.log(a);
    if (!a) return res.status(404).json({ message: "User not found" });
    return res
      .status(200)
      .json({ message: `message: 'Verification successful` });
  } catch (error) {
    next(error);
  }
};
const resendActivationLink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { error } = userEmail.validate(req.body);
    if (error)
      return handleJoiError(
        400,
        { message: "missing required field email" },
        res
      );
    const userData = await findUserByEmail(email);
    if (!userData)
      return res
        .status(400)
        .json({ message: "The user with the specified email was not found" });
    if (userData.verify)
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    await sendVerificationEmail(email, userData.verificationToken);
    return res.status(200).json({ message: `Verification email sent` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getUserFromToken,
  updateAvatar,
  updateSubscription,
  verifyUserByToken,
  resendActivationLink,
};
