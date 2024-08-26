import bcryptjs from "bcryptjs"; // Menggunakan bcryptjs untuk hashing
import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const getUsers = async(req, res) => {
    try {
        if(req.role !== 'admin') return res.sendStatus(403);

        const users = await Users.findAll({
            attributes:['id','name','email', 'role'] 
        });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}



export const Register = async(req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    
    const salt = await bcryptjs.genSalt();
    const hashpassword = await bcryptjs.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashpassword,
            role: role // Tambahkan role ke dalam data yang disimpan
        });
        res.json({msg: "Register Berhasil"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}


export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });

        if (user.length === 0) {
            return res.status(404).json({msg: "Email tidak ditemukan"});
        }

        const match = await bcryptjs.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({msg: "Server Error"});
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null}, {
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}