import express from "express";
import { signup,login } from "../controllers/authController.js";

const authroutes = express.Router();

authroutes.post("/signup", signup);
authroutes.post("/login", login);

export default authroutes;