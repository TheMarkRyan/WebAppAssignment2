import jwt from 'jsonwebtoken';
import User from '../api/users/userModel.js';  // Ensure the path and file extension are correct

const authenticate = async (req, res, next) => {
    try { 
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization header' });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Bearer token not found' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        console.log('Decoded JWT:', decoded);

        
        const user = await User.findByUserName(decoded.username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user; // Optionally attach the user to the request for further use
        next();
    } catch(err) {
        console.error('Authentication Error:', err.message);
        res.status(401).json({ message: `Verification Failed: ${err.message}` });
    }
};

export default authenticate;
