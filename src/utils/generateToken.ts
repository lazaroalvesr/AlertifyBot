const axios = require('axios');

async function generateTwitchToken() {
    const clientId = '';
    const clientSecret = '';

    try {
        const response = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials'
            }
        });

        console.log('Seu access token é:', response.data.access_token);
        console.log('Token expira em:', response.data.expires_in, 'segundos');
    } catch (error) {
        console.error('Erro ao gerar token:', error.response?.data || error.message);
    }
}

generateTwitchToken();