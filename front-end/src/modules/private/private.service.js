import request from '../../lib/api/api.js';
import { ENDPOINTS } from '../../lib/api/endpoints.js';

export async function userInformation() {

    const data = await request(ENDPOINTS.users.me, {
        method: "GET"
    }); 

    return data
}