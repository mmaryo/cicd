import knex from '../knex/knex.js';
import { generateError } from '../providers/route.js';

export function verify_user_exist_by_params_id_user(req, res, next) {

    if (req.params.user_id) {
        knex('user')
            .where('id', req.params.user_id)
            .then((result) => {
                if (result.length > 0) {
                    res.locals.user = result[0];
                    next();
                }
                else {
                    generateError(200, 'User not found', res)
                }
            })
            .catch((err) => {
                // error sql 
                generateError(400, err.sqlMessage, res)
            });
    } else {
        generateError(400, 'Missing parameter user_id', res)

    }

}