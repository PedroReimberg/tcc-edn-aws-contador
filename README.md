# ☁️ NexusCloud — TCC Escola da Nuvem (Grupo 6)

![Texto alternativo da imagem](URL_DA_IMAGEM_AQUI)

> 🚀 **Projeto Concluído e Validado:** Infraestrutura Serverless automatizada via AWS CloudFormation, integrada a front-end estático no Amazon S3, protegida por princípios de menor privilégio (IAM) e otimizada com práticas avançadas de FinOps, segurança e observabilidade.

---

## 📋 Sumário
- [Case e Problema de Negócio](#-case-1-contador-de-acessos-serverless-para-campanhas-de-marketing)
- [Arquitetura da Solução](#️-arquitetura-da-solução-e-escolhas-técnicas)
- [Fluxo Lógico e Funcionalidades](#-fluxo-lógico-e-funcionalidades-do-sistema)
- [Viabilidade e FinOps](#-viabilidade-e-finops)
- [Guia de Implantação (Deployment)](#-como-implantar-o-projeto-deployment-guide)
- [Equipe](#-equipe--autoria)

---

## 🎯 Case 1: Contador de Acessos Serverless para Campanhas de Marketing

Documentação técnica completa da solução de infraestrutura em nuvem desenvolvida para atender à demanda de alta escalabilidade e custo eficiente de uma startup de marketing.

### O Problema de Negócio
Uma startup de marketing está lançando uma campanha focada em um novo produto de base tecnológica. Para medir o interesse real do público, a empresa estruturou uma página de "Em Breve" (*Landing Page*) contendo um botão de engajamento interativo ("Tenho Interesse" / "Remover Interesse").

#### Os Desafios Principais:
1. **Volumetria Imprevisível:** O volume de acessos pode oscilar drasticamente em curtos períodos de tempo.
2. **Eficiência Financeira:** A infraestrutura não pode gerar custos elevados enquanto estiver ociosa.
3. **Resiliência e Concorrência:** A aplicação precisa suportar múltiplos cliques simultâneos sem perder contagens ou gerar falhas de concorrência.

### A Solução Proposta
Desenvolvimento de uma arquitetura **100% Serverless** na AWS, garantindo escalabilidade elástica automática, alta disponibilidade, controle de concorrência atômica no banco de dados e cobrança estritamente baseada no uso real.

---

## 🏗️ Arquitetura da Solução e Escolhas Técnicas

A solução foi modularizada em uma arquitetura de camadas independentes, provisionada de ponta a ponta via **AWS CloudFormation (IaC)**:

```text
🌐 [Usuário / Browser] 
       │
       ▼ (Acesso ao Front-end estático hospedado no Amazon S3)
  ┌──────────────┐
  │ Camada de    │ ► Amazon API Gateway (HTTP API v2 com rotas, CORS restrito e Throttling)
  │ Acesso       │
  └──────┬───────┘
         │
         ▼ (Requisições REST: GET / POST com ações de incremento e decremento)
  ┌──────────────┐
  │ Camada de    │ ► AWS Lambda (Python 3.x / Boto3 - lógica de roteamento)
  │ Processamento│
  └──────┬───────┘
         │
         ▼ (Operações atômicas seguras - ADD / REMOVE)
  ┌──────────────┐
  │ Camada de    │ ► Amazon DynamoDB (Tabela NoSQL com Partition Key fixa 'hits')
  │ Dados        │
  └──────────────┘
```

# 🛠️ Tecnologias e Serviços Utilizados
* **Hospedagem Front-end:** Amazon S3 (Web Hosting estático com políticas públicas de leitura configuradas).
* **Camada de Gateway:** Amazon API Gateway HTTP API (Gerenciamento de rotas e segurança via controle de *Throttling* / Rate limit e Burst limit).
* **Computação:** AWS Lambda (Funções orientadas a eventos em Python com tratamento de variáveis dinâmicas e *logging* no CloudWatch).
* **Banco de Dados:** Amazon DynamoDB (Persistência NoSQL com atualização atômica e chave primária fixa `hits`).
* **Infraestrutura como Código (IaC):** AWS CloudFormation (Template YAML automatizado contendo toda a stack de recursos).
* **Governança, Segurança e FinOps:**
  * **AWS IAM:** Princípio do menor privilégio em permissões restritas a `GetItem` e `UpdateItem`.
  * **AWS CloudWatch:** Logs e observabilidade de rotas e erros.
  * **AWS Budgets:** Alerta preventivo de custos configurado para controle de $1,00.

---

## 🔄 Fluxo Lógico e Funcionalidades do Sistema
1. **Leitura (GET):** Ao carregar a página, o front-end executa uma requisição assíncrona (`script.js`) para o API Gateway, que aciona o Lambda para buscar o valor atual na tabela do DynamoDB (`id = hits`).
2. **Interação com Estado (POST - Toggle):** O botão único alterna dinamicamente entre as ações de `increment` (adicionar interesse) e `decrement` (remover interesse), bloqueando-se temporariamente ("Registrando..." / "Removendo...") para evitar cliques duplos.
3. **Escrita Atômica:** O Lambda executa operações atômicas no DynamoDB (`ADD` / `REMOVE`), evitando *race conditions* sob alta concorrência.
4. **Tratamento de Preflight (OPTIONS):** Suporte nativo a CORS configurado diretamente no API Gateway para comunicação segura com o bucket S3, contendo os cabeçalhos obrigatórios (`Access-Control-Allow-Origin`, `Methods` e `Headers`).

---

## 💰 Viabilidade e FinOps
A arquitetura foi desenhada para rodar integralmente dentro do **AWS Free Tier** em cenários normais de teste. Simulações na Calculadora Oficial da AWS demonstram que mesmo sob um pico agressivo de **1 milhão de acessos mensais**, o custo estimado da solução permanece extremamente baixo (entre US$ 2,00 e US$ 6,00 mensais), evidenciando alta eficiência financeira na nuvem. Adicionalmente, políticas de governança e alertas via AWS Budgets garantem proteção total contra surpresas de faturamento.

---

## 🚀 Como Implantar o Projeto (Deployment Guide)
Para reproduzir esta infraestrutura utilizando o AWS CloudFormation:

1. Acesse o Console da AWS e selecione a região desejada.
2. Navegue até o serviço **CloudFormation** e clique em **Criar pilha (Create stack)** com novos recursos (*standard*).
3. Faça o upload ou aponte para o template **YAML** fornecido no repositório.
4. Na etapa de configuração, confirme a caixa de permissões personalizadas do IAM (*"I acknowledge that AWS CloudFormation might create IAM resources with custom names"*).
5. Aguarde o provisionamento completo da stack e acesse a aba **Outputs**:
   * Copie o link do campo `1APIGatewayURL` e cole no arquivo `script.js` do front-end.
   * Envie os arquivos estáticos do front-end para o bucket S3 listado no campo `2S3ConsoleURL`.
   * Acesse o site em produção através do link estático gerado em `3WebsiteURL`.

---

## 👥 Equipe / Autoria
* **Grupo 6** — Turma Escola da Nuvem (2026).
