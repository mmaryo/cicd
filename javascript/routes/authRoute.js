import { login_an_user, reset_a_password_to_forgot_this, reset_a_password, forgot_a_password } from '../controllers/authController.js';
import { verify_token } from '../middlewares/jwtMiddleware.js';
import { verify_user_exist_by_params_id_user } from '../middlewares/userMiddleware.js';




export default function authRoute(server) {
    server.route('/login')
        .post(login_an_user);
    server.route('/forgot_password')
        .post(forgot_a_password);
    server.route('/reset_password')
        .post(reset_a_password_to_forgot_this);
    server.route('/users/:user_id/reset_password')
        .post(verify_token, verify_user_exist_by_params_id_user,
            reset_a_password);
}