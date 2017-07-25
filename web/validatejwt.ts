import { db } from '../server';

const checkUserInDb = async (id: number, username: string, scope: number) =>
    db.oneOrNone(
        'SELECT id, username, scope FROM users WHERE id = $1 AND username = $2 AND scope = $3',
        [id, username, scope]
    );

export const validatejwt = async (request, decodedToken, callback) => {
    const credentials = await checkUserInDb(decodedToken.id, decodedToken.username, decodedToken.scope);
    if (!credentials || decodedToken.id !== credentials.id || decodedToken.username !== credentials.username
        || decodedToken.scope !== credentials.scope) {
        return callback(null, false, credentials);
    }
    return callback(null, true, credentials);
};
