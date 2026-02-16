import mongoose from "mongoose"; //manage the database
const studentSchema= new mongoose.Schema(  //manage the table
    {
        name:String,
        age: Number,
        city: String

    }
)

const Student=mongoose.model("Student", studentSchema) // student table create and connect the JS file

export default Student ;                               //model=table

