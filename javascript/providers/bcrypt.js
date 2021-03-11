import  bcrypt from 'bcryptjs';

// with bcrypt , cryppt and verify password user 

export function cryptPassword(password, salt) {
    return bcrypt.hashSync(password, salt);
}

export function verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}