const environment = process.env.ENVIRONMENT || 'development';


import configKnex from '../knexfile.js';
const config = configKnex[environment];

import knex from 'knex';
export default knex(config);