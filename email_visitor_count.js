document.addEventListener('DOMContentLoaded', () => {
    const targetEmail = "divbugsgames@gmail.com";
    const visitorCountDisplay = document.getElementById('visitor-count-display');
    const storedEmailKey = 'userEmailForLoaden';

    let userEmail = localStorage.getItem(storedEmailKey); // Tenta obter o e-mail do localStorage

    if (!userEmail) { // Se não encontrou o e-mail no localStorage
        userEmail = prompt("Por favor, digite seu e-mail para continuar:");
        if (userEmail) {
            userEmail = userEmail.toLowerCase().trim();
            localStorage.setItem(storedEmailKey, userEmail); // Salva o e-mail no localStorage
        } else {
            userEmail = "anonymous@example.com";
            localStorage.setItem(storedEmailKey, userEmail); // Salva um e-mail padrão se nada for digitado
        }
    } else {
        userEmail = userEmail.toLowerCase().trim(); // Normaliza o e-mail que já estava no localStorage
    }

    let totalVisitors = parseInt(localStorage.getItem('totalVisitors')) || 0;
    let uniqueVisitors = JSON.parse(localStorage.getItem('uniqueVisitors')) || [];

    if (!uniqueVisitors.includes(userEmail)) {
        uniqueVisitors.push(userEmail);
        localStorage.setItem('uniqueVisitors', JSON.stringify(uniqueVisitors));
        totalVisitors = uniqueVisitors.length;
        localStorage.setItem('totalVisitors', totalVisitors);
    }

    if (userEmail === targetEmail) {
        const visitorsExcludingTarget = uniqueVisitors.filter(email => email !== targetEmail);
        const count = visitorsExcludingTarget.length;
        visitorCountDisplay.textContent = `Acessos: ${count}`;
        visitorCountDisplay.style.display = 'block';
    } else {
        visitorCountDisplay.style.display = 'none';
    }
});
