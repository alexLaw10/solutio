# Dashboard E2E Tests

Testes end-to-end (E2E) para o dashboard usando Cypress com mocks de API, fixtures e comandos customizados.

## 🚀 Executando os Testes

### Modo Interativo (com interface gráfica)
```bash
npm run test:e2e
```

### Modo Headless (sem interface gráfica - CI/CD)
```bash
npm run test:e2e:headless
```

### Executar um arquivo específico
```bash
nx e2e dashboard-e2e --spec="apps/dashboard-e2e/src/e2e/table.cy.ts"
```

## 📁 Estrutura dos Testes

- `app.cy.ts` - Testes principais do dashboard (navegação, componentes, responsividade, performance)
- `table.cy.ts` - Testes específicos do componente de tabela (filtros, paginação, validação)
- `theme.cy.ts` - Testes do toggle de tema (persistência, acessibilidade)
- `accessibility.cy.ts` - Testes de acessibilidade (ARIA, navegação por teclado, screen readers)
- `performance.cy.ts` - Testes de performance (tempo de carregamento, renderização)

## 🎯 Features Implementadas

### ✅ Mock de APIs
- Fixtures para dados de teste (`weather-forecast.json`, `weather-forecast-empty.json`)
- Interceptação de chamadas API com `cy.intercept()`
- Testes de erro e estados de loading

### ✅ Comandos Customizados
- `cy.waitForAppLoad()` - Aguarda o app carregar completamente
- `cy.waitForDataLoad()` - Aguarda dados da API carregarem
- `cy.mockWeatherAPI(fixture, statusCode)` - Mocka a API de clima
- `cy.selectCity(cityName)` - Seleciona cidade no dropdown
- `cy.selectDateRange(start, end)` - Seleciona intervalo de datas
- `cy.toggleTheme()` - Alterna tema
- `cy.waitForLoadingToFinish()` - Aguarda loading terminar
- `cy.checkA11y(selector?)` - Verifica acessibilidade básica

### ✅ Page Object Model
Seletores organizados em `src/support/app.po.ts` para facilitar manutenção.

## 📊 Cobertura dos Testes

### Navegação
- ✅ Navegação para página home
- ✅ Sidebar e navbar visíveis
- ✅ Links de navegação funcionando

### Tema
- ✅ Toggle entre light e dark theme
- ✅ Persistência no localStorage
- ✅ Restauração ao recarregar
- ✅ Acessibilidade do botão
- ✅ Navegação por teclado

### Tabela
- ✅ Filtros por data (início e fim)
- ✅ Filtro por cidade
- ✅ Validação de intervalo de datas
- ✅ Validação de datas fora do range
- ✅ Exibição de dados
- ✅ Paginação (carregar mais)
- ✅ Mensagem quando todos os dados estão carregados
- ✅ Estados de loading
- ✅ Validação de formulário

### Responsividade
- ✅ Mobile (375x667)
- ✅ Tablet (768x1024)
- ✅ Desktop (1920x1080)

### Acessibilidade
- ✅ ARIA labels e roles
- ✅ Navegação por teclado
- ✅ Estrutura semântica
- ✅ Suporte a screen readers
- ✅ Indicadores de foco
- ✅ Hierarquia de headings

### Performance
- ✅ Tempo de carregamento da página
- ✅ Tempo de renderização de conteúdo
- ✅ Tempo de carregamento de dados
- ✅ Performance de interações
- ✅ Otimização de gráficos

### Error Handling
- ✅ Erros de API (500, network errors)
- ✅ Estados de loading
- ✅ Mensagens de erro

## 🔧 Configuração

### Pré-requisitos

1. O servidor de desenvolvimento deve estar rodando:
   ```bash
   npm start
   ```

2. Ou use a configuração `ci` que inicia o servidor automaticamente:
   ```bash
   nx e2e dashboard-e2e --configuration=ci
   ```

### Configurações do Cypress

- **Video**: Habilitado para debug
- **Screenshots**: Capturados em caso de falha
- **Retries**: 2 tentativas em modo CI
- **Timeouts**: 10 segundos para comandos
- **Viewport**: 1280x720 por padrão

## 📝 Fixtures

Dados mockados disponíveis em `src/fixtures/`:
- `weather-forecast.json` - Dados completos de previsão
- `weather-forecast-empty.json` - Dados vazios para testes de edge cases

## 🎨 Melhorias Implementadas

1. **Mock de APIs**: Testes mais rápidos e confiáveis
2. **Fixtures**: Dados de teste reutilizáveis
3. **Comandos Customizados**: Código mais limpo e manutenível
4. **Retry Logic**: Testes mais robustos em CI
5. **Performance Tests**: Validação de tempos de carregamento
6. **Acessibilidade Completa**: Testes de ARIA, teclado, screen readers
7. **Error Handling**: Testes de cenários de erro
8. **Loading States**: Validação de estados de carregamento

## 🚦 CI/CD Ready

Os testes estão configurados para rodar em pipelines CI/CD:
- Modo headless
- Retry automático em falhas
- Screenshots e vídeos em caso de erro
- Timeouts adequados para ambientes lentos
