const API_URL = 'http://localhost:8000/api'; // Laravel API

export async function fetcher(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}
