
export const jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export async function fetchJson<TResponse extends {}>(
    input: RequestInfo,
    init?: RequestInit
) {
    try {
        const response = await fetch(input, {
            ...init,
            headers: new Headers({
                ...jsonHeaders,
                ...(init === undefined ? undefined : init.headers)
            }),
        });
        const validResponse = await status(response);
        const responseJson = await json<TResponse>(validResponse);

        return responseJson;
    } catch (error) {
        throw error;
    }
}

async function status(response: Response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    throw new Error(response.statusText);
}

export function json<TData>(response: Response) {
    return response.json() as Promise<TData>;
}
