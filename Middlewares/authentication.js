import jwt from "jsonwebtoken";

export default function authenticateUser(req, res, next) {
    const header = req.header("Authorization")
    if (header != null) {
        const token = header.replace("Bearer ", "")
        jwt.verify(token, "dumindu",
            (error, decoded) => {
                if (decoded == null) {
                    res.json({
                        massage: "Invalid Token Please loging again"
                    })
                } else {
                    req.user = decoded
                    //console.log(req.user)
                    next()
                }
            }
        )
    } else {
        next()
    }
}



