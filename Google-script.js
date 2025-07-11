// api/google-script.js
// Esta é uma Vercel Serverless Function (Node.js)

export default async function (req, res) {
  // *** COLOQUE A URL DA SUA IMPLANTAÇÃO DO GOOGLE APPS SCRIPT AQUI ***
  const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwADcA3PkSH9P_3qhQlM0Ff9MsVw7xWSf2ql_8ePcR_iTI_NAlxrBFKE31S8uqHYi79ww/exec';

  try {
    let appsScriptResponse;

    if (req.method === 'GET') {
      // Para as requisições de contagem
      const queryString = new URLSearchParams(req.query).toString();
      appsScriptResponse = await fetch(`${APPS_SCRIPT_WEB_APP_URL}?${queryString}`);
      
    } else if (req.method === 'POST') {
      // Para as requisições de log de acesso (que agora faremos via POST para passar userKey no body)
      appsScriptResponse = await fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body), // O corpo da requisição do frontend
      });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const data = await appsScriptResponse.json();
    
    // Repassa a resposta do Apps Script para o frontend
    res.status(appsScriptResponse.status).json(data);

  } catch (error) {
    console.error('Erro na Vercel Function (proxy):', error);
    res.status(500).json({ error: 'Internal Server Error ao chamar Apps Script' });
  }
}
