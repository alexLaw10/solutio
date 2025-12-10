import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'sds-textarea',
  parameters: {
    docs: {
      description: {
        component: 'Componente de área de texto (textarea) estilizado.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Texto placeholder',
    },
    value: {
      control: 'text',
      description: 'Valor do textarea',
    },
    name: {
      control: 'text',
      description: 'Nome do campo (para formulários)',
    },
    id: {
      control: 'text',
      description: 'ID do elemento',
    },
    required: {
      control: 'boolean',
      description: 'Campo obrigatório',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo',
    },
    readonly: {
      control: 'boolean',
      description: 'Campo somente leitura',
    },
    rows: {
      control: 'number',
      description: 'Número de linhas visíveis',
    },
    cols: {
      control: 'number',
      description: 'Número de colunas visíveis',
    },
    minlength: {
      control: 'number',
      description: 'Comprimento mínimo do texto',
    },
    maxlength: {
      control: 'number',
      description: 'Comprimento máximo do texto',
    },
    resize: {
      control: 'select',
      options: ['none', 'both', 'horizontal', 'vertical'],
      description: 'Tipo de redimensionamento permitido',
    },
    onInput: {
      action: 'input',
      description: 'Evento disparado quando o valor é digitado',
    },
    onChange: {
      action: 'changed',
      description: 'Evento disparado quando o valor muda',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    placeholder: 'Digite sua mensagem aqui...',
    value: '',
    required: false,
    disabled: false,
    readonly: false,
    rows: 4,
    resize: 'vertical',
  },
  render: (args) => html`
    <sds-textarea
      placeholder=${args.placeholder || ''}
      value=${args.value || ''}
      name=${args.name || ''}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      rows=${args.rows || 4}
      cols=${args.cols || undefined}
      minlength=${args.minlength || undefined}
      maxlength=${args.maxlength || undefined}
      resize=${args.resize || 'vertical'}
      @sdsInput=${args.onInput}
      @sdsChange=${args.onChange}
    ></sds-textarea>
  `,
};

export const WithValue: Story = {
  render: () => html`
    <sds-textarea
      value="Este é um texto pré-preenchido no textarea."
      rows="4"
    ></sds-textarea>
  `,
};

export const Required: Story = {
  render: () => html`
    <form @submit=${(e: Event) => { e.preventDefault(); }}>
      <sds-textarea
        name="required-textarea"
        placeholder="Digite sua mensagem (obrigatório)"
        required
        rows="4"
      ></sds-textarea>
      <sds-button type="submit" variant="primary" style="margin-top: 1rem;">
        Enviar
      </sds-button>
    </form>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <sds-textarea
      value="Este textarea está desabilitado e não pode ser editado."
      disabled
      rows="4"
    ></sds-textarea>
  `,
};

export const Readonly: Story = {
  render: () => html`
    <sds-textarea
      value="Este textarea está em modo somente leitura."
      readonly
      rows="4"
    ></sds-textarea>
  `,
};

export const WithLengthLimit: Story = {
  render: () => html`
    <sds-textarea
      placeholder="Digite até 100 caracteres"
      minlength="10"
      maxlength="100"
      rows="4"
    ></sds-textarea>
    <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #666;">
      Mínimo: 10 caracteres | Máximo: 100 caracteres
    </p>
  `,
};

export const ResizeOptions: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Resize: none</label>
        <sds-textarea resize="none" rows="3" placeholder="Não pode redimensionar"></sds-textarea>
      </div>
      <div>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Resize: vertical</label>
        <sds-textarea resize="vertical" rows="3" placeholder="Pode redimensionar verticalmente"></sds-textarea>
      </div>
      <div>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Resize: horizontal</label>
        <sds-textarea resize="horizontal" rows="3" placeholder="Pode redimensionar horizontalmente"></sds-textarea>
      </div>
      <div>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Resize: both</label>
        <sds-textarea resize="both" rows="3" placeholder="Pode redimensionar em ambas direções"></sds-textarea>
      </div>
    </div>
  `,
};

export const DifferentSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">3 linhas</label>
        <sds-textarea rows="3" placeholder="Textarea com 3 linhas"></sds-textarea>
      </div>
      <div>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">6 linhas</label>
        <sds-textarea rows="6" placeholder="Textarea com 6 linhas"></sds-textarea>
      </div>
      <div>
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">10 linhas</label>
        <sds-textarea rows="10" placeholder="Textarea com 10 linhas"></sds-textarea>
      </div>
    </div>
  `,
};
