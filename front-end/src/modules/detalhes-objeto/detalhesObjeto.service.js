import request from '../../lib/api/api.js';
import { ENDPOINTS } from '../../lib/api/endpoints.js';

export async function objects(id) {

    const data = await request(ENDPOINTS.item.find(id), {
        method: "GET", 
    }); 

    return data
}