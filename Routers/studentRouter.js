import express from "express";
import { createStudent, getStudent } from "../Controllers/studentController.js";//normal import 
//import Student from "../models/Student.js"; //default import 

const studentRouter= express.Router();
studentRouter.get("/",getStudent)
studentRouter.post("/",createStudent)


export default studentRouter;