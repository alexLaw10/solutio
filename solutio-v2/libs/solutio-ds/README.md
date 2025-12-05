# Solutio Design System (SDS)

Biblioteca de componentes reutilizáveis construída com Stencil.js para o projeto Solutio V2.

## Estrutura de Arquivos

```
solutio-ds/
├── src/
│   ├── components/          # Componentes do design system
│   │   ├── button/         # Componente de botão
│   │   │   ├── button.tsx
│   │   │   ├── button.scss
│   │   │   ├── button.spec.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── styles/             # Estilos globais e tokens
│   │   ├── tokens/         # Design tokens (cores, espaçamento, tipografia, etc.)
│   │   │   ├── _colors.scss
│   │   │   ├── _spacing.scss
│   │   │   ├── _typography.scss
│   │   │   ├── _borders.scss
│   │   │   ├── _shadows.scss
│   │   │   └── _index.scss
│   │   ├── base/           # Estilos base e reset
│   │   │   └── _reset.scss
│   │   └── _global.scss    # Estilos globais
│   └── index.ts
├── stencil.config.ts       # Configuração do Stencil
├── project.json            # Configuração NX
└── package.json
```

## Componentes

### Button (`sds-button`)

Componente de botão estilizado com múltiplas variantes e tamanhos.

#### Props

- `variant`: `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost'` (padrão: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (padrão: `'md'`)
- `disabled`: `boolean` (padrão: `false`)
- `type`: `'button' | 'submit' | 'reset'` (padrão: `'button'`)
- `fullWidth`: `boolean` (padrão: `false`)

#### Eventos

- `sdsClick`: Emitido quando o botão é clicado

#### Exemplo de Uso

```html
<!-- Angular -->
<sds-button variant="primary" size="md" (sdsClick)="handleClick($event)">
  Clique em mim
</sds-button>

<sds-button variant="outline" size="lg" disabled>
  Desabilitado
</sds-button>

<sds-button variant="success" full-width>
  Botão Full Width
</sds-button>
```

## Design Tokens

O design system utiliza CSS Custom Properties (variáveis CSS) para definir tokens de design:

- **Cores**: Definidas em `styles/tokens/_colors.scss`
- **Espaçamento**: Definidas em `styles/tokens/_spacing.scss`
- **Tipografia**: Definidas em `styles/tokens/_typography.scss`
- **Bordas**: Definidas em `styles/tokens/_borders.scss`
- **Sombras**: Definidas em `styles/tokens/_shadows.scss`

## Build

Para compilar os componentes Stencil:

```bash
npm run build:ds
# ou
nx build solutio-ds
```

## Testes

Para executar os testes:

```bash
npm run test:ds
# ou
nx test solutio-ds
```

## Integração com Angular

Os componentes Stencil são integrados no Angular através de Custom Elements. O loader é importado em `apps/dashboard/src/app/stencil-components.ts` e os componentes podem ser usados diretamente nos templates Angular.

Certifique-se de que o build do Stencil seja executado antes do build do Angular (configurado automaticamente via `dependsOn` no `project.json`).
