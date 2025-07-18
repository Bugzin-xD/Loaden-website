document.addEventListener('DOMContentLoaded', async () => {
    const targetEmail = "acess.key";
    const visitorCountDisplay = document.getElementById('visitor-count-display');
    const storedEmailKey = 'userEmailForLoaden';
    // Nova chave para armazenar a senha (opcional, dependendo de como você vai usar a senha)
    const storedPasswordKey = 'userPasswordForLoaden'; 

    let userEmail = localStorage.getItem(storedEmailKey);
    let userPassword = localStorage.getItem(storedPasswordKey); // Recupera a senha, se existir

    if (!userEmail) { // Se não tiver email armazenado, pede os dados de login
        const { value: formValues } = await Swal.fire({
            title: 'Loaden',
            html: `
                <input id="swal-input-email" class="swal2-input meu-input-personalizado" placeholder="Seu email">
                <input id="swal-input-password" type="password" class="swal2-input meu-input-personalizado" placeholder="Sua senha">
            `,
            focusConfirm: false, // Permite que o foco não vá automaticamente para o botão de confirmação
            preConfirm: () => {
                const email = document.getElementById('swal-input-email').value;
                const password = document.getElementById('swal-input-password').value;

                if (!email || !password) {
                    Swal.showValidationMessage('Por favor, preencha ambos os campos (email e senha)!');
                    return false; // Impede o fechamento do modal se algum campo estiver vazio
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    Swal.showValidationMessage('Por favor, digite um email válido!');
                    return false; // Impede o fechamento se o email for inválido
                }
                return { email: email.toLowerCase().trim(), password: password };
            },
            showCancelButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Entrar',
            customClass: {
                popup: 'meu-modal-personalizado',
                title: 'meu-titulo-personalizado',
                htmlContainer: 'meu-html-container-personalizado',
                confirmButton: 'meu-botao-confirmar'
            }
        });

        if (formValues) {
            userEmail = formValues.email;
            userPassword = formValues.password; // Armazena a senha obtida
            localStorage.setItem(storedEmailKey, userEmail);
            localStorage.setItem(storedPasswordKey, userPassword); // Armazena a senha no localStorage
        } else {
            // Se o usuário fechar o prompt ou algo der errado na validação,
            // definimos como "anonymous" e uma senha vazia.
            userEmail = "anonymous";
            userPassword = ""; // Senha vazia para "anonymous"
            localStorage.setItem(storedEmailKey, userEmail);
            localStorage.setItem(storedPasswordKey, userPassword);
        }
    } else {
        // Se já houver email, apenas garante que está padronizado
        userEmail = userEmail.toLowerCase().trim();
    }

    let uniqueVisitors = JSON.parse(localStorage.getItem('uniqueVisitors')) || [];

    if (!uniqueVisitors.includes(userEmail)) {
        uniqueVisitors.push(userEmail);
        localStorage.setItem('uniqueVisitors', JSON.stringify(uniqueVisitors));
    }

    async function handleLogout() {
        localStorage.removeItem(storedEmailKey);
        localStorage.removeItem(storedPasswordKey); // Remove a senha também ao deslogar
        
        await Swal.fire({
            title: 'Desconectado!',
            text: 'Sessão encerrada. Você será solicitado a fazer login novamente.',
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
