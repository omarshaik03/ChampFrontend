export async function get_user_data (token: string | undefined, url_base: string) {
    if (!token || !url_base) {
        console.error("Missing token or URL base");
        return undefined;
    }

    try {
        const res = await fetch(`${url_base}/info`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            if (res.status === 401) {
                console.error("Unauthorized access");
                return undefined;
            }
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const response = await res.json();

        if (!response || !response.id || !response.username || !response.email) {
            console.error("Invalid user data received from server");
            return undefined;
        }

        return {
            id: response.id,
            name: response.username,
            email: response.email,
            allowed_apps: response.user_permissions ? [...response.user_permissions, "Profile", "Home"] : ["Profile", "Home"],
            tokens_left: response.tokens_used || 0,
            tokens_allocated: response.tokens_allocated || 0,
        };
        
    } catch (error) {
        console.error("Error fetching user data:", error);
        return undefined;
    }
}