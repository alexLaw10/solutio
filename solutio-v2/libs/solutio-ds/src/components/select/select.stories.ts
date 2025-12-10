import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Select',
  component: 'sds-select',
  parameters: {
    docs: {
      description: {
        component: 'Componente de seleção (dropdown) estilizado.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nome do campo (para formulários)',
    },
    id: {
      control: 'text',
      description: 'ID do elemento',
    },
    value: {
      control: 'text',
      description: 'Valor selecionado',
    },
    required: {
      control: 'boolean',
      description: 'Campo obrigatório',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo',
    },
    placeholder: {
      control: 'text',
      description: 'Texto placeholder',
    },
    multiple: {
      control: 'boolean',
      description: 'Permite seleção múltipla',
    },
    size: {
      control: 'number',
      description: 'Número de opções visíveis (para múltipla seleção)',
    },
    onChange: {
      action: 'changed',
      description: 'Evento disparado quando o valor muda',
    },
  },
};

export default meta;
type Story = StoryObj;

const defaultOptions = [
  { value: '1', label: 'Opção 1' },
  { value: '2', label: 'Opção 2' },
  { value: '3', label: 'Opção 3' },
  { value: '4', label: 'Opção 4' },
];

export const Default: Story = {
  args: {
    name: 'select-example',
    placeholder: 'Selecione uma opção',
    required: false,
    disabled: false,
    multiple: false,
  },
  render: (args) => {
    const optionsJson = JSON.stringify(defaultOptions);
    return html`
      <sds-select
        name=${args.name || ''}
        placeholder=${args.placeholder || ''}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?multiple=${args.multiple}
        .options=${defaultOptions}
        @sdsChange=${args.onChange}
      ></sds-select>
    `;
  },
};

export const WithValue: Story = {
  render: () => html`
    <sds-select
      name="select-with-value"
      value="2"
      .options=${defaultOptions}
    ></sds-select>
  `,
};

export const Required: Story = {
  render: () => html`
    <form @submit=${(e: Event) => { e.preventDefault(); }}>
      <sds-select
        name="required-select"
        placeholder="Selecione uma opção (obrigatório)"
        required
        .options=${defaultOptions}
      ></sds-select>
      <sds-button type="submit" variant="primary" style="margin-top: 1rem;">
        Enviar
      </sds-button>
    </form>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <sds-select
      name="disabled-select"
      disabled
      value="2"
      .options=${defaultOptions}
    ></sds-select>
  `,
};

export const Multiple: Story = {
  render: () => html`
    <sds-select
      name="multiple-select"
      multiple
      size="4"
      .options=${[
        { value: '1', label: 'Opção 1' },
        { value: '2', label: 'Opção 2' },
        { value: '3', label: 'Opção 3' },
        { value: '4', label: 'Opção 4' },
        { value: '5', label: 'Opção 5' },
        { value: '6', label: 'Opção 6' },
      ]}
    ></sds-select>
  `,
};

export const WithDisabledOptions: Story = {
  render: () => html`
    <sds-select
      name="select-disabled-options"
      .options=${[
        { value: '1', label: 'Opção 1' },
        { value: '2', label: 'Opção 2 (desabilitada)', disabled: true },
        { value: '3', label: 'Opção 3' },
        { value: '4', label: 'Opção 4 (desabilitada)', disabled: true },
        { value: '5', label: 'Opção 5' },
      ]}
    ></sds-select>
  `,
};

export const ManyOptions: Story = {
  render: () => {
    const manyOptions = Array.from({ length: 20 }, (_, i) => ({
      value: String(i + 1),
      label: `Opção ${i + 1}`,
    }));
    return html`
      <sds-select
        name="select-many-options"
        placeholder="Selecione uma opção"
        .options=${manyOptions}
      ></sds-select>
    `;
  },
};
