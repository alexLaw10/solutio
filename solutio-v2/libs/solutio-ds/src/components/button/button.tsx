import { Component, Prop, Event, h } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  tag: 'sds-button',
  styleUrl: 'button.scss',
  shadow: true,
})
export class Button {
  @Prop() variant: ButtonVariant = 'primary';
  @Prop() size: ButtonSize = 'md';
  @Prop() disabled: boolean = false;
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';
  @Prop() fullWidth: boolean = false;

  @Event() sdsClick!: EventEmitter<MouseEvent>;

  private handleClick = (event: MouseEvent) => {
    console.log('[SDS-BUTTON] handleClick chamado!', event);
    console.log('[SDS-BUTTON] Disabled?', this.disabled);
    
    if (!this.disabled) {
      console.log('[SDS-BUTTON] Emitindo evento sdsClick');
      this.sdsClick.emit(event);
      // Permitir que o evento continue para permitir submit do form nativo
      // O evento não é cancelado, então o form submit funcionará normalmente
    } else {
      console.log('[SDS-BUTTON] Botão desabilitado, evento não emitido');
    }
  };

  componentDidLoad() {
    console.log('[SDS-BUTTON] componentDidLoad - Botão carregado');
    console.log('[SDS-BUTTON] Variant:', this.variant);
    console.log('[SDS-BUTTON] Size:', this.size);
    console.log('[SDS-BUTTON] Disabled:', this.disabled);
    console.log('[SDS-BUTTON] Type:', this.type);
    
    // Verificar se o botão nativo está acessível
    const button = document.querySelector('sds-button')?.shadowRoot?.querySelector('button');
    if (button) {
      console.log('[SDS-BUTTON] Botão nativo encontrado:', button);
      console.log('[SDS-BUTTON] Botão nativo disabled?', button.disabled);
      console.log('[SDS-BUTTON] Botão nativo type:', button.type);
      
      // Adicionar listener direto para debug
      button.addEventListener('click', (e) => {
        console.log('[SDS-BUTTON] Click direto no botão nativo!', e);
      });
    } else {
      console.error('[SDS-BUTTON] ERRO: Botão nativo não encontrado!');
    }
  }

  render() {
    console.log('[SDS-BUTTON] render chamado - variant:', this.variant, 'disabled:', this.disabled, 'type:', this.type);
    return (
      <button
        class={{
          'sds-button': true,
          [`sds-button--${this.variant}`]: true,
          [`sds-button--${this.size}`]: true,
          'sds-button--full-width': this.fullWidth,
          'sds-button--disabled': this.disabled,
        }}
        type={this.type}
        disabled={this.disabled}
        onClick={this.handleClick}
      >
        <slot></slot>
      </button>
    );
  }
}
