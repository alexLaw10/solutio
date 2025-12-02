# Opções de Estrutura SMACSS para Aplicação Angular

Este documento apresenta diferentes abordagens para organizar os estilos da aplicação Angular seguindo o padrão SMACSS.

## 📋 Índice

- [Opção 1: SMACSS Básico (Recomendado para começar)](#opção-1-smacss-básico-recomendado-para-começar)
- [Opção 2: SMACSS Completo com Abstrações](#opção-2-smacss-completo-com-abstrações)
- [Opção 3: SMACSS Híbrido (Angular + Global)](#opção-3-smacss-híbrido-angular--global)
- [Comparação das Opções](#comparação-das-opções)

---

## Opção 1: SMACSS Básico (Recomendado para começar)

### Estrutura de Diretórios

```
dashboard/src/
├── styles.scss                    # Entry point
└── styles/
    ├── base/
    │   ├── _reset.scss            # Reset CSS
    │   ├── _typography.scss       # Tipografia base
    │   └── _base.scss             # Estilos base HTML
    │
    ├── layout/
    │   ├── _navbar.scss           # Estilos do navbar
    │   ├── _sidebar.scss          # Estilos do sidebar
    │   ├── _main.scss             # Estilos do main container
    │   └── _grid.scss             # Grid system (se necessário)
    │
    ├── components/                # Componentes da aplicação
    │   ├── _home.scss
    │   ├── _table.scss
    │   ├── _kpi.scss
    │   ├── _bar.scss
    │   ├── _area.scss
    │   └── _donut.scss
    │
    ├── state/
    │   ├── _loading.scss          # Estados de loading
    │   ├── _error.scss            # Estados de erro
    │   └── _interactive.scss      # Estados interativos (hover, active, etc.)
    │
    └── theme/                     # Já existe parcialmente
        ├── _variables.scss        # Variáveis SCSS (se necessário)
        └── (Cores já estão no design-system)
```

### Arquivo `styles.scss`

```scss
// Importar tokens do design system
@import 'design-system/src/tokens/colors';

// BASE - Estilos base e reset
@import 'styles/base/reset';
@import 'styles/base/typography';
@import 'styles/base/base';

// LAYOUT - Estrutura da aplicação
@import 'styles/layout/navbar';
@import 'styles/layout/sidebar';
@import 'styles/layout/main';
@import 'styles/layout/grid';

// COMPONENTS - Componentes da aplicação
@import 'styles/components/home';
@import 'styles/components/table';
@import 'styles/components/kpi';
@import 'styles/components/bar';
@import 'styles/components/area';
@import 'styles/components/donut';

// STATE - Estados temporários
@import 'styles/state/loading';
@import 'styles/state/error';
@import 'styles/state/interactive';

// THEME - Temas e variáveis (já está sendo usado via design-system)
// As cores já vêm do design-system
```

### Vantagens
- ✅ Simples de implementar
- ✅ Fácil de entender
- ✅ Separação clara de responsabilidades
- ✅ Escalável

### Desvantagens
- ⚠️ Estilos dos componentes ficam duplicados (global + component)

---

## Opção 2: SMACSS Completo com Abstrações

### Estrutura de Diretórios

```
dashboard/src/
├── styles.scss                    # Entry point
└── styles/
    ├── base/
    │   ├── _reset.scss
    │   ├── _typography.scss
    │   ├── _base.scss
    │   └── _utilities.scss        # Classes utilitárias
    │
    ├── layout/
    │   ├── _l-container.scss      # Container principal (.l-container)
    │   ├── _l-grid.scss           # Grid system (.l-grid)
    │   ├── _l-sidebar.scss        # Layout sidebar (.l-sidebar)
    │   └── _l-header.scss         # Layout header (.l-header)
    │
    ├── modules/                   # Componentes reutilizáveis
    │   ├── _m-card.scss           # Module: Card (.m-card)
    │   ├── _m-button.scss         # Module: Botão (.m-button)
    │   ├── _m-table.scss          # Module: Tabela (.m-table)
    │   └── _m-chart.scss          # Module: Gráfico (.m-chart)
    │
    ├── components/                # Componentes específicos da feature
    │   ├── _c-home.scss           # Component: Home (.c-home)
    │   ├── _c-table.scss          # Component: Table (.c-table)
    │   └── _c-kpi.scss            # Component: KPI (.c-kpi)
    │
    ├── state/
    │   ├── _is-loading.scss       # State: .is-loading
    │   ├── _is-error.scss         # State: .is-error
    │   ├── _is-active.scss        # State: .is-active
    │   └── _has-data.scss         # State: .has-data
    │
    └── theme/
        └── _overrides.scss        # Overrides de tema se necessário
```

### Convenção de Nomenclatura

- **Layout**: prefixo `.l-` (ex: `.l-container`, `.l-grid`)
- **Module**: prefixo `.m-` (ex: `.m-card`, `.m-button`)
- **Component**: prefixo `.c-` (ex: `.c-home`, `.c-table`)
- **State**: prefixo `.is-` ou `.has-` (ex: `.is-loading`, `.has-error`)

### Exemplo de Uso

```scss
// layouts/_l-container.scss
.l-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

// modules/_m-card.scss
.m-card {
  background: var(--design-system-background-primary);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px var(--design-system-shadow-sm);
}

// components/_c-home.scss
.c-home {
  .c-home__header {
    // ...
  }
  
  .m-card {
    // Pode usar módulos dentro de componentes
  }
}

// state/_is-loading.scss
.is-loading {
  opacity: 0.6;
  pointer-events: none;
  
  &::after {
    content: '';
    // spinner
  }
}
```

### Vantagens
- ✅ Máxima separação de responsabilidades
- ✅ Componentes altamente reutilizáveis
- ✅ Nomenclatura clara e consistente
- ✅ Fácil manutenção em projetos grandes

### Desvantagens
- ⚠️ Mais complexo de implementar
- ⚠️ Pode ser overkill para projetos pequenos
- ⚠️ Requer disciplina para manter padrões

---

## Opção 3: SMACSS Híbrido (Angular + Global)

### Estrutura de Diretórios

```
dashboard/src/
├── styles.scss                    # Entry point
└── styles/
    ├── base/
    │   ├── _reset.scss
    │   ├── _typography.scss
    │   └── _utilities.scss
    │
    ├── layout/
    │   ├── _navbar.scss           # Componentes de layout como globais
    │   ├── _sidebar.scss
    │   └── _main.scss
    │
    ├── modules/                   # Módulos globais reutilizáveis
    │   ├── _loading.scss
    │   ├── _error.scss
    │   └── _empty-state.scss
    │
    └── theme/
        └── _overrides.scss

# Componentes Angular mantêm seus próprios .scss
dashboard/src/app/
├── feature/home/
│   ├── home.component.scss        # Estilos específicos do componente
│   └── components/
│       ├── table/
│       │   └── table.component.scss
│       └── kpi/
│           └── kpi.component.scss
```

### Abordagem

- **Layouts e Base**: Estilos globais compartilhados
- **Modules**: Componentes reutilizáveis globais
- **Componentes Angular**: Mantêm seus próprios `.scss` para encapsulamento
- **Estados**: Podem ser globais ou dentro dos componentes

### Exemplo

```scss
// styles.scss
@import 'design-system/src/tokens/colors';
@import 'styles/base/reset';
@import 'styles/base/typography';
@import 'styles/layout/navbar';
@import 'styles/layout/sidebar';
@import 'styles/modules/loading';

// home.component.scss (encapsulado)
:host {
  display: block;
}

.home {
  // Estilos específicos do componente
  // Pode usar classes globais do layout se necessário
}
```

### Vantagens
- ✅ Mantém encapsulamento do Angular
- ✅ Estilos globais para layouts
- ✅ Flexibilidade para estilos específicos
- ✅ Melhor para ViewEncapsulation

### Desvantagens
- ⚠️ Mistura de abordagens (global + encapsulado)
- ⚠️ Pode ser confuso saber onde colocar alguns estilos

---

## Comparação das Opções

| Aspecto | Opção 1 (Básico) | Opção 2 (Completo) | Opção 3 (Híbrido) |
|---------|------------------|-------------------|-------------------|
| **Complexidade** | Baixa | Alta | Média |
| **Curva de Aprendizado** | Rápida | Média | Rápida |
| **Reutilização** | Média | Alta | Média |
| **Encapsulamento Angular** | Parcial | Parcial | Completo |
| **Manutenibilidade** | Boa | Excelente | Boa |
| **Tamanho do Projeto** | Pequeno/Médio | Grande | Qualquer |
| **Migração** | Fácil | Complexa | Média |

---

## Recomendação para o Projeto Atual

### Para sua aplicação, recomendo: **Opção 1 (SMACSS Básico)**

**Razões:**
1. ✅ Projeto de tamanho médio
2. ✅ Já tem estrutura de componentes bem definida
3. ✅ Fácil migração a partir da estrutura atual
4. ✅ Mantém estilos dos componentes Angular encapsulados
5. ✅ Adiciona organização sem complexidade excessiva

### Plano de Migração Sugerido

1. **Criar estrutura de diretórios SMACSS**
2. **Mover estilos base do `styles.scss`** para `base/`
3. **Extrair estilos de layout** (navbar, sidebar, main) para `layout/`
4. **Criar módulos globais** em `components/` apenas para estilos compartilhados
5. **Manter estilos específicos** nos `.component.scss` de cada componente
6. **Adicionar estados globais** em `state/` se necessário

---

## Exemplo Prático: Estrutura Final (Opção 1)

```
dashboard/src/
├── styles.scss
└── styles/
    ├── base/
    │   ├── _reset.scss
    │   ├── _typography.scss
    │   └── _base.scss
    │
    ├── layout/
    │   ├── _navbar.scss
    │   ├── _sidebar.scss
    │   └── _main.scss
    │
    ├── components/                # Apenas estilos compartilhados entre componentes
    │   └── _shared.scss
    │
    └── state/
        ├── _loading.scss
        └── _error.scss

# Componentes Angular mantêm seus .scss locais
app/
├── feature/home/
│   ├── home.component.scss        # Estilos específicos
│   └── components/
│       ├── table/
│       │   └── table.component.scss
│       └── kpi/
│           └── kpi.component.scss
```

---

## Próximos Passos

Escolha a opção que melhor se adequa ao seu projeto e eu posso ajudar a implementar a estrutura escolhida! 🚀

