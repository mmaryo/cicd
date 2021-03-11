import { generateError, generateSuccess } from '../providers/route.js';
import jwt from 'jsonwebtoken';
import { verifyPassword, cryptPassword } from '../providers/bcrypt.js';
import knex from '../knex/knex.js';
import { validateEmail } from '../providers/validators.js';
import { sendEmailToForgotPassword } from '../providers/email.js';


export function login_an_user(req, res) {


    // if JWT_SECRET in.env is empty 
    const JWT_SECRET = process.env.JWT_SECRET || '123456789';


    const body = req.body;
    if (body.password && body.email) {
        // check validate email
        if (validateEmail(body.email)) {
            knex('user')
                .where('email', body.email)
                .then((result) => {
                    // check user found
                    if (result.length > 0) {
                        const user = result[0];
                        // check password is not lost 
                        if (!user.forgot_password) {
                            // check password
                            if (verifyPassword(body.password, user.password)) {
                                // create token 
                                jwt.sign({ user }, JWT_SECRET, { expiresIn: '30 days' }, (error, token) => {
                                    if (error) {
                                        generateError(500, 'Server error', res);

                                    }
                                    else {
                                        generateSuccess(200, { token }, res)
                                    }
                                })
                            }
                            else {
                                generateError(400, 'Password is wrong', res);

                            }
                        }
                        else {
                            generateError(400, 'The password is lost and has been reset.', res)
                        }

                    }
                    else {
                        generateError(400, 'User not found', res);
                    }

                })
                .catch((err) => {
                    // error sql 
                    generateError(400, err.sqlMessage, res)

                })


        }
        else {
            generateError(400, 'Email format is not valid', res)
        }
    }
    else {
        generateError(400, 'Missing parameter(s)', res)
    }

}

export function forgot_a_password(req, res) {
    const body = req.body;
    //  check paramters
    if (body.email && body.nickname) {
        knex('user')
            .where({ email: body.email, nickname: body.nickname })
            .then((result) => {
                // chech user exists
                if (result.length > 0) {
                    const user = result[0];
                    const password = Math.random().toString(36).slice(-8);
                    // update password
                    knex('user')
                        .where({ email: body.email, nickname: body.nickname })
                        .update({
                            forgot_password: 1,
                            password: cryptPassword(password, 10)
                        })
                        .then(() => {
                            sendEmailToForgotPassword(user.email, password, res);
                        })
                        .catch((err) => {
                            // error sql 
                            generateError(400, err.sqlMessage, res)
                        })

                }
                else {
                    generateError(400, 'User not found', res)
                }
            })
            .catch((err) => {
                // error sql 
                generateError(400, err.sqlMessage, res)
            })
    }
    else {
        generateError(400, 'Missing parameter(s)', res)
    }
}

export function reset_a_password_to_forgot_this(req, res) {
    const body = req.body;

    //  check paramters
    if (body.email && body.nickname && body.new_password && body.tempory_password) {
        if (body.new_password.length > 5) {
            knex('user')
                .where({ email: body.email, nickname: body.nickname, })
                .then((result) => {
                    // chech user exists
                    if (result.length > 0) {
                        const user = result[0];
                        // ceck forgot passwors request 
                        if (user.forgot_password) {
                            //  check tempory password validate
                            if (verifyPassword(body.tempory_password, user.password)) {

                                knex('user')
                                    .where({ id: user.id })
                                    .update({
                                        forgot_password: 0,
                                        password: cryptPassword(body.new_password, 10)
                                    })
                                    .then(() => {
                                        generateSuccess(200, { message: 'Password updated successfully' }, res)

                                    })
                                    .catch((err) => {
                                        // error sql 
                                        generateError(400, err.sqlMessage, res)
                                    })
                            }
                            else {
                                generateError(400, 'Tempory password is wrong', res)
                            }
                        }
                        else {
                            generateError(403, 'A forgotten password request was not submitted.', res)

                        }

                    }
                    else {
                        generateError(400, 'User not found', res)
                    }
                })
                .catch((err) => {
                    // error sql 
                    generateError(400, err.sqlMessage, res)
                })
        } else {
            generateError(400, 'The new password is too short', res)
        }

    }
    else {
        generateError(400, 'Missing parameter(s)', res)
    }
}

export function reset_a_password(req, res) {
    const body = req.body;
    const user = res.locals.user;
    //  check paramters
    if (body.old_password && body.new_password) {
        if (body.new_password.length > 5) {
            if (verifyPassword(body.old_password, user.password)) {
                knex('user')
                    .where({ id: req.params.user_id })
                    .update({ password: cryptPassword(body.new_password, 10) })
                    .then(() => {
                        generateSuccess(200, { message: 'Password updated successfully' }, res)

                    })
                    .catch((err) => {
                        // error sql 
                        generateError(400, err.sqlMessage, res)
                    })
            }
            else {
                generateError(400, 'The old password is wrong', res)
            }
        }
        else {
            generateError(400, 'The new password is too short', res)

        }
    }
    else {
        generateError(400, 'Missing parameter(s)', res)
    }
}


