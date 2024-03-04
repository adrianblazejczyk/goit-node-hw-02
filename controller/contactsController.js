const express = require("express");

const {
  contactSchema,
  favoriteFieldSchema,
} = require("../validators/contactValidator");
const {
  addContact,
  getContactById,
  getContactsAll,
  removeContact,
  upDateContact,
} = require("../services/contactService");

const handleJoiError = (error, res) => {
  res.status(400).json({ message: error.message });
};
const handleNotFoundError = (res, contactId) => {
  res.status(404).json({ message: `Not found id: ${contactId}` });
};
const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const favorite = req.query.favorite || false;
    const data = await getContactsAll(req.user.id, page, limit, favorite);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
const getById = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const data = await getContactById(req.user.id, contactId);
    if (data) return res.json(data);
    handleNotFoundError(res, contactId);
  } catch (error) {
    next(error);
    a;
  }
};
const add = async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) return handleJoiError(error, res);
    const response = await addContact({ ...req.body, owner: req.user.id });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
const deleted = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const data = await removeContact(req.user.id, contactId);
    if (data) return res.json({ message: "Contact deleted" });
    handleNotFoundError(res, contactId);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const { error } = contactSchema.validate(req.body);
    if (error) {
      handleJoiError(error, res);
    } else {
      const updatedContact = await upDateContact(
        req.user.id,
        contactId,
        req.body
      );
      if (updatedContact) return res.json(updatedContact);
      handleNotFoundError(res, contactId);
    }
  } catch (error) {
    next(error);
  }
};
const updateFavorite = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const { favorite } = req.body;
    const { error } = favoriteFieldSchema.validate({ favorite });
    if (error) return handleJoiError(error, res);
    const updatedContact = await upDateContact(contactId, { favorite });
    if (updatedContact) return res.json(updatedContact);
    handleNotFoundError(res, contactId);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  add,
  deleted,
  update,
  updateFavorite,
};
