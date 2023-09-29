import { Router } from "express";
import asyncHandler from 'express-async-handler'
import { knexInstance } from "../config/knexfile.js";

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  try {
    const users = await knexInstance('users')
    res.json(users)
  } catch (error) {
    throw new Error(error.message)
  }
}))

export default router