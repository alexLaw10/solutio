# Dashboard E2E Tests

Testes end-to-end para o dashboard usando Cypress.

## Scripts Disponíveis

### Executar testes E2E

```bash
# Executar testes em modo interativo (abre o Cypress UI)
npm run e2e:open

# Executar testes em modo headless (sem UI, para CI)
npm run e2e:headless

# Executar testes em modo CI (usando build estático)
npm run e2e:ci

# Executar testes (modo padrão)
npm run e2e
```

## Estrutura dos Testes

- `src/e2e/` - Testes E2E organizados por funcionalidade
  - `app.cy.ts` - Testes principais do dashboard
  - `navigation.cy.ts` - Testes de navegação (navbar, sidebar, tema)
  - `table.cy.ts` - Testes específicos da tabela de dados
  - `charts.cy.ts` - Testes dos gráficos e KPIs
  - `accessibility.cy.ts` - Testes de acessibilidade (ARIA, navegação por teclado)
  - `responsive.cy.ts` - Testes de responsividade em diferentes viewports
- `src/support/` - Arquivos de suporte
  - `commands.ts` - Comandos customizados do Cypress
  - `e2e.ts` - Configuração global dos testes
  - `app.po.ts` - Page Objects para seletores comuns
- `src/fixtures/` - Dados mockados
  - `weather-forecast.json` - Resposta mockada da API Open-Meteo

## Comandos Customizados

- `cy.selectCity(cityName)` - Seleciona uma cidade no dropdown
- `cy.selectDateRange(startDate, endDate)` - Seleciona intervalo de datas
- `cy.searchWeatherData()` - Clica no botão de busca e aguarda carregamento
- `cy.toggleTheme()` - Alterna entre tema claro e escuro
- `cy.waitForWeatherData()` - Aguarda os dados meteorológicos carregarem
- `cy.waitForLoadingToFinish()` - Aguarda indicadores de loading desaparecerem
- `cy.checkA11y(selector?)` - Verifica acessibilidade básica
- `cy.navigateWithKeyboard(times)` - Simula navegação por teclado
- `cy.shouldHaveAriaLabel(selector, label)` - Verifica se elemento tem aria-label

## Page Objects

Helpers organizados por categoria para seletores comuns:

### Componentes de Navegação
- `getNavbar()` - Seleciona a navbar
- `getSidebar()` - Seleciona a sidebar
- `getSidebarLinks()` - Seleciona os links da sidebar
- `getThemeToggle()` - Seleciona o botão de toggle de tema
- `getMainContent()` - Seleciona o conteúdo principal
- `getSkipLink()` - Seleciona os skip links

### Componentes de Tabela
- `getTable()` - Seleciona a tabela de dados
- `getTableRows()` - Seleciona as linhas da tabela
- `getTableHeaders()` - Seleciona os cabeçalhos da tabela
- `getLoadMoreButton()` - Seleciona o botão "Carregar mais"

### Componentes de Formulário
- `getStartDateInput()` - Seleciona o input de data inicial
- `getEndDateInput()` - Seleciona o input de data final
- `getCitySelect()` - Seleciona o select de cidade
- `getSearchButton()` - Seleciona o botão de busca

### Componentes de Gráficos
- `getKpiCards()` - Seleciona os cards de KPI
- `getBarChart()` - Seleciona o gráfico de barras
- `getAreaChart()` - Seleciona o gráfico de área
- `getDonutChart()` - Seleciona o gráfico de donut

### Componentes de Status
- `getLoadingIndicator()` - Seleciona indicadores de loading
- `getAlert()` - Seleciona alertas
- `getErrorMessage()` - Seleciona mensagens de erro

## Configuração

A configuração do Cypress está em `cypress.config.ts` e inclui:

- Timeout padrão: 10 segundos (comandos e requisições)
- Viewport padrão: 1280x720
- Retries: 2 tentativas em modo run, 0 em modo open
- Screenshots e vídeos habilitados para debugging
- URL base: http://localhost:4200
- Task de logging para melhor debugging

## Melhorias Implementadas

### Organização
- ✅ Testes separados por funcionalidade em arquivos dedicados
- ✅ Page Objects organizados por categoria
- ✅ Comandos customizados reutilizáveis

### Acessibilidade
- ✅ Testes de navegação por teclado
- ✅ Verificação de atributos ARIA
- ✅ Testes de estrutura semântica
- ✅ Verificação de skip links

### Responsividade
- ✅ Testes em múltiplos viewports (Mobile, Tablet, Desktop)
- ✅ Verificação de layout em diferentes tamanhos de tela

### Qualidade
- ✅ Melhor tratamento de estados de loading
- ✅ Testes de erro mais robustos
- ✅ Validação de formatação de dados
- ✅ Testes de interações do usuário

## Executando os Testes

1. Certifique-se de que a aplicação está rodando:
   ```bash
   npm start
   ```

2. Em outro terminal, execute os testes:
   ```bash
   npm run e2e:open
   ```

## Mocking de APIs

Os testes usam `cy.intercept()` para mockar as chamadas da API Open-Meteo. Os dados mockados estão em `src/fixtures/weather-forecast.json`.

