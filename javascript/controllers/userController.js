import { generateError, generateSuccess } from '../providers/route.js';
import { cryptPassword } from '../providers/bcrypt.js';
import knex from '../knex/knex.js';
import { validateEmail } from '../providers/validators.js';




export function create_an_user(req, res) {
    let body = req.body;

    // check all body 
    if (body.password && body.nickname && body.email) {
        // check validate email
        if (validateEmail(body.email)) {
            // check length nickname
            if (body.nickname.length > 5) {
                // check length password
                if (body.password.length > 5) {
                    body.password = cryptPassword(body.password, 10);
                    knex('user')
                        .insert(body)
                        .then(async (result) => {
                            result = await knex('user').where({id: result[0]});
                            const {password, ...user} = result[0];
                            // user created
                            generateSuccess(201, user, res);
                        })
                        .catch((err) => {
                            // error sql 
                            generateError(400, err.sqlMessage, res)

                        })
                }
                else {
                    generateError(400, 'Password is too short', res)
                }
            }
            else {
                generateError(400, 'Nickname is too short', res)
            }
        }
        else {
            generateError(400, 'Email format is not valid', res)
        }
    }
    else {
        generateError(400, 'Missing parameter(s)', res)
    }

}

export function update_an_user(req, res) {
    const { password, ...user } = res.locals.user;
    const error = {
        status: 400,
        message: []
    };

    // delete property password if exists
    delete req.body['password'];
    const body = req.body;

    // check at least the presence of a parameter
    if (Object.keys(body).length > 0) {
        let i = 0;
        Object.keys(body).forEach(key => {
            i++;
            if (key === 'nickname') {
                // check length nickname if exists
                if (body.nickname.length < 6) {
                    error.message.push('Nickname is too short');
                }
            }
            if (key === 'email') {
                // check validate email if exists
                if (!validateEmail(body.email)) {
                    error.message.push('Email format is not valid');
                }
            }

            if (i === Object.keys(body).length) {
                if (error.message.length > 0) {
                    // detect error(s)
                    generateError(error.status, error.message.join(' and '), res)
                }
                else {

                    knex('user')
                        .where('id', req.params.user_id)
                        .update(body)
                        .then((result) => {
                            generateSuccess(200, { ...user, ...body }, res)
                        })
                        .catch((err) => {
                            // error sql 
                            generateError(400, err.sqlMessage, res)
                        })
                }
            }
        });
    }
    else {
        generateError(400, 'Missing parameter(s)', res)
    }
}

export function delete_an_user(req, res) {
    knex('user')
        .where('id', req.params.user_id)
        .del()
        .then(() => {
            generateSuccess(200, { message: 'User deleted successfully' }, res);

        })
        .catch((err) => {
            // error sql 
            generateError(400, err.sqlMessage, res)
        })

}

export function get_an_user(req, res) {
    const { password, ...user } = res.locals.user;
    generateSuccess(200, user, res)

}