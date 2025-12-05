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

  @Event() sdsClick!: EventEmitter;

  private handleClick = (event: MouseEvent) => {
    if (!this.disabled) {
      this.sdsClick.emit(event);
    }
  };

  render() {
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
