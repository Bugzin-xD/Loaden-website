document.addEventListener('DOMContentLoaded', async () => {
    const targetEmail = "acess.key";
    const visitorCountDisplay = document.getElementById('visitor-count-display');
    const storedEmailKey = 'userEmailForLoaden';

    let userEmail = localStorage.getItem(storedEmailKey);

    if (!userEmail) {
        const { value: inputValue } = await Swal.fire({
            title: 'Loaden',
            html: 'Por favor, digite seu <b>nome de usuário</b> para fazer login:',
            input: 'text',
            inputPlaceholder: 'Seu nome de usuário',
            showCancelButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Entrar',
            customClass: {
                popup: 'meu-modal-personalizado',
                title: 'meu-titulo-personalizado',
                htmlContainer: 'meu-html-container-personalizado',
                input: 'meu-input-personalizado',
                confirmButton: 'meu-botao-confirmar'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Você precisa digitar algo!';
                }
            }
        });

        if (inputValue) {
            userEmail = inputValue.toLowerCase().trim();
            localStorage.setItem(storedEmailKey, userEmail);
        } else {
            userEmail = "anonymous.key";
            localStorage.setItem(storedEmailKey, userEmail);
        }
    } else {
        userEmail = userEmail.toLowerCase().trim();
    }

    let uniqueVisitors = JSON.parse(localStorage.getItem('uniqueVisitors')) || [];

    if (!uniqueVisitors.includes(userEmail)) {
        uniqueVisitors.push(userEmail);
        localStorage.setItem('uniqueVisitors', JSON.stringify(uniqueVisitors));
    }

    async function handleLogout() {
        localStorage.removeItem(storedEmailKey);
        
        await Swal.fire({
            title: 'Desconectado!',
            text: 'Sessão redefinida. Você será solicitado a fazer login novamente.',
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

    if (userEmail === targetEmail) {
        const visitorsExcludingTarget = uniqueVisitors.filter(email => email !== targetEmail);
        const count = visitorsExcludingTarget.length;
        visitorCountDisplay.textContent = `Acessos: ${count}. Clique para sair.`;
        visitorCountDisplay.style.display = 'block';
        visitorCountDisplay.style.cursor = 'pointer';
        visitorCountDisplay.addEventListener('click', handleLogout);
    } else {
        const username = userEmail.split('@')[0];
        visitorCountDisplay.textContent = `Olá ${username}! Clique para sair.`;
        visitorCountDisplay.style.display = 'block';
        visitorCountDisplay.style.cursor = 'pointer';
        visitorCountDisplay.addEventListener('click', handleLogout);
    }
});
