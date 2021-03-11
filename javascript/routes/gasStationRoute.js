import { verify_token } from '../middlewares/jwtMiddleware.js';
import { verify_gas_sation_exist_by_params_id_gas_station } from '../middlewares/gasStationMiddleware.js';
import { get_a_gas_station } from '../controllers/gasStationContoller.js';




export default function gasStationRoute(server) {
    server.route('/gas_station/:gas_station_id')
        .get(verify_token, 
            verify_gas_sation_exist_by_params_id_gas_station,
            get_a_gas_station
            );
}