
import request from "../../lib/api/api.js";
import { ENDPOINTS } from "../../lib/api/endpoints.js";

export async function recentObjects() {
    const params = new URLSearchParams({
        page: "0",
        size: "4",
        sort: "createdAt,desc",
    });

    const data = await request(
        `${ENDPOINTS.item.search}?${params.toString()}`,
        {
            method: "GET",
        }
    );

    return Array.isArray(data?.content) ? data.content : [];
}
