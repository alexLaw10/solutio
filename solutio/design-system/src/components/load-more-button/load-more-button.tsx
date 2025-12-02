import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'design-system-load-more-button',
  styleUrl: 'load-more-button.scss',
  shadow: true,
})
export class LoadMoreButton {
  /**
   * Text to display on the button
   */
  @Prop() label: string = 'Carregar mais';

  /**
   * Loading text to display
   */
  @Prop() loadingLabel: string = 'Carregando...';

  /**
   * Disabled state
   */
  @Prop() disabled: boolean = false;

  /**
   * Loading state
   */
  @Prop() loading: boolean = false;

  /**
   * Button type (button, submit, reset)
   */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Button variant
   */
  @Prop() variant: 'primary' | 'secondary' = 'primary';

  /**
   * Size of the button
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Event emitted when button is clicked
   */
  @Event() loadMoreClick: EventEmitter<void>;

  private handleClick = () => {
    if (!this.disabled && !this.loading) {
      this.loadMoreClick.emit();
    }
  };

  render() {
    return (
      <button
        type={this.type}
        class={`load-more-button load-more-button--${this.variant} load-more-button--${this.size}`}
        disabled={this.disabled || this.loading}
        onClick={this.handleClick}
        aria-busy={this.loading}
        aria-live={this.loading ? 'polite' : 'off'}
      >
        {this.loading ? (
          <span class="load-more-button__loading">
            <span class="load-more-button__spinner" aria-hidden="true"></span>
            <span class="load-more-button__label">{this.loadingLabel}</span>
          </span>
        ) : (
          <span class="load-more-button__label">{this.label}</span>
        )}
      </button>
    );
  }
}

