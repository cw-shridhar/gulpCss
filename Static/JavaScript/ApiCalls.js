const getApiData = async api => {
    return await fetch(api, {
        headers: { 'ServerDomain': 'CarWale' },
    })
    .then(response => response.json())
    .catch(err => []);
}

