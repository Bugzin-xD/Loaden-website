document.addEventListener('DOMContentLoaded', () => {
    document.title = "Loaden";
    const targetEmail = "acess.key";
    const visitorCountDisplay = document.getElementById('visitor-count-display');
    const storedEmailKey = 'userEmailForLoaden';

    let userEmail = localStorage.getItem(storedEmailKey);

    if (!userEmail) {
        userEmail = prompt("Por favor, digite seu nome de usuário para fazer login:");
        if (userEmail) {
            userEmail = userEmail.toLowerCase().trim();
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

    function handleLogout() {
        localStorage.removeItem(storedEmailKey);
        alert("Você foi desconectado!");
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
