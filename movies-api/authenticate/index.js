import jwt from 'jsonwebtoken';
import User from '../api/users/userModel.js';  // Ensure the path is correct

const authenticate = async (req, res, next) => {
    try { 
        const authHeader = req.headers.authorization;
        console.log('Authorization Header:', authHeader);  // Log the authorization header

        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization header' });
        }

        // Token might not always have the 'Bearer ' prefix, ensure flexibility
        const token = authHeader.split(" ")[1] || authHeader;

        console.log('Token after split:', token);  // Log the token after splitting

        if (!token) {
            return res.status(401).json({ message: 'Bearer token not found' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        console.log('Decoded JWT:', decoded);

        const user = await User.findByUserName(decoded.username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch(err) {
        console.error('Authentication Error:', err.message);
        res.status(401).json({ message: `Verification Failed: ${err.message}` });
    }
};

export default authenticate;
