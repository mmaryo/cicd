import { delete_an_user,  update_an_user, create_an_user, get_an_user } from '../controllers/userController.js';
import { verify_token } from '../middlewares/jwtMiddleware.js';
import { verify_user_exist_by_params_id_user } from '../middlewares/userMiddleware.js';


export default function userRoute(server) {
   
    server.route('/users')
        .post(create_an_user);
    server.route('/users/:user_id')
        .put(verify_token, verify_user_exist_by_params_id_user,
            update_an_user)
        .get(verify_token, verify_user_exist_by_params_id_user,
            get_an_user)
        .delete(verify_token, verify_user_exist_by_params_id_user,
            delete_an_user)

}