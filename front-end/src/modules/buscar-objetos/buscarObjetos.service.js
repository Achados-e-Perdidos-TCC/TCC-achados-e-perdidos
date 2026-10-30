import request from "../../lib/api/api.js";
import { ENDPOINTS } from "../../lib/api/endpoints.js";

export async function objects() {
  const data = await request(ENDPOINTS.item.search, {
    method: "GET",
  });

  return data.content;
}

export async function categories() {
  const data = await request(ENDPOINTS.category.findAll, {
    method: "GET",
  });

  return data;
}
