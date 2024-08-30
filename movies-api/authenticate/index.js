import jwt from 'jsonwebtoken';
import User from '../api/users/userModel';

const authenticate = async (request, response, next) => {
    try { 
        const authHeader = request.headers.authorization;
        if (!authHeader) throw new Error('No authorization header');

        const token = authHeader.split(" ")[1];
        if (!token) throw new Error('Bearer token not found');

        const decoded = await jwt.verify(token, process.env.SECRET); 
        console.log(decoded);

        // Assuming decoded contains a username field
        const user = await User.findByUserName(decoded.username); 
        if (!user) {
            throw new Error('User not found');
        }
        request.user = user; // Optionally attach the user to the request for further use
        next();
    } catch(err) {
        next(new Error(`Verification Failed: ${err.message}`));
    }
};

export default authenticate;