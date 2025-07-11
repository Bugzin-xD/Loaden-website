document.addEventListener('DOMContentLoaded', async () => {
    const visitorCountDisplay = document.getElementById('visitor-count-display');
    const storedEmailKey = 'userEmailForLoaden';

    const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwADcA3PkSH9P_3qhQlM0Ff9MsVw7xWSf2ql_8ePcR_iTI_NAlxrBFKE31S8uqHYi79ww/exec';

    let userEmail = localStorage.getItem(storedEmailKey);

    async function logAccess(userKey) {
        try {
            await fetch(APPS_SCRIPT_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
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
            localStorage.setItem(storedEmail
