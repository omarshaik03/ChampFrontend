import { goto } from "$app/navigation";
import { get_user_data } from "../../lib/auth";
import { userStore } from "../../lib/stores/userStore";
import { runtimeConfig } from '$lib/runtime-config';

export async function load({ cookies, url }: any) {
    const token = cookies.get("access_token");
    const url_base = runtimeConfig.API_BASE_URL;

    let pageData: {
        user: {
            id: string;
            email: string;
            name: string;
            allowed_apps: string[];
            tokens_left: number;
            tokens_allocated: number;
        } | undefined;
        token: string,
        url_base: string,
    } = {
        user: undefined,
        token: token,
        url_base: url_base,
    };

    if (token && url_base) {
        pageData.user = await get_user_data(token, url_base);
    }

    return pageData
}