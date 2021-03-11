import { generateError, generateSuccess } from '../providers/route.js';
import knex from '../knex/knex.js';


export function get_a_gas_station(req, res) {
    const gas_station = res.locals.gas_station;
    console.log(gas_station)

}




