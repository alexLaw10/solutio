import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Alert',
  component: 'sds-alert',
  parameters: {
    docs: {
      description: {
        component: 'Componente de alerta para exibir mensagens informativas, de sucesso, aviso ou erro.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['error', 'success', 'warning', 'info'],
      description: 'Variante visual do alerta',
    },
    title: {
      control: 'text',
      description: 'Título do alerta',
    },
    message: {
      control: 'text',
      description: 'Mensagem do alerta',
    },
    dismissible: {
      control: 'boolean',
      description: 'Permite fechar o alerta',
    },
    visible: {
      control: 'boolean',
      description: 'Controla a visibilidade do alerta',
    },
    onDismiss: {
      action: 'dismissed',
      description: 'Evento disparado quando o alerta é fechado',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Informação',
    message: 'Esta é uma mensagem informativa.',
    dismissible: false,
    visible: true,
  },
  render: (args) => html`
    <sds-alert
      variant=${args.variant}
      title=${args.title || ''}
      message=${args.message || ''}
      ?dismissible=${args.dismissible}
      ?visible=${args.visible}
      @sdsDismiss=${args.onDismiss}
    ></sds-alert>
  `,
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Sucesso!',
    message: 'Operação realizada com sucesso.',
    dismissible: false,
    visible: true,
  },
  render: (args) => html`
    <sds-alert
      variant=${args.variant}
      title=${args.title || ''}
      message=${args.message || ''}
      ?dismissible=${args.dismissible}
      ?visible=${args.visible}
      @sdsDismiss=${args.onDismiss}
    ></sds-alert>
  `,
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Atenção',
    message: 'Esta é uma mensagem de aviso.',
    dismissible: false,
    visible: true,
  },
  render: (args) => html`
    <sds-alert
      variant=${args.variant}
      title=${args.title || ''}
      message=${args.message || ''}
      ?dismissible=${args.dismissible}
      ?visible=${args.visible}
      @sdsDismiss=${args.onDismiss}
    ></sds-alert>
  `,
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Erro',
    message: 'Ocorreu um erro ao processar sua solicitação.',
    dismissible: false,
    visible: true,
  },
  render: (args) => html`
    <sds-alert
      variant=${args.variant}
      title=${args.title || ''}
      message=${args.message || ''}
      ?dismissible=${args.dismissible}
      ?visible=${args.visible}
      @sdsDismiss=${args.onDismiss}
    ></sds-alert>
  `,
};

export const Dismissible: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <sds-alert variant="info" title="Alerta Dismissible" message="Este alerta pode ser fechado." dismissible></sds-alert>
      <sds-alert variant="success" title="Sucesso" message="Operação concluída!" dismissible></sds-alert>
      <sds-alert variant="warning" title="Atenção" message="Verifique os dados informados." dismissible></sds-alert>
      <sds-alert variant="error" title="Erro" message="Algo deu errado." dismissible></sds-alert>
    </div>
  `,
};

export const WithCustomContent: Story = {
  render: () => html`
    <sds-alert variant="info" title="Alerta com Conteúdo Customizado">
      <div slot="content">
        <p>Este alerta usa o slot de conteúdo para exibir HTML customizado.</p>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    </sds-alert>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <sds-alert variant="info" title="Info" message="Mensagem informativa"></sds-alert>
      <sds-alert variant="success" title="Success" message="Mensagem de sucesso"></sds-alert>
      <sds-alert variant="warning" title="Warning" message="Mensagem de aviso"></sds-alert>
      <sds-alert variant="error" title="Error" message="Mensagem de erro"></sds-alert>
    </div>
  `,
};
