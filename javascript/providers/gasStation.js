import knex from '../knex/knex.js'

export async function get_full_info_gs(gas_station) {
    if (gas_station.status !== 'OK') {
        // GET CREATOR GAS STATION
        let creator_gas_station = await knex('creator_gas_station').where({ id_gas_station: gas_station.id });
        console.log('-----------',creator_gas_station)
        if (creator_gas_station.length > 0) {
            creator_gas_station = creator_gas_station[0];
            // GET LIST APPROVED
            let approved_gas_station = await knex('state_gas_station').where({ id_creator_gas_station: creator_gas_station.id });
            if (approved_gas_station.length > 0) {
                creator_gas_station.approved = approved_gas_station;
            }
        }
    }
    gas_station.price = await knex('price')
        .select('value', 'status', 'id_fuel', 'name', 'price.id')
        .where({ id_gas_station: gas_station.id })
        .whereNot('status', 'KO')
        .join('fuel', 'price.id_fuel', '=', 'fuel.id');

    gas_station.price.map(async (p) => {
        if (p.status === 'PENDING') {

            let result = await knex('state_price')
                            .join('creator_price', 'state_price.id_creator_price', '=' , 'creator_price.id')
                            .where('creator_price.id_price', '=', p.id)
                            .select('value', 'state_price.id_user','approved','state_price.id', {id_creator_price: 'creator_price.id', id_user_creator_price: 'creator_price.id_user'})

            p.creator_price = {
                id: result[0].id_creator_price,
                id_user : result[0].id_user_creator_price,
                value : result[0].value, 
                list_approved :result.map(({id, approved, id_user}) =>({id, approved, id_user}))
            }
        }
        return p;
        console.log(p)
    }
    )

    console.log(gas_station)
}