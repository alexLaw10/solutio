# 📊 Solutio Dashboard

Sistema completo de dashboard meteorológico com versões **Desktop (Web)** e **Mobile** para visualização de dados climáticos.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [🖥️ Desktop (Web)](#️-desktop-web)
  - [Tecnologias Utilizadas](#-tecnologias-utilizadas-desktop)
  - [Pré-requisitos](#-pré-requisitos-desktop)
  - [Instalação](#-instalação-desktop)
  - [Como Iniciar](#-como-iniciar-desktop)
  - [Testes Unitários](#-testes-unitários-desktop)
  - [Testes Automatizados (E2E)](#-testes-automatizados-e2e-desktop)
  - [Linting](#-linting-desktop)
- [📱 Mobile](#-mobile)
  - [Tecnologias Utilizadas](#-tecnologias-utilizadas-mobile)
  - [Design System](#-design-system-ds)
  - [Pré-requisitos](#-pré-requisitos-mobile)
  - [Instalação](#-instalação-mobile)
  - [Como Iniciar](#-como-iniciar-mobile)
  - [Passo a Passo para Mobile](#-passo-a-passo-para-iniciar-no-mobile)
  - [Testes Unitários](#-testes-unitários-mobile)
  - [Linting](#-linting-mobile)
- [📝 Scripts Disponíveis](#-scripts-disponíveis)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)

---

## 🎯 Visão Geral

Este repositório contém duas aplicações principais:

1. **Dashboard Desktop (Web)** - Aplicação Angular para visualização de dados meteorológicos em navegadores
2. **Dashboard Mobile** - Aplicativo React Native com Expo para dispositivos móveis

Ambas as aplicações compartilham a mesma funcionalidade de visualização de dados climáticos, mas são otimizadas para suas respectivas plataformas.

---

## 🖥️ Desktop (Web)

Aplicação web desenvolvida com **Angular** para visualização de dados meteorológicos em formato de dashboard.

### 🛠️ Tecnologias Utilizadas (Desktop)

#### Core
- **Angular** (~16.2.0) - Framework para desenvolvimento de aplicações web
- **TypeScript** (~5.9.2) - Superset do JavaScript com tipagem estática
- **RxJS** (~7.8.0) - Biblioteca para programação reativa

#### UI e Gráficos
- **ApexCharts** (^3.41.0) - Biblioteca para criação de gráficos interativos
- **ng-apexcharts** (^1.8.0) - Wrapper Angular para ApexCharts
- **Stencil** (^4.38.3) - Design System baseado em Web Components

#### Build e Ferramentas
- **Nx** (22.1.3) - Monorepo e ferramentas de build
- **Angular CLI** (^16.2.16) - Ferramentas de linha de comando do Angular
- **Zone.js** (~0.13.0) - Detecção de mudanças do Angular

#### Desenvolvimento e Testes
- **Jest** (^29.7.0) - Framework de testes unitários
- **Cypress** (^13.0.0) - Framework de testes E2E
- **ESLint** (~8.46.0) - Linter para JavaScript/TypeScript
- **Prettier** (^2.6.2) - Formatador de código

### 📋 Pré-requisitos (Desktop)

1. **Node.js** (versão 18 ou superior)
2. **npm** ou **yarn**
3. **Nx CLI** (opcional, pode usar npx)

### 📦 Instalação (Desktop)

1. Clone o repositório:
```bash
git clone https://github.com/alexLaw10/solutio.git
cd solutio
```

2. Navegue até a pasta do projeto desktop:
```bash
cd solutio
```

3. Instale as dependências:
```bash
npm install
```

### 🚀 Como Iniciar (Desktop)

#### Passo a Passo

1. **Instale as dependências** (se ainda não fez):
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   ou
   ```bash
   cd solutio
   npm start
   ```

3. **Acesse a aplicação:**
   - A aplicação será aberta automaticamente em `http://localhost:4200`
   - Se não abrir automaticamente, acesse manualmente no navegador

4. **Build do Design System (opcional):**
   Se você precisar compilar o Design System separadamente:
   ```bash
   npm run start:ds
   ```
   Este comando compila o Design System em modo watch (recompila automaticamente ao salvar).

#### Build de Produção

Para gerar um build otimizado para produção:

```bash
npm run build
```

O build será gerado em `solutio/dist/dashboard/`.

### 🧪 Testes Unitários (Desktop)

O projeto utiliza **Jest** para testes unitários.

#### Executar todos os testes:
```bash
npm test
```

Este comando executa os testes com cobertura de código.

#### Executar testes do Design System:
```bash
npm run test:ds
```

### 🤖 Testes Automatizados (E2E) (Desktop)

O projeto utiliza **Cypress** para testes end-to-end.

#### Executar testes E2E em modo interativo:
```bash
npm run e2e:open
```

Este comando abre a interface do Cypress para executar testes interativamente.

#### Executar testes E2E em modo headless (sem UI):
```bash
npm run e2e
```

#### Executar testes E2E em modo CI:
```bash
npm run e2e:ci
```

Este comando executa os testes usando um build estático da aplicação.

#### Estrutura dos Testes E2E

Os testes E2E estão organizados em `solutio/dashboard-e2e/src/e2e/`:
- `app.cy.ts` - Testes principais do dashboard
- `navigation.cy.ts` - Testes de navegação (navbar, sidebar, tema)
- `table.cy.ts` - Testes específicos da tabela de dados
- `charts.cy.ts` - Testes dos gráficos e KPIs
- `accessibility.cy.ts` - Testes de acessibilidade (ARIA, navegação por teclado)
- `responsive.cy.ts` - Testes de responsividade em diferentes viewports

### 🔍 Linting (Desktop)

O projeto utiliza **ESLint** para garantir qualidade de código.

#### Executar o linter:
```bash
npm run lint
```

#### Corrigir problemas automaticamente:
```bash
npm run lint:fix
```

O ESLint verifica:
- Arquivos TypeScript (`.ts`)
- Templates HTML (`.html`)
- Problemas de estilo e boas práticas

---

## 📱 Mobile

Aplicativo mobile React Native desenvolvido com **Expo** para visualização de dados meteorológicos em formato de dashboard.

### 🛠️ Tecnologias Utilizadas (Mobile)

#### Core
- **React Native** (0.81.5) - Framework para desenvolvimento mobile multiplataforma
- **Expo** (~54.0.25) - Plataforma e ferramentas para desenvolvimento React Native
- **React** (19.1.0) - Biblioteca JavaScript para construção de interfaces
- **TypeScript** (~5.9.2) - Superset do JavaScript com tipagem estática

#### Navegação e Roteamento
- **Expo Router** (~6.0.15) - Sistema de roteamento baseado em arquivos (file-based routing)
- **React Navigation** (^7.1.8) - Biblioteca de navegação para React Native
  - `@react-navigation/native` - Core da navegação
  - `@react-navigation/bottom-tabs` - Navegação por abas
  - `@react-navigation/elements` - Elementos de navegação

#### UI e Componentes
- **React Native SVG** (^15.15.1) - Renderização de gráficos SVG
- **React Native Chart Kit** (^6.12.0) - Biblioteca para criação de gráficos
- **React Native Gesture Handler** (~2.28.0) - Manipulação de gestos nativos
- **React Native Reanimated** (~4.1.1) - Animações performáticas
- **React Native Safe Area Context** (~5.6.0) - Gerenciamento de áreas seguras

#### Armazenamento
- **AsyncStorage** (^2.1.0) - Armazenamento local assíncrono

#### Utilitários
- **React Native Screens** (~4.16.0) - Otimização de performance de telas
- **React Native Worklets** (0.5.1) - Execução de código em thread separada
- **Expo Constants** (~18.0.10) - Acesso a constantes do sistema
- **Expo Splash Screen** (~31.0.11) - Tela de splash customizada
- **Expo Status Bar** (~3.0.8) - Controle da barra de status

#### Desenvolvimento e Testes
- **Jest** (^29.7.0) - Framework de testes
- **Jest Expo** (~51.0.3) - Preset do Jest para Expo
- **React Native Testing Library** (^12.4.3) - Utilitários para testes de componentes
- **ESLint** (^9.25.0) - Linter para JavaScript/TypeScript
- **ESLint Config Expo** (~10.0.0) - Configuração do ESLint para Expo

### 🎨 Design System (DS)

O Design System do projeto mobile está organizado em `solutio-mobile/solutio-mobile-dashboard/src/constants/theme.ts` e inclui:

#### Cores
O sistema de cores suporta modo claro e escuro:

**Modo Claro:**
- Texto: `#11181C`
- Fundo: `#fff`
- Tint (cor principal): `#0a7ea4`
- Ícones: `#687076`

**Modo Escuro:**
- Texto: `#ECEDEE`
- Fundo: `#151718`
- Tint: `#fff`
- Ícones: `#9BA1A6`

#### Fontes
O sistema de fontes é adaptado por plataforma:
- **iOS**: System fonts (sans, serif, rounded, mono)
- **Android/Default**: Fontes padrão do sistema
- **Web**: Fontes web otimizadas (system-ui, Georgia, SFMono, etc)

#### Componentes do Design System
Os componentes estão organizados em:
- `src/components/ui/` - Componentes primitivos reutilizáveis
- `src/components/common/` - Componentes específicos do app (ThemedText, ThemedView, etc)
- `src/components/charts/` - Componentes de gráficos (Area, Bar, Donut)

### 📋 Pré-requisitos (Mobile)

1. **Node.js** (versão 18 ou superior)
2. **npm** ou **yarn**
3. **Expo CLI** (instalado globalmente ou via npx)
4. **Expo Go** instalado no seu dispositivo móvel:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 📦 Instalação (Mobile)

1. Clone o repositório (se ainda não fez):
```bash
git clone https://github.com/alexLaw10/solutio.git
cd solutio
```

2. Navegue até a pasta do projeto mobile:
```bash
cd solutio-mobile/solutio-mobile-dashboard
```

3. Instale as dependências:
```bash
npm install
```

### 🚀 Como Iniciar (Mobile)

#### Passo a Passo

1. **Instale as dependências** (se ainda não fez):
   ```bash
   cd solutio-mobile/solutio-mobile-dashboard
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

   Este comando irá:
   - Iniciar o servidor de desenvolvimento do Expo
   - Gerar um QR code no terminal
   - Abrir o Metro Bundler no navegador

3. **Siga os passos abaixo para conectar no dispositivo móvel**

### 📱 Passo a Passo para Iniciar no Mobile

#### 1. Instale o Expo Go no seu celular

- **iOS**: Baixe na [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: Baixe na [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

#### 2. Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi

⚠️ **Importante**: Ambos os dispositivos devem estar conectados à mesma rede Wi-Fi para que o QR code funcione.

#### 3. Inicie o servidor

No terminal, execute:
```bash
cd solutio-mobile/solutio-mobile-dashboard
npm start
```

#### 4. Escaneie o QR Code

Após executar `npm start`, um QR code aparecerá no terminal:

- **iOS**: 
  - Abra a câmera nativa do iPhone
  - Aponte para o QR code
  - Toque na notificação que aparecer para abrir no Expo Go

- **Android**: 
  - Abra o app Expo Go
  - Toque em "Scan QR code"
  - Escaneie o QR code exibido no terminal

#### 5. Aguarde o carregamento

- O Expo Go irá baixar e executar o JavaScript bundle
- A aplicação será carregada no seu dispositivo
- Você verá a tela inicial do dashboard

#### Outros Comandos de Inicialização

```bash
# Iniciar e abrir no simulador iOS (requer Xcode no Mac)
npm run ios

# Iniciar e abrir no emulador Android (requer Android Studio)
npm run android

# Iniciar versão web (abre no navegador)
npm run web
```

### 🧪 Testes Unitários (Mobile)

O projeto utiliza **Jest** e **React Native Testing Library** para testes unitários.

#### Executar todos os testes:
```bash
cd solutio-mobile/solutio-mobile-dashboard
npm test
```

#### Executar testes em modo watch (re-executa ao salvar arquivos):
```bash
npm run test:watch
```

#### Executar testes com cobertura de código:
```bash
npm run test:coverage
```

A cobertura mínima configurada é de **60%** para:
- Branches (ramificações)
- Functions (funções)
- Lines (linhas)
- Statements (declarações)

#### Estrutura de Testes

Os testes estão organizados em pastas `__tests__` próximas aos arquivos testados:

```
solutio-mobile/solutio-mobile-dashboard/src/
├── components/
│   ├── charts/
│   │   └── __tests__/
│   │       ├── Area.test.tsx
│   │       ├── Bar.test.tsx
│   │       └── Donut.test.tsx
│   └── common/
│       └── __tests__/
│           ├── Alert.test.tsx
│           ├── Kpi.test.tsx
│           └── Table.test.tsx
├── hooks/
│   └── __tests__/
│       ├── use-theme-color.test.tsx
│       └── use-weather-data.test.tsx
├── services/
│   └── __tests__/
│       ├── api.service.test.ts
│       └── weather.service.test.ts
└── utils/
    └── __tests__/
        └── index.test.ts
```

### 🔍 Linting (Mobile)

O projeto utiliza **ESLint** com a configuração do Expo para garantir qualidade de código.

#### Executar o linter:
```bash
cd solutio-mobile/solutio-mobile-dashboard
npm run lint
```

O ESLint irá verificar todos os arquivos TypeScript/JavaScript no projeto e reportar:
- Erros de sintaxe
- Problemas de estilo
- Boas práticas
- Problemas de acessibilidade

---

## 📝 Scripts Disponíveis

### Desktop

Execute na pasta `solutio/`:

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento Angular |
| `npm run start:ds` | Compila o Design System em modo watch |
| `npm run build` | Build de produção do dashboard |
| `npm run build:ds` | Build do Design System |
| `npm test` | Executa testes unitários com cobertura |
| `npm run test:ds` | Executa testes do Design System |
| `npm run e2e` | Executa testes E2E em modo headless |
| `npm run e2e:open` | Abre interface do Cypress para testes interativos |
| `npm run lint` | Executa o linter |
| `npm run lint:fix` | Corrige problemas de lint automaticamente |

### Mobile

Execute na pasta `solutio-mobile/solutio-mobile-dashboard/`:

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento Expo |
| `npm run ios` | Inicia no simulador iOS |
| `npm run android` | Inicia no emulador Android |
| `npm run web` | Inicia versão web |
| `npm test` | Executa testes unitários |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Executa testes com cobertura |
| `npm run lint` | Executa o linter |
| `npm run reset-project` | Reseta o projeto para configuração inicial |

---

## 📁 Estrutura do Projeto

```
solutio/
├── solutio/                      # Projeto Desktop (Angular)
│   ├── dashboard/                # Aplicação Angular
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/        # Módulo core (serviços, guards, interceptors)
│   │   │   │   ├── feature/     # Módulos de features
│   │   │   │   │   └── home/    # Feature home
│   │   │   │   └── shared/      # Módulo shared (componentes, pipes)
│   │   │   └── assets/          # Recursos estáticos
│   │   └── project.json         # Configuração Nx
│   ├── dashboard-e2e/           # Testes E2E com Cypress
│   │   ├── src/
│   │   │   ├── e2e/             # Testes E2E
│   │   │   ├── fixtures/        # Dados mockados
│   │   │   └── support/         # Comandos e page objects
│   │   └── cypress.config.ts    # Configuração Cypress
│   ├── design-system/           # Design System (Stencil)
│   │   └── src/
│   │       ├── components/      # Componentes Web Components
│   │       └── tokens/          # Design tokens
│   └── package.json             # Dependências e scripts principais
│
└── solutio-mobile/
    └── solutio-mobile-dashboard/ # Projeto Mobile (React Native/Expo)
        ├── src/
        │   ├── app/             # Expo Router (file-based routing)
        │   │   ├── (tabs)/      # Grupo de rotas com tabs
        │   │   └── _layout.tsx  # Layout raiz
        │   ├── components/      # Componentes reutilizáveis
        │   │   ├── charts/      # Componentes de gráficos
        │   │   ├── common/      # Componentes comuns
        │   │   └── ui/          # Componentes de UI base
        │   ├── services/        # Serviços e APIs
        │   ├── hooks/           # Custom React Hooks
        │   ├── utils/           # Funções utilitárias
        │   ├── types/           # TypeScript types
        │   ├── constants/       # Constantes
        │   │   ├── theme.ts     # Design System (cores, fontes)
        │   │   └── dates.ts    # Constantes de datas
        │   ├── config/          # Configurações
        │   └── context/         # React Context providers
        ├── assets/              # Recursos estáticos
        ├── scripts/             # Scripts utilitários
        ├── app.json             # Configuração Expo
        └── package.json         # Dependências e scripts
```

---

## 🔧 Configurações Importantes

### Desktop

#### Nx Workspace
O projeto utiliza **Nx** como monorepo, permitindo gerenciar múltiplos projetos em um único repositório.

#### Design System
O Design System é construído com **Stencil** e gera Web Components que podem ser usados em qualquer framework ou HTML puro.

### Mobile

#### Path Aliases
O projeto utiliza aliases TypeScript para importações mais limpas:

```typescript
import { apiService } from '@/src/services/api.service';
import { City } from '@/src/types';
import { colors } from '@/src/constants/theme';
```

Aliases configurados:
- `@/` → raiz do projeto
- `@src/` → pasta `src/`

#### Expo Router
O projeto utiliza **Expo Router** com file-based routing. As rotas são definidas automaticamente baseadas na estrutura de arquivos em `src/app/`.

#### Nova Arquitetura do React Native
O projeto está configurado para usar a nova arquitetura do React Native (`newArchEnabled: true` no `app.json`).

---

## 🐛 Troubleshooting

### Desktop

**Problema**: Erro ao iniciar o servidor
- **Solução**: Verifique se todas as dependências foram instaladas: `npm install`

**Problema**: Porta 4200 já está em uso
- **Solução**: Use outra porta: `nx serve dashboard --port 4201`

### Mobile

**Problema**: QR code não funciona
- **Solução**: Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi

**Problema**: Expo Go não consegue conectar
- **Solução**: 
  - Verifique se o firewall não está bloqueando a conexão
  - Tente usar o modo tunnel: `npm start -- --tunnel`

**Problema**: Erro ao executar testes
- **Solução**: Limpe o cache do Jest: `npm test -- --clearCache`

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

