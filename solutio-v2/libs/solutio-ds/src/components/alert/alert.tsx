import { Component, Prop, Event, h, State } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

export type AlertVariant = 'error' | 'success' | 'warning' | 'info';

@Component({
  tag: 'sds-alert',
  styleUrl: 'alert.scss',
  shadow: true,
})
export class Alert {
  @Prop() variant: AlertVariant = 'info';
  @Prop() title?: string;
  @Prop() message?: string;
  @Prop() dismissible: boolean = false;
  @Prop({ mutable: true, reflect: true }) visible: boolean = true;

  @State() internalVisible: boolean = true;

  @Event() sdsDismiss!: EventEmitter;

  private handleDismiss = () => {
    this.internalVisible = false;
    this.visible = false;
    this.sdsDismiss.emit();
  };

  componentWillLoad() {
    this.internalVisible = this.visible;
  }

  componentWillUpdate() {
    if (this.visible !== this.internalVisible) {
      this.internalVisible = this.visible;
    }
  }

  private getIconSvg() {
    switch (this.variant) {
      case 'error':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case 'success':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'warning':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  }

  render() {
    if (!this.internalVisible) {
      return null;
    }

    return (
      <div
        class={{
          'sds-alert': true,
          [`sds-alert--${this.variant}`]: true,
        }}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="sds-alert__content">
          <div class="sds-alert__icon" aria-hidden="true">
            {this.getIconSvg()}
          </div>
          <div class="sds-alert__message">
            {this.title && <p class="sds-alert__title">{this.title}</p>}
            {this.message && <p class="sds-alert__description">{this.message}</p>}
            <slot name="content"></slot>
          </div>
          {this.dismissible && (
            <button
              class="sds-alert__close"
              onClick={this.handleDismiss}
              aria-label="Fechar alerta"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
}
