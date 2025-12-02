# Design System

Biblioteca de componentes Web criada com Stencil.js para ser utilizada em aplicações Angular e outras frameworks que suportam Web Components.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Criando um Novo Componente](#criando-um-novo-componente)
- [Build do Design System](#build-do-design-system)
- [Utilizando Componentes nas Aplicações](#utilizando-componentes-nas-aplicações)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Convenções e Boas Práticas](#convenções-e-boas-práticas)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

Este design system utiliza **Stencil.js** para criar Web Components reutilizáveis. Os componentes são compilados e podem ser utilizados em qualquer framework que suporte Web Components (Angular, React, Vue, etc.).

### Stack Tecnológica

- **Stencil.js** - Framework para criar Web Components
- **TypeScript** - Tipagem estática
- **SCSS** - Estilização com BEM e SMaCS
- **Nx** - Monorepo e build automation

## 🚀 Criando um Novo Componente

### Passo 1: Gerar o Componente

Use o gerador do Nx para criar um novo componente:

```bash
cd /Users/alexjunior/Documents/projetos/monorepo/solutio
npx nx generate @nxext/stencil:component design-system/my-button --style=scss
```

Isso criará a estrutura básica do componente em `design-system/src/components/my-button/`.

### Passo 2: Implementar o Componente

Edite o arquivo `my-button.tsx`:

```tsx
import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'design-system-my-button',
  styleUrl: 'my-button.scss',
  shadow: true,
})
export class MyButton {
  /**
   * Texto do botão
   */
  @Prop() label: string = 'Clique aqui';

  /**
   * Estado desabilitado
   */
  @Prop() disabled: boolean = false;

  /**
   * Variante do botão
   */
  @Prop() variant: 'primary' | 'secondary' = 'primary';

  /**
   * Evento emitido quando o botão é clicado
   */
  @Event() buttonClick: EventEmitter<void>;

  private handleClick = () => {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  };

  render() {
    return (
      <button
        class={`my-button my-button--${this.variant}`}
        disabled={this.disabled}
        onClick={this.handleClick}
      >
        {this.label}
      </button>
    );
  }
}
```

### Passo 3: Adicionar Estilos (SCSS com BEM)

Edite o arquivo `my-button.scss`:

```scss
:host {
  display: contents;
}

.my-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  border: 1px solid transparent;

  &:focus-visible {
    outline: 2px solid var(--design-system-primary, #1976d2);
    outline-offset: 2px;
  }

  &--primary {
    background-color: var(--design-system-primary, #1976d2);
    color: white;
    border-color: var(--design-system-primary, #1976d2);

    &:hover:not(:disabled) {
      background-color: var(--design-system-primary-hover, #1565c0);
    }
  }

  &--secondary {
    background-color: var(--design-system-secondary, #f5f5f5);
    color: var(--design-system-text, #333);
    border-color: var(--design-system-border, #e0e0e0);

    &:hover:not(:disabled) {
      background-color: var(--design-system-secondary-hover, #e8e8e8);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

### Passo 4: Exportar o Componente (Opcional)

Se necessário, adicione exportações manuais. Com `experimentalImportInjection: true`, o Stencil gerencia isso automaticamente, mas você pode adicionar em `design-system/src/index.ts`:

```typescript
export * from './components';
```

### Passo 5: Build do Design System

Antes de usar o componente, você precisa fazer o build:

```bash
npx nx build design-system
```

Isso gera os arquivos compilados em `dist/design-system/`.

## 🔨 Build do Design System

### Build Normal

```bash
npx nx build design-system
```

### Build em Modo Watch (Desenvolvimento)

```bash
npx nx build design-system --watch
```

### Output

Após o build, os seguintes arquivos são gerados em `dist/design-system/`:

- `loader/` - Loader para registrar componentes
- `dist/` - Arquivos compilados (ESM, CJS, etc.)
- `types/` - Definições TypeScript

## 📦 Utilizando Componentes nas Aplicações

### Angular

#### Passo 1: Registrar os Componentes Globalmente

No arquivo `main.ts` da aplicação Angular:

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Importar e registrar Web Components do Stencil
import { defineCustomElements } from '../../dist/design-system/loader';

// Registrar custom elements globalmente
defineCustomElements();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
```

#### Passo 2: Configurar o Módulo

No módulo que utilizará os componentes (ex: `home.module.ts`):

```typescript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// ... outros imports

@NgModule({
  // ... outras configurações
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Importante: permite usar Web Components
})
export class HomeModule {}
```

**Nota:** `CUSTOM_ELEMENTS_SCHEMA` é necessário para permitir que Angular reconheça elementos customizados do Stencil.

#### Passo 3: Usar no Template

No template HTML do componente:

```html
<!-- Exemplo: Usando o search-button -->
<design-system-search-button
  type="submit"
  [loading]="isLoading"
  label="Buscar"
  variant="primary"
  size="medium"
  (searchClick)="handleSearch()">
</design-system-search-button>

<!-- Exemplo: Usando propriedades -->
<design-system-my-button
  [label]="buttonText"
  [disabled]="isDisabled"
  variant="secondary"
  (buttonClick)="handleClick()">
</design-system-my-button>
```

#### Passo 4: Binding de Propriedades e Eventos

**Propriedades (Props):**
- Props simples: `label="Texto"` ou `[label]="variable"`
- Props boolean: `[disabled]="true"` ou `disabled` (atributo)
- Props numéricas: `[size]="10"`

**Eventos:**
- Use a sintaxe Angular: `(eventName)="handler()"`
- Eventos são mapeados automaticamente (ex: `buttonClick` → `(buttonClick)`)

### React

#### Passo 1: Instalar e Registrar

```typescript
import { defineCustomElements } from '../../dist/design-system/loader';

defineCustomElements();
```

#### Passo 2: Usar no JSX

```tsx
import React, { useState } from 'react';

function MyComponent() {
  const [loading, setLoading] = useState(false);

  return (
    <design-system-search-button
      type="submit"
      loading={loading}
      label="Buscar"
      variant="primary"
      size="medium"
      onSearchClick={() => console.log('Clicked!')}
    />
  );
}
```

**Nota:** Em React, eventos usam camelCase com prefixo `on` (ex: `searchClick` → `onSearchClick`).

### Vue

#### Passo 1: Instalar e Registrar

```typescript
import { defineCustomElements } from '../../dist/design-system/loader';

defineCustomElements();
```

#### Passo 2: Usar no Template

```vue
<template>
  <design-system-search-button
    type="submit"
    :loading="isLoading"
    label="Buscar"
    variant="primary"
    size="medium"
    @searchClick="handleSearch"
  />
</template>
```

## 📁 Estrutura de Arquivos

```
design-system/
├── src/
│   ├── components/
│   │   ├── search-button/
│   │   │   ├── search-button.tsx      # Lógica do componente
│   │   │   ├── search-button.scss     # Estilos (BEM)
│   │   │   └── search-button.spec.ts  # Testes
│   │   └── my-button/
│   │       ├── my-button.tsx
│   │       ├── my-button.scss
│   │       └── my-button.spec.ts
│   ├── index.ts                        # Exports principais
│   └── utils/                          # Utilitários
├── dist/                               # Output do build (gerado)
│   ├── loader/                         # Loader para registrar componentes
│   ├── dist/                           # Arquivos compilados
│   └── types/                          # TypeScript definitions
├── stencil.config.ts                   # Configuração do Stencil
├── project.json                        # Configuração Nx
└── README.md                           # Este arquivo
```

## ✅ Convenções e Boas Práticas

### Nomenclatura

1. **Componentes:** Use kebab-case para o tag name:
   - ✅ `design-system-search-button`
   - ❌ `designSystemSearchButton`

2. **Props:** Use camelCase:
   - ✅ `isLoading`, `buttonLabel`
   - ❌ `is_loading`, `button-label`

3. **Eventos:** Use camelCase com prefixo descritivo:
   - ✅ `searchClick`, `buttonClick`
   - ❌ `click`, `onClick`

### Estilização (SCSS)

1. **BEM (Block Element Modifier):**
   ```scss
   .my-button {                    // Block
     &__icon { }                   // Element
     &--primary { }                // Modifier
   }
   ```

2. **Variáveis CSS:** Use CSS custom properties para temas:
   ```scss
   color: var(--design-system-primary, #1976d2);
   ```

3. **Shadow DOM:** Componentes usam `shadow: true` para encapsulamento de estilos.

### Props e Eventos

1. **Documentação:** Sempre documente props com JSDoc:
   ```tsx
   /**
    * Texto do botão
    */
   @Prop() label: string;
   ```

2. **Valores Padrão:** Sempre defina valores padrão para props opcionais.

3. **Eventos:** Sempre valide estado antes de emitir eventos (ex: não emitir se disabled).

### Performance

1. **OnPush Detection:** Quando usado no Angular, componentes Stencil funcionam bem com `ChangeDetectionStrategy.OnPush`.

2. **Shadow DOM:** Usa Shadow DOM para isolamento de estilos, mas pode impactar performance em muitos componentes.

## 🔧 Troubleshooting

### Componente não aparece na aplicação

1. **Verifique se o build foi executado:**
   ```bash
   npx nx build design-system
   ```

2. **Verifique se `defineCustomElements()` foi chamado:**
   - Deve estar no `main.ts` (Angular) ou equivalente

3. **Verifique se `CUSTOM_ELEMENTS_SCHEMA` está no módulo:**
   ```typescript
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
   ```

4. **Verifique o nome do tag:**
   - Use o nome exato: `design-system-search-button`
   - Case-sensitive!

### Erro de import do loader

Se receber erro `Cannot find module '@solutio/design-system/loader'`:

**Solução:** Use caminho relativo no `main.ts`:
```typescript
import { defineCustomElements } from '../../dist/design-system/loader';
```

### Eventos não funcionam no Angular

**Causa:** Eventos do Stencil precisam ser mapeados manualmente em algumas versões do Angular.

**Solução:** Use a sintaxe correta:
```html
<!-- ✅ Correto -->
(searchClick)="handler()"

<!-- ❌ Errado -->
onSearchClick="handler()"
```

### Estilos não aplicam

**Causa:** Shadow DOM pode isolar estilos.

**Solução:**
1. Verifique se o componente tem `shadow: true`
2. Use CSS custom properties (variáveis CSS) para estilização externa
3. Não use seletores globais dentro do componente

### TypeScript não reconhece o componente

**Solução:** Após o build, os tipos são gerados em `dist/design-system/types/`. Certifique-se de que o TypeScript está incluindo esses tipos.

## 📚 Recursos Adicionais

- [Documentação do Stencil](https://stenciljs.com/docs/introduction)
- [Web Components Standards](https://www.webcomponents.org/)
- [Angular + Web Components](https://angular.io/guide/elements)

## 🤝 Contribuindo

1. Crie componentes seguindo as convenções estabelecidas
2. Adicione testes para novos componentes
3. Documente props e eventos com JSDoc
4. Use BEM para estilização
5. Teste em pelo menos uma aplicação (Angular) antes de merge

---

**Última atualização:** Dezembro 2024

