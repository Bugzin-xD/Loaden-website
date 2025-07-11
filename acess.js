// acess.js
document.addEventListener('DOMContentLoaded', async () => {
    const visitorCountDisplay = document.getElementById('visitor-count-display');
    const storedEmailKey = 'userEmailForLoaden';

    // *** AGORA VOCÊ CHAMA SUA PRÓPRIA VERCEL FUNCTION (O PROXY) ***
    const PROXY_URL = '/api/google-script'; 

    let userEmail = localStorage.getItem(storedEmailKey);

    async function logAccess(userKey) {
        try {
            // Requisição POST para o proxy
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'log_access', userKey: userKey })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro ao registrar acesso via proxy: ${response.status} - ${errorData.error}`);
            }
            console.log('Acesso registrado com sucesso via proxy.');
        } catch (error) {
            console.error('Erro ao registrar acesso:', error);
        }
    }

    async function getUniqueAccessCount() {
        try {
            // Requisição GET para o proxy
            const response = await fetch(`${PROXY_URL}?action=get_count`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro ao obter contagem de acessos via proxy: ${response.status} - ${errorData.error}`);
            }
            const data = await response.json();
            return data.count;
        } catch (error) {
            console.error('Erro ao obter contagem de acessos:', error);
            return 0;
        }
    }

    // --- O RESTO DO SEU CÓDIGO JavaScript PERMANECE O MESMO ---

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
