const Contact = require("./schemas/contactSchema");

const mongoose = require("mongoose");

function validateObjectId(contactId) {
  if (!mongoose.isValidObjectId(contactId)) {
    throw new Error("Not Found. It is not a valid ID.");
  }
}

async function getContactsAll(idUser, page, limit,favorite) {
  try {
    const skip = (page - 1) * limit;
    let query = { owner: idUser };
    if (favorite === 'true') {
      query.favorite = true;
    }
    return await Contact.find(query).skip(skip).limit(limit);
  } catch (error) {
    throw error;
  }
}
async function getContactById(idUser, contactId) {
  try {
    validateObjectId(contactId);
    return await Contact.findOne({ owner: idUser, _id: contactId });
  } catch (error) {
    throw error;
  }
}
async function removeContact(idUser, contactId) {
  try {
    validateObjectId(contactId);
    return await Contact.deleteOne({ owner: idUser, _id: contactId });
  } catch (error) {
    throw error;
  }
}
async function addContact(contactData) {
  try {
    return await Contact.create(contactData);
  } catch (error) {
    throw error;
  }
}
async function upDateContact(idUser, contactId, updatedData) {
  try {
    validateObjectId(contactId);
    return await Contact.findOneAndUpdate({ owner: idUser, _id: contactId }, updatedData, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
}



module.exports = {
  getContactsAll,
  getContactById,
  removeContact,
  addContact,
  upDateContact,
};
