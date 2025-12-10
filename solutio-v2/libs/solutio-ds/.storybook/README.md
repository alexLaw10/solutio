# Storybook - Solutio Design System

Este diretório contém a configuração do Storybook para o Solutio Design System.

## Como usar

### Pré-requisitos

Antes de executar o Storybook, certifique-se de que os componentes Stencil foram compilados:

```bash
nx build solutio-ds
# ou
npm run build:ds
```

### Executar o Storybook

Para iniciar o servidor de desenvolvimento do Storybook:

```bash
npm run storybook
# ou do diretório raiz:
npm run storybook
```

O Storybook estará disponível em `http://localhost:6006`

### Build do Storybook

Para gerar uma build estática do Storybook:

```bash
npm run build-storybook
# ou do diretório raiz:
npm run build-storybook
```

## Estrutura

- `main.ts`: Configuração principal do Storybook
- `preview.ts`: Configuração de preview (carrega os componentes Stencil)

## Stories

As stories estão localizadas junto com os componentes em `src/components/*/`. Cada componente tem seu arquivo `.stories.ts` correspondente.

## Componentes disponíveis

- **Button** (`sds-button`): Componente de botão com múltiplas variantes
- **Alert** (`sds-alert`): Componente de alerta para mensagens
- **Select** (`sds-select`): Componente de seleção (dropdown)
- **Textarea** (`sds-textarea`): Componente de área de texto

## Adicionar novas stories

Para adicionar uma nova story para um componente:

1. Crie um arquivo `[component-name].stories.ts` na pasta do componente
2. Importe os tipos necessários do Storybook
3. Defina o `meta` com as informações do componente
4. Crie as stories usando `StoryObj` type

Exemplo:

```typescript
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/MyComponent',
  component: 'sds-my-component',
  // ...
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<sds-my-component></sds-my-component>`,
};
```
