const BASE_URL = "https://api.getalby.com";

interface RequestOptions {
    scope: string;
    token: string;
}

async function fetchAlbyData(endpoint: string, { scope, token }: RequestOptions) {
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Scope": scope,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText}`);
    }

    return await response.json();
}

export async function getValue4Value(token: string) {
    return fetchAlbyData("/user/value4value", { scope: "account:read", token });
}

export async function getAccountBalance(token: string) {
    return fetchAlbyData("/balance", { scope: "balance:read", token });
}

export async function getAccountSummary(token: string) {
    return fetchAlbyData("/user/summary", { scope: "balance:read", token });
}

export async function getPersonalInformation(token: string) {
    return fetchAlbyData("/user/me", { scope: "account:read", token });
}