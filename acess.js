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
            inputPlaceholder: 'Meu nome é...',
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
                    return 'Você precisa digitar um nome!';
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

    if (!
