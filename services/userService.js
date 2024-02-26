const User = require("./schemas/userSchema");
const mongoose = require("mongoose");

function validateObjectId(contactId) {
  if (!mongoose.isValidObjectId(contactId)) {
    throw new Error("Not Found. It is not a valid ID.");
  }
}
async function addNewUser(userData) {
  try {
    return await User.create(userData);
  } catch (error) {
    throw error;
  }
}
async function findUserByEmail(email) {
  try {
    return await User.findOne({ email: email });
  } catch (error) {
    throw error;
  }
}
async function findUserById(id) {
  try {
    return await User.findById(id);
  } catch (error) {
    throw error;
  }
}
async function updateToken(id, token) {
  try {
    return await User.findByIdAndUpdate(id, { token: token });
  } catch (error) {
    throw error;
  }
}

async function updateSub(contactId, updatedData) {
  try {
    return await User.findOneAndUpdate({ _id: contactId }, updatedData, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addNewUser,
  findUserByEmail,
  updateToken,
  updateSub,
  findUserById,
};
