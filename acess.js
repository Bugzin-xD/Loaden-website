document.addEventListener('DOMContentLoaded', async () => {
    const visitorCountDisplay = document.getElementById('visitor-count-display');
    const storedEmailKey = 'userEmailForLoaden';

    const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwADcA3PkSH9P_3qhQlM0Ff9MsVw7xWSf2ql_8ePcR_iTI_NAlxrBFKE31S8uqHYi79ww/exec';
    const VERCEL_ORIGIN = 'https://loaden-website-eta.vercel.app'; // Defina sua origem Vercel

    let userEmail = localStorage.getItem(storedEmailKey);

    async function logAccess(userKey) {
        try {
            const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userKey: userKey }),
            });

            // Verifique se a requisição foi bem-sucedida pelo status HTTP
            if (!response.ok) {
                const errorBody = await response.text(); // Tenta ler o corpo da resposta de erro
                console.error(`Erro HTTP ao registrar acesso: ${response.status} - ${errorBody}`);
                throw new Error(`Falha ao registrar acesso: ${response.status} ${response.statusText}`);
            }
            console.log('Acesso registrado com sucesso.');
        } catch (error) {
            console.error('Erro ao registrar acesso:', error);
        }
    }

    async function getUniqueAccessCount() {
        try {
            const response = await fetch(APPS_SCRIPT_WEB_APP_URL + '?action=get_count');
            if (!response.ok) {
                // Tenta ler o corpo da resposta de erro para mais detalhes
                const errorBody = await response.text();
                console.error(`Erro HTTP ao obter contagem: ${response.status} - ${errorBody}`);
                throw new Error(`Erro ao obter contagem de acessos: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data.count;
        } catch (error) {
            console.error('Erro ao obter contagem de acessos:', error);
            return 0;
        }
    }

    if (!userEmail) {
        const { value: inputValue } = await Swal.fire({
            title: 'Loaden',
            html: 'Por favor, digite seu <b>nome de usuário</b>:',
            input: 'text',
            inputPlaceholder: 'Meu nome é...',
            showCancelButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Continuar',
            customClass: {
                popup: 'meu-modal-personalizado',
                title: 'meu-titulo-personalizado',
                htmlContainer: 'meu-html-container-personalizado',
                input: 'meu-input-personalizado',
                confirmButton: 'meu-botao-confirmar'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Você precisa digitar um nome!';
                }
            }
        });

        if (inputValue) {
            userEmail = inputValue.toLowerCase().trim();
            localStorage.setItem(storedEmailKey, userEmail);
        } else {
            userEmail = "anônimo";
            localStorage.setItem(storedEmailKey, userEmail);
        }
    } else {
        userEmail = userEmail.toLowerCase().trim();
    }

    const adminUserKey = "acess.key";
    visitorCountDisplay.style.display = 'block';
    visitorCountDisplay.style.cursor = 'pointer';
    visitorCountDisplay.removeEventListener('click', handleLogout);

    if (userEmail === adminUserKey) {
        visitorCountDisplay.textContent = `Olá, ${userEmail}! Contagem carregando...`;
    } else {
        const username = userEmail.split('@')[0];
        visitorCountDisplay.textContent = `Olá ${username}! Clique para sair.`;
    }
    visitorCountDisplay.addEventListener('click', handleLogout);

    await logAccess(userEmail);

    if (userEmail === adminUserKey) {
        const uniqueAccessCount = await getUniqueAccessCount();
        visitorCountDisplay.textContent = `Olá, o site obteve ${uniqueAccessCount} acessos únicos. Clique para sair.`;
    }

    async function handleLogout() {
        localStorage.removeItem(storedEmailKey);
        await Swal.fire({
            title: 'Desconectado!',
            text: 'Sessão encerrada. Você será solicitado a digitar seu nome novamente.',
            icon: 'info',
            confirmButtonText: 'Ok',
            customClass: {
                popup: 'meu-modal-personalizado',
                title: 'meu-titulo-personalizado',
                confirmButton: 'meu-botao-confirmar'
            }
        });
        window.location.reload();
    }
});
