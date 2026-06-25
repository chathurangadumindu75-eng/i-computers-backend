import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export async function createUser(req, res) {
    try {

        const passwordHash = bcrypt.hashSync(req.body.password, 10)
        //console.log(passwordHash)
        const newUser = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: passwordHash
        });

        await newUser.save();

        res.json({
            message: "User created successfully"
        });

    } catch (error) {
        res.json({
            message: "Error creating user!"
        });
    }
}


export async function loginUser(req, res) {

    try {
        const user = await User.findOne({
            email: req.body.email
        })
        //console.log(user)

        if (user == null) {
            res.status(404).json({
                message: "User not found"
            })
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password)

            if (isPasswordCorrect) {

                const payload = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    isBlocked: user.isBlocked,
                    image: user.image
                }

                const token = jwt.sign(payload, process.env.jwtSecret, {
                    //expiresIn: "48h"
                })
                res.json({
                    message: "Logging Successfully",
                    token: token,
                    isAdmin: user.isAdmin
                })
            } else {
                res.status(401).json({
                    message: "invalid password"
                })
            }

        }


    } catch (error) {
        console.log(error);
        res.status(500).json(
            {
                message: "Error logging in"
            }
        )
    }

}

export async function userData(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        })
    } else {
        res.json(req.user)
        console.log(req.user)
    }
}

export async function updateUserData(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        })
    } else {
        try {
            await User.findOneAndUpdate(
                { email: req.user.email },
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    image: req.body.image
                }
            )
            const updatedUser = await User.findOne({ email: req.user.email })

            const token = jwt.sign({
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                isAdmin: updatedUser.isAdmin,
                isBlocked: updatedUser.isBlocked,
                isEmailVerified: updatedUser.isEmailVerified,
                image: updatedUser.image
            }, process.env.jwtSecret)

            res.status(200).json({
                message: "User data updated successfully",
                token: token
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Error updating user data"
            })
        }
    }
}

export async function changePassword(req,res){
    if(req.user==null){
        res.status(401).json({
            message:"Unauthorized"
        })
    }

    try{

        const hashedPassword = bcrypt.hashSync(req.body.newPassword,10)
        await User.findOneAndUpdate(
            {email: req.user.email},
            { password: hashedPassword }
        )
        res.status(200).json({
            message:"Password changed successfully"
        })
    }catch(error){
        res.status(500).json({
            message:"Error changing password"
        })
    }
}



export function isAdmin(req) {
    if (req.user == null) {
        return false
    }
    if (req.user.isAdmin) {
        return true
    } else {
        return false
    }
}