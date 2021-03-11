import knex from '../knex/knex.js';
import { generateError } from '../providers/route.js';
import { get_full_info_gs } from '../providers/gasStation.js'

export function verify_gas_sation_exist_by_params_id_gas_station(req, res, next) {

    if (req.params.gas_station_id) {
        knex('gas_station')
            .where('id', req.params.gas_station_id)
            .then((result) => {
                if (result.length > 0) {
                    if(result[0].status === 'KO'){
                        generateError(200, 'Gas station not available', res)

                    }
                    else 
                    {
                        get_full_info_gs(result[0]);
                    // next();
                    }
                    
                }
                else {
                    generateError(200, 'Gas station not found', res)
                }
            })
            .catch((err) => {
                // error sql 
                generateError(400, err.sqlMessage, res)
            });
    } else {
        generateError(400, 'Missing parameter gas_station_id', res)

    }

}