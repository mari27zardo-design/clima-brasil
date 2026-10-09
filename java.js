// --- CONTROLE DE ABAS ---
function switchTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    if(tabId === 'video') {
        iniciarAnimacao();
    }
}

// --- VÍDEO EXPLICATIVO EM CANVAS ---
const canvas = document.getElementById('animacaoCanvas');
const ctx = canvas.getContext('2d');
let animFrame;
let progresso = 0;

function desenharCena(p) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo (Céu)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sol no canto superior esquerdo (enfraquecendo)
    ctx.beginPath();
    ctx.arc(80, 70, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Relevo (Serra do Sul)
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(150, 250);
    ctx.lineTo(300, 280);
    ctx.lineTo(500, 220);
    ctx.lineTo(700, 300);
    ctx.lineTo(700, 350);
    ctx.lineTo(0, 350);
    ctx.fillStyle = '#065f46';
    ctx.fill();

    // Massa Polar Atlântica (mPA) movendo-se da direita para a esquerda
    let posX = canvas.width - (p * 3.5);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.arc(posX, 120, 90, 0, Math.PI * 2);
    ctx.fill();

    // Textos explicativos dinâmicos
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Segoe UI';
    ctx.fillText("Brasil (Região Sul)", 250, 330);

    if (p < 50) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText("Fase 1: Ar tropical predomina, dias amenos.", 30, 30);
    } else if (p < 120) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillText("Fase 2: Avança a Massa Polar Atlântica (mPA) pelo Sul.", 30, 30);
    } else {
        ctx.fillStyle = '#93c5fd';
        ctx.fillText("Fase 3: Queda drástica de temperatura e Neve na serra! ❄️", 30, 30);
        
        // Neve caindo
        ctx.fillStyle = '#ffffff';
        for(let i=0; i<30; i++) {
            let rx = (i * 25 + p * 2) % canvas.width;
            let ry = (i * 15 + p * 3) % 250;
            ctx.fillRect(rx, ry, 4, 4);
        }
    }
}

function loopAnimacao() {
    progresso += 0.8;
    if(progresso > 220) progresso = 0;
    desenharCena(progresso);
    animFrame = requestAnimationFrame(loopAnimacao);
}

function iniciarAnimacao() {
    cancelAnimationFrame(animFrame);
    progresso = 0;
    loopAnimacao();
}

function reiniciarAnimacao() {
    progresso = 0;
}

// --- QUIZ INTERATIVO ---
const perguntasQuiz = [
    {
        pergunta: "Qual é o principal fator responsável pelas temperaturas baixas e geadas no inverno da Região Sul?",
        opcoes: [
            "A proximidade com a Linha do Equador",
            "A atuação da Massa Polar Atlântica (mPA)",
            "A forte presença de desertos vizinhos",
            "Correntes quentes do oceano pacífico"
        ],
        correta: 1
    },
    {
        pergunta: "Em relação ao regime de chuvas, qual característica define o clima do Sul?",
        opcoes: [
            "Secas severas de 9 meses por ano",
            "Chuvas concentradas unicamente no verão",
            "Chuva bem distribuída ao longo de todo o ano",
            "Ausência total de precipitações"
        ],
        correta: 2
    },
    {
        pergunta: "Qual árvore é símbolo marcante da paisagem e do clima subtropical serrano do Sul?",
        opcoes: ["Coqueiro", "Cacto", "Araucária (Pinheiro-do-paraná)", "Baobá"],
        correta: 2
    }
];

let perguntaAtual = 0;
let pontuacaoQuiz = 0;

function carregarQuiz() {
    const container = document.getElementById('quiz-container');
    if (perguntaAtual >= perguntasQuiz.length) {
        container.innerHTML = `
            <h3>Quiz Finalizado! 🎉</h3>
            <p>Você acertou ${pontuacaoQuiz} de ${perguntasQuiz.length} perguntas.</p>
            <button class="btn-action" onclick="reiniciarQuiz()">Tentar Novamente</button>
        `;
        return;
    }

    const q = perguntasQuiz[perguntaAtual];
    let html = `
        <div class="question">${perguntaAtual + 1}. ${q.pergunta}</div>
        <div class="options">
    `;

    q.opcoes.forEach((opcao, index) => {
        html += `<button class="option-btn" onclick="verificarResposta(${index}, ${q.correta}, this)">${opcao}</button>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function verificarResposta(selecionada, correta, botao) {
    const botoes = document.querySelectorAll('.option-btn');
    botoes.forEach(b => b.disabled = true);

    if (selecionada === correta) {
        botao.classList.add('correct');
        pontuacaoQuiz++;
    } else {
        botao.classList.add('incorrect');
        botoes[correta].classList.add('correct');
    }

    setTimeout(() => {
        perguntaAtual++;
        carregarQuiz();
    }, 1500);
}

function reiniciarQuiz() {
    perguntaAtual = 0;
    pontuacaoQuiz = 0;
    carregarQuiz();
}

carregarQuiz();

// --- MINIJOGO DE ASSOCIAÇÃO ---
const itensJogo = [
    { nome: "Casaco de Inverno 🧥", tipo: "sul" },
    { nome: "Chimarrão 🧉", tipo: "sul" },
    { nome: "Araucária 🌲", tipo: "sul" },
    { nome: "Geada na Serra ❄️", tipo: "sul" },
    { nome: "Cacto do Deserto 🌵", tipo: "outro" },
    { nome: "Roupa de Praia / Biquíni 🩱", tipo: "outro" }
];

let itemSelecionadoGlobal = null;
let pontuacaoJogo = 0;

function inicializarMinijogo() {
    const pool = document.getElementById('pool');
    pool.innerHTML = '';
    
    itensJogo.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'draggable-item';
        el.innerText = item.nome;
        el.onclick = () => selecionarItem(item, el);
        pool.appendChild(el);
    });
}

function selecionarItem(item, elementoDOM) {
    document.querySelectorAll('.draggable-item').forEach(el => el.style.border = '1px solid #cbd5e1');
    elementoDOM.style.border = '2px solid var(--accent)';
    itemSelecionadoGlobal = { item, elementoDOM };
}

function selecionarCaixa(caixaDestino) {
    if (!itemSelecionadoGlobal) return;

    const { item, elementoDOM } = itemSelecionadoGlobal;
    const zoneSul = document.getElementById('zone-sul');
    const zoneOutro = document.getElementById('zone-outro');

    if (item.tipo === caixaDestino) {
        pontuacaoJogo += 10;
        if (caixaDestino === 'sul') zoneSul.appendChild(elementoDOM);
        else zoneOutro.appendChild(elementoDOM);
        
        elementoDOM.style.border = '1px solid #17b978';
        elementoDOM.onclick = null; 
    } else {
        pontuacaoJogo = Math.max(0, pontuacaoJogo - 5);
        elementoDOM.style.border = '2px solid #ef4444';
    }

    document.getElementById('game-score').innerText = pontuacaoJogo;
    itemSelecionadoGlobal = null;
}

inicializarMinijogo();
