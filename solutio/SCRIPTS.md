# Scripts Disponíveis

Este documento lista todos os scripts npm disponíveis no projeto.

## 🚀 Desenvolvimento

### Servir aplicação
```bash
npm start              # Inicia o servidor de desenvolvimento (dashboard)
npm run start:prod     # Inicia o servidor em modo produção
npm run serve:static   # Serve build estático da aplicação
```

## 🏗️ Build

### Build do Dashboard
```bash
npm run build          # Build de produção (otimizado)
npm run build:dev      # Build de desenvolvimento (com source maps)
```

### Build do Design System
```bash
npm run build:design-system  # Build do design system (componentes Stencil)
```

### Build de todos os projetos
```bash
npm run build:all      # Build de todos os projetos do workspace
npm run build:affected # Build apenas dos projetos afetados (baseado em git)
```

## 🧪 Testes

### Testes Unitários - Dashboard
```bash
npm test               # Executa testes unitários do dashboard
npm run test:watch     # Executa testes em modo watch
npm run test:coverage  # Executa testes com cobertura de código
npm run test:ci        # Executa testes em modo CI (com cobertura)
```

### Testes Unitários - Design System
```bash
npm run test:design-system  # Executa testes do design system
```

### Testes de todos os projetos
```bash
npm run test:all       # Executa testes de todos os projetos
npm run test:affected  # Executa testes apenas dos projetos afetados
```

## 🎭 Testes E2E (Cypress)

```bash
npm run e2e            # Executa testes E2E (modo padrão)
npm run e2e:headless   # Executa testes E2E em modo headless (sem UI)
npm run e2e:ci         # Executa testes E2E para CI (usando build estático)
npm run e2e:open       # Abre a interface do Cypress para executar testes interativamente
npm run e2e:prod       # Executa testes E2E em modo produção
```

## 🔍 Linting

### Lint do Dashboard
```bash
npm run lint           # Verifica problemas de lint
npm run lint:fix       # Corrige automaticamente problemas de lint
```

### Lint de todos os projetos
```bash
npm run lint:all       # Verifica lint de todos os projetos
npm run lint:affected  # Verifica lint apenas dos projetos afetados
npm run lint:e2e       # Verifica lint dos testes E2E
```

## 📝 Formatação

```bash
npm run format         # Formata o código automaticamente
npm run format:check   # Verifica se o código está formatado
```

## 🧹 Limpeza

```bash
nx reset               # Reseta cache do Nx
npm run clean          # Remove cache, node_modules, dist e coverage
npm run clean:all      # Remove tudo e reinstala dependências
```

## 📊 Análise e Visualização

```bash
npm run graph          # Abre visualização do grafo de dependências
npm run affected:apps  # Lista apps afetados
npm run affected:libs  # Lista libs afetadas
npm run affected:graph # Visualiza grafo de projetos afetados
```

## ✅ Validação

### Verificação rápida
```bash
npm run check          # Executa lint e testes de todos os projetos
npm run check:affected # Executa lint e testes dos projetos afetados
```

### Validação completa
```bash
npm run validate       # Executa build, lint e testes de todos os projetos
npm run validate:affected # Executa build, lint e testes dos projetos afetados
```

## 🎯 Scripts Úteis do Nx

Todos os comandos podem ser executados diretamente com `nx`:

```bash
# Executar qualquer target de um projeto específico
nx <target> <project-name>

# Exemplos:
nx build dashboard
nx test dashboard
nx lint dashboard
nx serve dashboard

# Executar múltiplos targets
nx run-many --target=build --all
nx run-many --target=test --projects=dashboard,design-system

# Ver ajuda
nx <command> --help
```

## 📚 Comandos por Categoria

### Desenvolvimento Diário
- `npm start` - Iniciar desenvolvimento
- `npm test` - Executar testes
- `npm run lint:fix` - Corrigir problemas de código

### Antes de Commitar
- `npm run check:affected` - Verificar código afetado
- `npm run format` - Formatar código
- `npm run lint` - Verificar lint

### CI/CD
- `npm run build` - Build de produção
- `npm run test:ci` - Testes com cobertura
- `npm run e2e:ci` - Testes E2E para CI
- `npm run validate:affected` - Validação completa

### Manutenção
- `npm run graph` - Visualizar dependências
- `npm run clean` - Limpar cache e builds
- `nx reset` - Resetar cache do Nx

