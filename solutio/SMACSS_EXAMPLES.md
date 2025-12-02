# Exemplos Práticos de Estrutura SMACSS

Este documento mostra exemplos práticos de cada opção de estrutura SMACSS.

## Opção 1: SMACSS Básico - Exemplos Práticos

### Estrutura de Arquivos

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
    ├── components/
    │   └── _shared.scss          # Estilos compartilhados entre componentes
    │
    └── state/
        ├── _loading.scss
        └── _error.scss
```

### Exemplo: `styles/base/_base.scss`

```scss
* {
  transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

html {
  transition: color-scheme 0.3s ease;
  scroll-behavior: smooth;
}

body {
  background-color: var(--design-system-background-primary);
  color: var(--design-system-text-primary);
  margin: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

*:focus-visible {
  outline: 2px solid var(--design-system-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

[data-theme="dark"] *:focus-visible {
  outline-color: var(--design-system-primary);
  box-shadow: 0 0 0 2px var(--design-system-background-primary), 
              0 0 0 4px var(--design-system-primary);
}
```

### Exemplo: `styles/layout/_navbar.scss`

```scss
.navbar {
  background-color: var(--design-system-background-primary);
  border-bottom: 1px solid var(--design-system-border-primary);
  box-shadow: 0 2px 4px var(--design-system-shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 100%;

    @media (max-width: 768px) {
      padding: 0.75rem 1rem;
    }

    @media (max-width: 576px) {
      padding: 0.5rem 1rem;
    }
  }

  &__brand {
    display: flex;
    align-items: center;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--design-system-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }

    @media (max-width: 576px) {
      font-size: 1.125rem;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 576px) {
      gap: 0.5rem;
    }
  }
}
```

### Exemplo: `styles/state/_loading.scss`

```scss
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  font-size: 1rem;
  color: var(--design-system-text-secondary);
  background-color: var(--design-system-background-secondary);
  border-radius: 8px;
  box-shadow: 0 1px 4px var(--design-system-shadow-sm);

  &__spinner {
    width: 20px;
    height: 20px;
    border: 3px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### Exemplo: `styles.scss` (Entry Point)

```scss
@import 'design-system/src/tokens/colors';

@import 'styles/base/reset';
@import 'styles/base/typography';
@import 'styles/base/base';

@import 'styles/layout/navbar';
@import 'styles/layout/sidebar';
@import 'styles/layout/main';

@import 'styles/components/shared';

@import 'styles/state/loading';
@import 'styles/state/error';
```

---

## Opção 2: SMACSS Completo - Exemplos Práticos

### Convenção de Nomenclatura

```scss
// Layout (prefixo .l-)
.l-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.l-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

// Module (prefixo .m-)
.m-card {
  background: var(--design-system-background-primary);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px var(--design-system-shadow-sm);
}

.m-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &--primary {
    background: var(--design-system-primary);
    color: white;
  }
}

// Component (prefixo .c-)
.c-home {
  padding: 2rem;
  
  .c-home__header {
    margin-bottom: 1.5rem;
  }
  
  .m-card {
    // Usa módulo dentro do componente
  }
}

// State (prefixo .is- ou .has-)
.is-loading {
  opacity: 0.6;
  pointer-events: none;
}

.has-error {
  border-color: var(--design-system-error);
}

.is-active {
  background: var(--design-system-primary);
  color: white;
}
```

### Exemplo de Uso no HTML

```html
<div class="l-container">
  <div class="c-home">
    <header class="c-home__header">
      <h1>Título</h1>
    </header>
    
    <div class="l-grid">
      <div class="m-card is-loading">
        <h2>Card 1</h2>
      </div>
      
      <div class="m-card has-error">
        <h2>Card 2</h2>
      </div>
    </div>
    
    <button class="m-button m-button--primary is-active">
      Clique aqui
    </button>
  </div>
</div>
```

---

## Opção 3: SMACSS Híbrido - Exemplos Práticos

### Estrutura

```
dashboard/src/
├── styles.scss                    # Global
└── styles/
    ├── base/
    ├── layout/
    └── modules/

# Componentes mantêm seus próprios .scss
app/
├── feature/home/
│   ├── home.component.scss        # Encapsulado
│   └── components/
│       └── table/
│           └── table.component.scss
```

### Exemplo: `styles/layout/_navbar.scss` (Global)

```scss
// Estilos globais do navbar
.navbar {
  background-color: var(--design-system-background-primary);
  // ...
}
```

### Exemplo: `home.component.scss` (Encapsulado)

```scss
:host {
  display: block;
}

.home {
  // Estilos específicos do componente
  // ViewEncapsulation do Angular isola estes estilos
  
  &__header {
    // ...
  }
  
  // Pode usar classes globais se necessário
  .navbar {
    // Mas isso quebra o encapsulamento
    // Melhor não fazer
  }
}
```

---

## Comparação Visual

### Opção 1: Arquivos Movidos

```
Antes:
styles.scss (tudo misturado)
├── Estilos base
├── Navbar
├── Sidebar
└── Utilidades

Depois:
styles/
├── base/          ← Estilos base
├── layout/        ← Navbar, Sidebar
└── state/         ← Loading, Error
```

### Opção 2: Nomenclatura com Prefixos

```
Antes:
.navbar
.home
.card

Depois:
.l-navbar       ← Layout
.c-home         ← Component
.m-card         ← Module
.is-loading     ← State
```

### Opção 3: Separação Global/Local

```
Antes:
Tudo em styles.scss ou componente.scss

Depois:
styles/          ← Global (layout, base, modules)
component.scss   ← Local (encapsulado pelo Angular)
```

---

## Qual Escolher?

### Escolha **Opção 1** se:
- ✅ Quer organização sem complexidade extra
- ✅ Projeto de tamanho médio
- ✅ Quer manter encapsulamento Angular
- ✅ Fácil migração

### Escolha **Opção 2** se:
- ✅ Projeto grande com muitos componentes
- ✅ Muita reutilização de módulos
- ✅ Equipe grande precisa de padrões rígidos
- ✅ Tem tempo para refatoração completa

### Escolha **Opção 3** se:
- ✅ Quer manter ViewEncapsulation do Angular
- ✅ Precisa de alguns estilos globais
- ✅ Prefere flexibilidade

---

## Recomendação Final

**Para este projeto: Opção 1 (SMACSS Básico)**

É o melhor equilíbrio entre organização e simplicidade, mantendo a estrutura atual dos componentes Angular funcionando normalmente.

