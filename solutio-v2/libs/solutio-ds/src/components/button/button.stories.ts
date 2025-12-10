import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Button',
  component: 'sds-button',
  parameters: {
    docs: {
      description: {
        component: 'Componente de botão estilizado com múltiplas variantes e tamanhos.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost'],
      description: 'Variante visual do botão',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho do botão',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o botão',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Tipo do botão HTML',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Faz o botão ocupar toda a largura disponível',
    },
    onClick: {
      action: 'clicked',
      description: 'Evento disparado quando o botão é clicado',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
    fullWidth: false,
  },
  render: (args) => html`
    <sds-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      type=${args.type}
      ?full-width=${args.fullWidth}
      @sdsClick=${args.onClick}
    >
      Clique em mim
    </sds-button>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
      <sds-button variant="primary">Primary</sds-button>
      <sds-button variant="secondary">Secondary</sds-button>
      <sds-button variant="success">Success</sds-button>
      <sds-button variant="danger">Danger</sds-button>
      <sds-button variant="warning">Warning</sds-button>
      <sds-button variant="info">Info</sds-button>
      <sds-button variant="outline">Outline</sds-button>
      <sds-button variant="ghost">Ghost</sds-button>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      <sds-button variant="primary" size="sm">Small</sds-button>
      <sds-button variant="primary" size="md">Medium</sds-button>
      <sds-button variant="primary" size="lg">Large</sds-button>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <sds-button variant="primary" disabled>Disabled Primary</sds-button>
      <sds-button variant="outline" disabled>Disabled Outline</sds-button>
      <sds-button variant="ghost" disabled>Disabled Ghost</sds-button>
    </div>
  `,
};

export const FullWidth: Story = {
  render: () => html`
    <div style="width: 400px;">
      <sds-button variant="primary" full-width style="margin-bottom: 1rem;">
        Full Width Button
      </sds-button>
      <sds-button variant="outline" full-width>
        Another Full Width
      </sds-button>
    </div>
  `,
};

export const ButtonTypes: Story = {
  render: () => html`
    <form @submit=${(e: Event) => { e.preventDefault(); alert('Form submitted!'); }}>
      <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
        <sds-button type="button" variant="primary">Button</sds-button>
        <sds-button type="submit" variant="success">Submit</sds-button>
        <sds-button type="reset" variant="outline">Reset</sds-button>
      </div>
    </form>
  `,
};
