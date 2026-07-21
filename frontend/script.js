const contadorElemento = document.getElementById('contador-numero');
const botaoInteresse = document.getElementById('btn-interesse');
const botaoDecrement = document.getElementById('btn-decrement');

const API_URL = 'API_URL';

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

        // Restaura o estado visual do botão de remoção, caso ele tenha sido clicado antes
        botaoDecrement.disabled = false;
        botaoDecrement.innerText = "Remover Interesse";
        botaoDecrement.style.backgroundColor = "";
        botaoDecrement.style.color = "";
        botaoDecrement.style.borderColor = "";

    } catch (error) {
        console.error("Erro ao registrar:", error);
        alert("Não foi possível registrar no momento. Tente novamente.");

        botaoInteresse.disabled = false;
        botaoInteresse.innerText = "Tenho Interesse!";
    }
}

// Remoção de interesse (Decremento)
async function removerInteresse() {
    try {
        botaoDecrement.disabled = true;
        botaoDecrement.innerText = "Removendo...";

        const response = await fetch(`${API_URL}/decrement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Erro ao computar remoção de interesse');

        await buscarContador();

        botaoDecrement.innerText = "✓ Removido!";
        botaoDecrement.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
        botaoDecrement.style.color = "#f87171";
        botaoDecrement.style.borderColor = "#dc2626";

        botaoInteresse.disabled = false;
        botaoInteresse.innerText = "Tenho Interesse!";
        botaoInteresse.style.background = "";
        botaoInteresse.style.boxShadow = "";

    } catch (error) {
        console.error("Erro ao remover:", error);
        alert("Não foi possível remover o interesse no momento. Tente novamente.");

        botaoDecrement.disabled = false;
        botaoDecrement.innerText = "Remover Interesse";
    }
}

botaoInteresse.addEventListener('click', registrarInteresse);

botaoDecrement.addEventListener('click', removerInteresse);
window.addEventListener('DOMContentLoaded', buscarContador);
