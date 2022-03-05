/* eslint-disable no-undef */
const express = require("express");
const {
  save,
  update,
  deleteById,
  getById,
  search,
  count,
} = require("../services/product-service");
const validators = require("../models/request-models");
const { handleValidation } = require("../middlewares");
const { NotFound } = require("../common/errors");

const router = express.Router();

// const getHandler = async (req, res, next) => {
//     try {
//         console.log('user:', req.user);
//         const items = await getAll();
//         const result = {
//             data: items,
//             total: items.length,
//             success: true,
//         };
//         res.status(200).send(result);
//     } catch (error) {
//         return next(error, req, res);
//     }
// };

const getByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await getById(id);
    if (item) {
      return res.status(200).send(item);
    }
    throw new NotFound(`Product not found by the id: ${id}`);
  } catch (error) {
    return next(error, req, res);
  }
};

const postHandler = async (req, res, next) => {
  try {
    const { body } = req;
    const id = await save(body);
    return res.status(201).send(id);
  } catch (error) {
    return next(error, req, res);
  }
};

const searchHandler = async (req, res, next) => {
  try {
    if (!req.body.pageSize) {
      req.body.pageSize = 10;
    }
    if (!req.body.current) {
      req.body.current = 1;
    }
    const result = await search(req.body);
    const response = { success: true, ...result };
    return res.status(200).send(response);
    // const response = { success: false, errorMessage: 'Super duper error handling mechanism', ...result };
    // res.status(400).send(response);
  } catch (error) {
    return next(error, req, res);
  }
};

const countHandler = async (req, res, next) => {
  try {
    const result = await count(req.body);
    const response = { success: true, ...result };
    return res.status(200).send(response);
  } catch (error) {
    return next(error, req, res);
  }
};

const putHandler = async (req, res, next) => {
  try {
    const { body } = req;
    const id = await update(body);
    return res.status(200).send(id);
  } catch (error) {
    return next(error, req, res);
  }
};

const deleteHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteById(id);
    return res
      .status(200)
      .send({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return next(error, req, res);
  }
};

router.get("/:id", getByIdHandler);
router.post(
  "/",
  handleValidation(validators.productSchemaValidate),
  postHandler
);
router.put("/", handleValidation(validators.productSchemaValidate), putHandler);
router.post("/search", searchHandler);
router.post("/count", countHandler);
router.delete("/:id", deleteHandler);

module.exports = router;
