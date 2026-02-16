import Student from "../models/Student.js"; // import the student table



export async function createStudent(req, res) {          //Must be use async using await method
    try {
        if (req.user == null) {
            res.status(403).json({
                massage: "Unauthorized Access.You need to loging before creating students"
            })
            return
        }

        if (!req.user.isAdmin) {
            res.status(403).json({
                massage: "Only admins can create the students"
            })
            return
        }

        //read the request and passed to the variable   
        const newStudent = new Student(
            {
                name: req.body.name,
                age: req.body.age,
                city: req.body.city
            }
        )

        //Enter the data in database    
        await newStudent.save()
        res.json(
            {
                massage: "Student created successfully!"
            })

    } catch (Error) {
        console.log("Student create unsuccessful")
    }
}





export function getStudent(req, res) {
    Student.find().then(     //.then==if
        (result) => {
            res.json(result)
        }
    ).catch(
        () => {
            console.log("Error")       //.catch==else
        }
    )
}