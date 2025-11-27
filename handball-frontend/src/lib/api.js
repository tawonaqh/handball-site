const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetcher(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}
