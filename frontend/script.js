const contadorElemento = document.getElementById('contador-numero');
const botaoInteresse = document.getElementById('btn-interesse');

// Alterar pelo valor de saida da Key "1ApiGatewayURL" do Outputs do CloudFormation
const API_URL = 'API_URL';

// Variável para controlar o estado (false = sem interesse, true = com interesse)
let interesseConfirmado = false;

// 1. Contagem atual
async function buscarContador() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar dados da API');

        const data = await response.json();

        // Atualiza o valor no HTML retornado pelo DynamoDB
        contadorElemento.innerText = data.hits;
    } catch (error) {
        console.error("Erro na busca do contador:", error);
        contadorElemento.innerText = "0";
    }
}

// 2. Função unificada de alternância (Adicionar / Remover)
async function alternarInteresse() {
    try {
        // Desabilita o botão evitando cliques duplos durante a requisição
        botaoInteresse.disabled = true;

        if (!interesseConfirmado) {
            // --- AÇÃO DE REGISTRAR ---
            botaoInteresse.innerText = "Registrando...";

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'increment' })
            });

            if (!response.ok) throw new Error('Erro ao computar clique');

            await buscarContador();

            // Atualiza para o estado de "Remover Interesse"
            interesseConfirmado = true;
            botaoInteresse.innerText = "Remover Interesse";
            botaoInteresse.classList.remove('btn-primary');
            botaoInteresse.classList.add('btn-secondary');

        } else {
            // --- AÇÃO DE REMOVER ---
            botaoInteresse.innerText = "Removendo...";

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'decrement' })
            });

            if (!response.ok) throw new Error('Erro ao computar remoção de interesse');

            await buscarContador();

            // Retorna para o estado original de "Tenho Interesse!"
            interesseConfirmado = false;
            botaoInteresse.innerText = "Tenho Interesse!";
            botaoInteresse.classList.remove('btn-secondary');
            botaoInteresse.classList.add('btn-primary');
        }

    } catch (error) {
        console.error("Erro na operação:", error);
        alert("Não foi possível processar sua solicitação no momento. Tente novamente.");

        // Restaura o texto e as classes corretas de acordo com o estado atual em caso de erro
        if (interesseConfirmado) {
            botaoInteresse.innerText = "Remover Interesse";
            botaoInteresse.classList.remove('btn-primary');
            botaoInteresse.classList.add('btn-secondary');
        } else {
            botaoInteresse.innerText = "Tenho Interesse!";
            botaoInteresse.classList.remove('btn-secondary');
            botaoInteresse.classList.add('btn-primary');
        }
    } finally {
        // Reabilita o botão independentemente de sucesso ou erro
        botaoInteresse.disabled = false;
    }
}

// Eventos
botaoInteresse.addEventListener('click', alternarInteresse);
window.addEventListener('DOMContentLoaded', buscarContador);
