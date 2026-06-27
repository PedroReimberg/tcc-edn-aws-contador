const contadorElemento = document.getElementById('contador-numero');
const botaoInteresse = document.getElementById('btn-interesse');

// 1.contagem atual
async function buscarContador() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar dados da API');

        const data = await response.json();

        // atualiza o valor no html retornado pelo DynamoDB
        contadorElemento.innerText = data.hits;
    } catch (error) {
        console.error("Erro na busca do contador:", error);
        contadorElemento.innerText = "0";
    }
}

// 2. registro de interesse
async function registrarInteresse() {
    try {
        // desabilita o botão evitando cliques duplos
        botaoInteresse.disabled = true;
        botaoInteresse.innerText = "Registrando...";

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Erro ao computar clique');

        // busca o contador atualizado
        await buscarContador();

        // feedback visual
        botaoInteresse.innerText = "✓ Confirmado!";
        botaoInteresse.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
        botaoInteresse.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.4)";

    } catch (error) {
        console.error("Erro ao registrar:", error);
        alert("Não foi possível registrar no momento. Tente novamente.");

        botaoInteresse.disabled = false;
        botaoInteresse.innerText = "Tenho Interesse!";
    }
}

botaoInteresse.addEventListener('click', registrarInteresse);
window.addEventListener('DOMContentLoaded', buscarContador);