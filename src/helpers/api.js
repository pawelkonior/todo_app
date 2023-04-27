export async function getDataAPI(endpoint) {
    const response = await fetch(`http://localhost:3000/${endpoint}`);
    return response.json()
}


export async function sendDataAPI(data, endpoint) {
    const response = await fetch(
        `http://localhost:3000/${endpoint}`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        }
    )

    return response.json()
}

export async function updateDataAPI(data, endpoint, id, method) {
    const response = await fetch(
        `http://localhost:3000/${endpoint}/${id}`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method,
            body: JSON.stringify(data)
        }
    )

    return response.json()
}


export async function deleteDataAPI(id, endpoint) {
    const response = await fetch(`http://localhost:3000/${endpoint}/${id}`, {method: 'DELETE'})
    return response.json();
}