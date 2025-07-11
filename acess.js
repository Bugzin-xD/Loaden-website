document.addEventListener('DOMContentLoaded', async () => {
    const visitorCountDisplay = document.getElementById('visitor-count-display');
    const storedEmailKey = 'userEmailForLoaden';

    // URL do seu Google Apps Script implantado
    const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwADcA3PkSH9P_3qhQlM0Ff9MsVw7xWSf2ql_8ePcR_iTI_NAlxrBFKE31S8uqHYi79ww/exec'; 

    let userEmail = localStorage.getItem(storedEmailKey);

    // --- Funções para interagir com o Apps Script ---

    // Função para registrar o acesso na planilha de logs
    async function logAccess(userKey) {
        try {
            await fetch(APPS_SCRIPT_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para evitar erros CORS no frontend
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userKey: userKey }),
            });
            console.log('Acesso registrado com sucesso.');
        } catch (error) {
            console.error('Erro ao registrar acesso:', error);
        }
    }

    // Função para obter a contagem de acessos únicos da planilha de logs
    async function getUniqueAccessCount() {
        try {
            const response = await fetch(APPS_SCRIPT_WEB_APP_URL + '?action=get_count'); 
            if (!response.ok) {
                throw new Error(`Erro ao obter contagem de acessos: ${response.status}`);
            }
            const data = await response.json();
            return data.count;
        } catch (error) {
            console.error('Erro ao obter contagem de acessos:', error);
            return 0; 
        }
    }

    // --- Lógica de Pedir Nome de Usuário (SEM VALIDAÇÃO) ---

    if (!userEmail) {
        const { value: inputValue } = await Swal.fire({
            title: 'Loaden',
            html: 'Por favor, digite seu <b>nome de usuário</b>:', // Alterado para não sugerir "login"
            input: 'text',
            inputPlaceholder: 'Meu nome é...',
            showCancelButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Continuar', // Alterado o texto do botão
            customClass: {
                popup: 'meu-modal-personalizado',
                title: 'meu-titulo-personalizado',
                htmlContainer: 'meu-html-container-personalizado',
                input: 'meu-input-personalizado',
                confirmButton: 'meu-botao-confirmar'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Você precisa digitar um nome!'; // Apenas valida se não está vazio
                }
                // Nenhuma validação de "usuário autorizado" aqui
            }
        });

        if (inputValue) {
            userEmail = inputValue.toLowerCase().trim();
            localStorage.setItem(storedEmailKey, userEmail);
        } else {
            // Se o usuário fechar ou não digitar, pode ser um "anônimo"
            userEmail = "anônimo"; 
            localStorage.setItem(storedEmailKey, userEmail);
        }
    } else {
        userEmail = userEmail.toLowerCase().trim();
        // Não há necessidade de revalidar userEmail do localStorage contra uma lista autorizada
        // Ele será usado como está para log e exibição.
    }

    // --- Lógica de registro de acesso e exibição da contagem ---

    // REGISTRA O ACESSO AGORA SEMPRE QUE A PÁGINA CARREGA E TEM UM userEmail
    await logAccess(userEmail);

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

    visitorCountDisplay.removeEventListener('click', handleLogout);

    const adminUserKey = "acess.key"; // Seu usuário "admin" para ver a contagem

    const uniqueAccessCount = await getUniqueAccessCount(); // Obtém a contagem global

    if (userEmail === adminUserKey) {
        // Se for o usuário admin, mostra a contagem global
        visitorCountDisplay.textContent = `Olá, o site obteve ${uniqueAccessCount} acessos únicos. Clique para sair.`;
        visitorCountDisplay.style.display = 'block';
        visitorCountDisplay.style.cursor = 'pointer';
        visitorCountDisplay.addEventListener('click', handleLogout);
    } else {
        // Para qualquer outro usuário, apenas mostra o nome e a opção de sair
        const username = userEmail.split('@')[0]; // Pega a parte antes do '@' se for um email
        visitorCountDisplay.textContent = `Olá ${username}! Clique para sair.`;
        visitorCountDisplay.style.display = 'block';
        visitorCountDisplay.style.cursor = 'pointer';
        visitorCountDisplay.addEventListener('click', handleLogout);
    }
});
