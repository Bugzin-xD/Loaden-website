document.addEventListener('DOMContentLoaded', () => {
    const targetEmail = "divbugsgames@gmail.com";
    const visitorCountDisplay = document.getElementById('visitor-count-display');

    let userEmail = prompt("Por favor, digite seu e-mail para continuar:");
    if (!userEmail) {
        userEmail = "anonymous@example.com";
    }
    userEmail = userEmail.toLowerCase().trim();

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
