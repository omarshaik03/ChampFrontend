import "../../../chunks/client.js";
import "../../../chunks/utils2.js";
import { r as runtimeConfig } from "../../../chunks/runtime-config.js";
async function get_user_data(token, url_base) {
  if (!token || !url_base) {
    console.error("Missing token or URL base");
    return void 0;
  }
  try {
    const res = await fetch(`${url_base}/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) {
      if (res.status === 401) {
        console.error("Unauthorized access");
        return void 0;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const response = await res.json();
    if (!response || !response.id || !response.username || !response.email) {
      console.error("Invalid user data received from server");
      return void 0;
    }
    return {
      id: response.id,
      name: response.username,
      email: response.email,
      allowed_apps: response.user_permissions ? [...response.user_permissions, "Profile", "Home"] : ["Profile", "Home"],
      tokens_left: response.tokens_used || 0,
      tokens_allocated: response.tokens_allocated || 0
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return void 0;
  }
}
async function load({ cookies, url }) {
  const token = cookies.get("access_token");
  const url_base = runtimeConfig.API_BASE_URL;
  let pageData = {
    user: void 0,
    token,
    url_base
  };
  if (token && url_base) {
    pageData.user = await get_user_data(token, url_base);
  }
  return pageData;
}
export {
  load
};
