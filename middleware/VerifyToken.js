import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);
        
        const user = await Users.findByPk(decoded.userId);
        if (!user) return res.sendStatus(404);

        req.email = decoded.email;
        req.role = user.role;
        next();
    });
}
