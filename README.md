# tcc-edn-aws-contador

> 🚧 **Projeto em Desenvolvimento:** Este repositório reflete o progresso contínuo. A arquitetura alvo está mapeada, e os componentes estão sendo implantados de forma incremental. Confira o nosso [Roadmap](#-estado-atual-do-projeto-roadmap) para ver o que já foi entregue e o que está por vir!

# TCC Escola da Nuvem — Grupo 6

## 🎯 Case 1: Contador de Acessos Serverless para Campanhas de Marketing

Replicação do ambiente de produção e documentação técnica da solução de infraestrutura em nuvem desenvolvida para atender à demanda de escalabilidade e custo eficiente de uma startup de marketing.

---

## 💻 O Problema de Negócio

Uma startup de marketing está lançando uma campanha focada em um novo produto de base tecnológica. Para medir o interesse real do público, a empresa estruturou uma página de "Em Breve" (*Landing Page*) contendo um botão de engajamento ("Tenho Interesse").

### Os Desafios Principais:
1. **Volumetria Imprevisível:** O volume de acessos é uma incógnita, podendo oscilar de 10 a 1 milhão de interações em curtos períodos de tempo.
2. **Eficiência Financeira:** A infraestrutura não pode gerar custos elevados enquanto estiver ociosa (em repouso).
3. **Resiliência:** A aplicação não pode travar ou perder contagens sob cenários de alta concorrência (múltiplos cliques simultâneos).

### A Solução Proposta:
Desenvolvimento de uma arquitetura **100% Serverless** (sem servidor) na AWS, garantindo escalabilidade elástica automática, alta disponibilidade e cobrança estritamente baseada no uso real do ecossistema.

---

## 🏗️ Arquitetura da Solução e Escolhas Técnicas

A solução foi modularizada em uma arquitetura de 3 camadas independentes, garantindo isolamento de responsabilidades e facilidade de manutenção:

```text
🌐 [Usuário / Browser] 
       │
       ▼ (Acesso ao Site hospedado no GitHub Pages / Futuro Amazon S3)
 ┌──────────────┐
 │ Camada de    │ ► Amazon API Gateway (Recebe e encaminha requisições HTTP)
 │ Acesso       │
 └──────┬───────┘
        │
        ▼ (Requisições REST: GET / POST)
 ┌──────────────┐
 │ Camada de    │ ► AWS Lambda (Processa a lógica de roteamento em Python)
 │ Processamento│
 └──────┬───────┘
        │
        ▼ (Operações de Leitura e Incremento Atômico)
 ┌──────────────┐
 │ Camada de    │ ► Amazon DynamoDB (Banco NoSQL de persistência chave-valor)
 │ Dados        │
 └──────────────┘
