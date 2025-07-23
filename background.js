// Envolva todo o seu código em uma função que aceita o ID do canvas como argumento
function initializeStarryBackground(canvasId) {
    var canvas = document.getElementById(canvasId);

    // Se o canvas não for encontrado, exibe um aviso e sai da função
    if (!canvas) {
        console.warn(`Canvas com ID "${canvasId}" não encontrado. O script de fundo não será inicializado para ele.`);
        return;
    }

    var ctx = canvas.getContext('2d');

    // Define as dimensões do canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var stars = [], // Array que contém as estrelas
        FPS = 85, // Quadros por segundo
        x = 110, // Número de estrelas
        mouse = {
            x: 0,
            y: 0
        }; // Localização do mouse

    // Função para redimensionar o canvas quando a janela é redimensionada
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Opcional: reposicionar estrelas ao redimensionar se elas saírem da tela
        for (var i = 0; i < stars.length; i++) {
            if (stars[i].x > canvas.width) stars[i].x = canvas.width;
            if (stars[i].y > canvas.height) stars[i].y = canvas.height;
        }
    }

    // Adiciona o listener de redimensionamento da janela
    window.addEventListener('resize', resizeCanvas);


    // Adiciona estrelas ao array
    for (var i = 0; i < x; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1 + 1,
            vx: Math.floor(Math.random() * 50) / FPS - 25 / FPS, // Ajuste para velocidade mais consistente
            vy: Math.floor(Math.random() * 50) / FPS - 5 / FPS // Ajuste para velocidade mais consistente
        });
    }

    // Desenha a cena
    function draw() {
        let max_distance = 170;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = "lighter";

        for (var i = 0, len = stars.length; i < len; i++) { // Use len para eficiência
            var s = stars[i];

            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.stroke();
        }

        ctx.beginPath();
        for (var i = 0, len = stars.length; i < len; i++) { // Use len para eficiência
            var starI = stars[i];
            ctx.moveTo(starI.x, starI.y);
            // Sua condição original era < max_distance*0, o que sempre é falso.
            // Se você quiser que as linhas se conectem ao mouse, mude 0 para 1.
            // Por enquanto, mantenho como estava para não alterar seu comportamento pretendido.
            if (distance(mouse, starI) < max_distance * 0) ctx.lineTo(mouse.x, mouse.y);
            
            for (var j = 0, len2 = stars.length; j < len2; j++) { // Use len2 para eficiência
                var starII = stars[j];
                if (distance(starI, starII) < max_distance) {
                    ctx.lineTo(starII.x, starII.y);
                }
            }
        }
        ctx.lineWidth = 0.03;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    function distance(point1, point2) {
        var xs = point2.x - point1.x;
        xs = xs * xs;

        var ys = point2.y - point1.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    }

    // Atualiza as localizações das estrelas
    function update() {
        for (var i = 0, len = stars.length; i < len; i++) { // Use len para eficiência
            var s = stars[i];

            s.x += s.vx; // Vx e Vy já ajustados pela FPS na inicialização
            s.y += s.vy;

            if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
            if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
        }
    }

    // Adiciona o listener de movimento do mouse para este canvas específico
    canvas.addEventListener('mousemove', function(e) {
        // Obtenha a posição relativa do mouse em relação ao canvas
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top; // Removi o -80, pois getBoundingClientRect já dá a posição correta. Se precisar de um offset, adicione-o aqui.
    });

    // Loop principal de atualização e desenho
    function tick() {
        draw();
        update();
        requestAnimationFrame(tick);
    }

    tick(); // Inicia o loop da animação para este canvas
}

// Chame a função para inicializar o background em cada canvas

// 1. Inicializa o canvas principal (quando o DOM estiver pronto)
document.addEventListener('DOMContentLoaded', function() {
    initializeStarryBackground('canvas'); 
});

// 2. Inicializa o canvas da overlay (garanta que o elemento da overlay existe antes de chamar)
// Usamos window.onload porque a overlay é adicionada via JS ou precisa ter certeza que todo o HTML foi renderizado
window.onload = function() {
    // Adiciona um pequeno atraso para garantir que a overlay e seu canvas estejam completamente prontos
    setTimeout(function() {
        initializeStarryBackground('overlay-canvas');
        
        // As linhas abaixo são para controlar a exibição da overlay, movidas do HTML para cá
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block'; // ou 'flex', 'grid', etc.
    }, 1000); // 1 segundo de atraso, ajuste conforme necessário
};
