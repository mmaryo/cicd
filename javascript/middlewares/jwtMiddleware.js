import jwt from 'jsonwebtoken';
import { generateError } from '../providers/route.js';

// if JWT_SECRET in.env is empty 
const JWT_SECRET = process.env.JWT_SECRET || '123456789';


export function verify_token(req, res, next) {
    // get token in request
    let token = req.headers['authorization'];
    // console.log(token)
    // check type token
    if (typeof token != 'undefined' || token) {
        // verify token with jsonwebtoken
        jwt.verify(token, JWT_SECRET, (error) => {
            if (error) {
                generateError(403, 'Unauthorized', res);
            }
            else if (req.params.user_id) {
                // check user_id in token equald user_id params
                const decode = jwt.decode(token);
                if (decode.user.id.toString() === req.params.user_id) {
                    next()
                }
                else {
                    generateError(403, 'Unauthorized', res);
                    
                }
            }
            else {
                // authorize to continue
                next();
            }
        });
    }
    else {
        generateError(401, 'Require authentication', res);
    }
}