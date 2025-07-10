document.addEventListener('DOMContentLoaded', () => {
    const targetEmail = "divbugsgames@gmail.com";
    const visitorCountDisplay = document.getElementById('visitor-count-display');
    const storedEmailKey = 'userEmailForLoaden';

    let userEmail = localStorage.getItem(storedEmailKey);

    if (!userEmail) {
        userEmail = prompt("Por favor, digite seu e-mail para continuar:");
        if (userEmail) {
            userEmail = userEmail.toLowerCase().trim();
            localStorage.setItem(storedEmailKey, userEmail);
        } else {
            userEmail = "anonymous@example.com";
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

    if (userEmail === targetEmail) {
        const visitorsExcludingTarget = uniqueVisitors.filter(email => email !== targetEmail);
        const count = visitorsExcludingTarget.length;
        visitorCountDisplay.textContent = `Visitantes (sem ${targetEmail}): ${count}`;
        visitorCountDisplay.style.display = 'block';
    } else {
        visitorCountDisplay.style.display = 'none';
    }
});
