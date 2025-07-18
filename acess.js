document.addEventListener('DOMContentLoaded', async () => {
    const targetEmail = "acess.key";
    const visitorCountDisplay = document.getElementById('visitor-count-display');
    const storedEmailKey = 'userEmailForLoaden';
    const storedPasswordKey = 'userPasswordForLoaden'; 

    let userEmail = localStorage.getItem(storedEmailKey);
    let userPassword = localStorage.getItem(storedPasswordKey); 

    if (!userEmail) { 
        const { value: formValues } = await Swal.fire({
            title: 'Loaden',
            html: `
                <p>Por favor, digite seu <b>email e senha</b> para login:</p>
                <input id="swal-input-email" class="swal2-input meu-input-personalizado" placeholder="exemplo@gmail.com">
                <input id="swal-input-password" type="password" class="swal2-input meu-input-personalizado" placeholder="*****">
            `,
            focusConfirm: false, 
            preConfirm: () => {
                const email = document.getElementById('swal-input-email').value;
                const password = document.getElementById('swal-input-password').value;

                if (!email || !password) {
                    Swal.showValidationMessage('Por favor, preencha ambos os campos (email e senha)!');
                    return false; 
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    Swal.showValidationMessage('Por favor, digite um email válido!');
                    return false; 
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
            userPassword = formValues.password; 
            localStorage.setItem(storedEmailKey, userEmail);
            localStorage.setItem(storedPasswordKey, userPassword); 
        } else {
            userEmail = "anonymous";
            userPassword = ""; 
            localStorage.setItem(storedEmailKey, userEmail);
            localStorage.setItem(storedPasswordKey, userPassword);
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
        localStorage.removeItem(storedPasswordKey); 
        
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
