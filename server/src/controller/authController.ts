import { CookieOptions, Request, Response } from "express";
import bcrypt from 'bcrypt';
import User from "../model/Users.model";
import { generateToken } from "../config/jwtConfig";

const cookieOptions: CookieOptions = {
    httpOnly: true, 
    maxAge: 30000000,
}

/**
 * It creates a new user in the system.
 * @param req {Request} - contains data of the request to the server.
 * @param res {Res} - contains data of the response back to the client.
 * @returns { Promise<Response> } - returns an asynchronous response in form of JSON data.
 */

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        
        // get the username, email, and password from the body of the Request object.
        const { name, email, password } = req.body;

        // check if all of the data exists or else return an error.
        if(!name || !email|| !password) {
            return res.status(400).json({success: false, message: "Incomplete data"})
        }

        // search if the email provided already exists in the database.
        const emailExists = await User.findOne({ email });

        // check if the email taken by and return an error to the client. 
        if(emailExists) {
            return res.status(400).json({ success: false, message: "Email exists." })
        }

        // genarate a hashed password.
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a record of the new user in the database.
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
       
        // generate a token using the userId and return it to the user as a cookie. 
        const token = generateToken({ userId: newUser._id.toString() });

        res.cookie('authtoken', token, cookieOptions);
        
        return res.status(200).json({ success: true, message: token });

    }catch(error: any) {
        return res.status(400).json({
            success: false, 
            message: "Failed to create a new user"
        });
    }
}


/**
 * It receives credentials of a user and check if the user exists in the system.
 * @param req {Request} - contains data of the request to the server.
 * @param res {Res} - contains data of the response back to the client.
 * @returns { Promise<Response> } - returns an asynchronous response in form of JSON data.
 */

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {

        // get the username, email, and password from the body of the Request object.
        const { name, email, password } = req.body;

        // check if all of the data exists or else return an error.
        if(!name || !email|| !password) {
            return res.status(400).json({success: false, message: "Incomplete data"})
        }
		
        // search in the database for the name and email from the client. 
        const user = await User.findOne({ name, email });


        // if the user variable doesn't exist return an error to the client.
        if (!user) {
            return res.status(400).json({success: false, message: "user doesn't exist"});
        }

        // if the user exists compare the given password with one stored in the user document.
        const passwordExists = await bcrypt.compare(password, user.password);
        
        // if the password doesn't exist return an error.
        if (!passwordExists) {
            return res.status(400).json({success: false, message: "wrong password"});
        }

        // generate a token using the userId and return it to the user as a cookie.
        const token = generateToken({ userId: user._id.toString() });
        
        res.cookie('authtoken', token, cookieOptions);

        return res.status(200).json({success: true, message: token });
    }catch(error) {
        return res.status(400).json({
            success: false, 
            message: "Error in signing in User" 
        });
    }
}

/**
 * It Logs the user out of the system.
 * @param req {Request} - contains data of the request to the server.
 * @param res {Res} - contains data of the response back to the client.
 * @returns { Promise<Response> } - returns an asynchronous response in form of JSON data.
 */

export const logoutUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        // send a response to remove authentication token from the cookie storage of the client.
        res.clearCookie("authtoken");
        
        return res.status(200).json({success: true, message: "User Successfully Logged out" });  

    }catch(error) {
        return res.status(403).json({
            success: false, 
            message: "Failed to logout user." 
        });
    }
}