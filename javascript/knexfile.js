const configKnex = {
    development: {
        client: 'mysql2',
        connection: {
            host: 'mariadb',
            user: 'root',
            password: 'toor',
            database: 'gas',
            charset: 'utf8'
        }
    }
}

export default configKnex;