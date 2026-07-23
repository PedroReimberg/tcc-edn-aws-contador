# ☁️ NexusCloud — Contador de Acessos Serverless para Campanhas de Marketing TCC Escola da Nuvem (Grupo 6)

[![Cloud Computing](https://img.shields.io/badge/☁️%20Cloud%20Computing-%232EA44F.svg?style=for-the-badge&logoColor=white)](https://aws.amazon.com/) [![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/pt/) [![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://www.python.org/) [![CloudFormation](https://img.shields.io/badge/CloudFormation-FF4F8B?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/cloudformation/)
[![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML) [![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS) [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)

> 🚀 **Projeto em Andamento:** Infraestrutura Serverless automatizada via AWS CloudFormation, integrada a front-end estático no Amazon S3 com entrega global via Amazon CloudFront, protegida por princípios de menor privilégio (IAM) e otimizada com práticas avançadas de FinOps e observabilidade.
> Projeto de Conclusão de Curso (TCC) desenvolvido para o programa **Escola da Nuvem**. Este projeto implementa uma solução escalável, de baixo custo e totalmente Serverless na AWS para contabilizar interesses de usuários em uma página de pré-lançamento de um produto.

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

A solução foi modularizada em uma arquitetura de camadas independentes. Parte dos recursos é provisionada diretamente via **AWS CloudFormation (IaC)**, enquanto camadas complementares de segurança e governança gerenciam o ecossistema por fora:

```text
🌐 [Usuário / Browser] 
       │
       ▼ (Acesso HTTPS otimizado via Amazon CloudFront)
  ┌──────────────┐
  │ Distribuição │ ► Amazon CloudFront (CDN global e cache estático)
  └──────┬───────┘
         │
         ▼ (Entrega do Front-end estático)
  ┌──────────────┐
  │ Hospedagem   │ ► Amazon S3 (Bucket de armazenamento da Landing Page)
  └──────┬───────┘
         │
         ▼ (Requisições HTTP)
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

## 🛠️ Tecnologias e Serviços Utilizados

### 🧱 1. Serviços por Dentro da Infraestrutura (Provisionados via IaC / CloudFormation)
* **Hospedagem Front-end:** Amazon S3 (Web Hosting estático).
* **Distribuição e Performance:** Amazon CloudFront (CDN para entrega segura via HTTPS e otimização de transferência de dados com aproveitamento do Free Tier de 1 TB/mês).
* **Camada de Gateway:** Amazon API Gateway HTTP API (Gerenciamento de rotas).
* **Computação:** AWS Lambda (Funções orientadas a eventos em Python).
* **Banco de Dados:** Amazon DynamoDB (Persistência NoSQL com atualização atômica e chave primária fixa `hits`).

### 🛡️ 2. Serviços e Controles Aplicados por Fora (Governança, Segurança e FinOps)
* **Proteção de API (Throttling):** Configuração de limites de requisições no API Gateway (*Rate limit* e *Burst limit*) atuando como trava de segurança financeira contra tráfego malicioso ou bots.
* **Segurança de Identidade (AWS IAM):** Implementação do princípio do menor privilégio, garantindo que a função Lambda possua apenas as permissões estritamente necessárias (`GetItem` e `UpdateItem`).
* **Observabilidade (AWS CloudWatch Logs):** Monitoramento e rastreio de execuções, rotas e erros dentro da cota gratuita de 5 GB/mês.
* **Governança de Custos (AWS Budgets):** Alerta preventivo de faturamento configurado para controle rigoroso de gastos.
* **Kit Open Source (GitHub & Documentação):** Estrutura voltada à replicação transparente exigida por padrões de mercado e acadêmicos.

---

## 🔄 Fluxo Lógico e Funcionalidades do Sistema

1. **Leitura (GET):** Ao carregar a página, o front-end executa uma requisição assíncrona (`script.js`) para o API Gateway, que aciona o Lambda para buscar o valor atual na tabela do DynamoDB (`id = hits`).
2. **Interação com Estado (POST - Toggle):** O botão único alterna dinamicamente entre as ações de `increment` (adicionar interesse) e `decrement` (remover interesse), bloqueando-se temporariamente (*"Registrando..."* / *"Removendo..."*) para evitar cliques duplos.
3. **Escrita Atômica:** O Lambda executa operações atômicas no DynamoDB (`ADD` / `REMOVE`), evitando *race conditions* sob alta concorrência.
4. **Tratamento de Preflight (OPTIONS):** Suporte nativo a CORS configurado diretamente no API Gateway para comunicação segura com a aplicação, contendo os cabeçalhos obrigatórios (`Access-Control-Allow-Origin`, `Methods` e `Headers`).

---

## 💰 Viabilidade e FinOps

A arquitetura foi desenhada para rodar integralmente dentro do **AWS Free Tier** em cenários normais de teste. Simulações na Calculadora Oficial da AWS demonstram que mesmo sob um pico agressivo de **1 milhão de acessos mensais**, o custo estimado da solução permanece extremamente baixo (entre US$ 2,00 e US$ 6,00 mensais), evidenciando alta eficiência financeira na nuvem. 

A inclusão do CloudFront maximiza o uso do Tier Gratuito (cobrindo até 1 TB de transferência de dados), e os alertas via AWS Budgets garantem proteção total contra surpresas de faturamento.

---

## 🚀 Como Implantar o Projeto (Deployment Guide)

Qualquer pessoa pode subir essa infraestrutura do zero em poucos minutos utilizando o arquivo `template.yaml`.

### Pré-requisitos
* Uma conta ativa na AWS.
* Um usuário com permissões para executar stacks no CloudFormation.

Para reproduzir esta infraestrutura utilizando o AWS CloudFormation:

1. Acesse o **Console da AWS** e selecione a região desejada.
2. Navegue até o serviço **CloudFormation** e clique em **Criar pilha (Create stack)** com novos recursos (*standard*).
3. Faça o upload ou aponte para o template **YAML** fornecido no repositório.
4. Na etapa de configuração, confirme a caixa de permissões personalizadas do IAM (*"I acknowledge that AWS CloudFormation might create IAM resources with custom names"*).
5. Aguarde o provisionamento completo da stack e acesse a aba **Outputs**:
   * Copie o link gerado e cole no arquivo `script.js` do front-end.
   * Envie os arquivos estáticos do front-end para o bucket S3 correspondente.
   * Valide a distribuição via Amazon CloudFront e acesse o site em produção.

---

## 👥 Equipe / Autoria
* **Grupo 6** — Turma Escola da Nuvem (2026).
* **Integrantes:**
  * Daniel — [GitHub](https://github.com/) | [LinkedIn](https://www.linkedin.com/in/danieldevopsec/)
  * Pedro — [GitHub](https://github.com/PedroReimberg) | [LinkedIn](https://www.linkedin.com/in/pedroreimberg/)   
  * Nicolas — [GitHub](https://github.com/THENICKBOY100) | [LinkedIn](www.linkedin.com/in/nicolas-e-menezes/)  
  * Maria Eduarda — [GitHub](https://github.com/eduarda-ferr) | [LinkedIn](https://www.linkedin.com/in/eduardafb/)
  * Samuel — [GitHub](https://github.com/) | [LinkedIn](https://www.linkedin.com/)
