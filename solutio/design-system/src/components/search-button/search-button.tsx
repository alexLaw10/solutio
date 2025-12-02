import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'design-system-search-button',
  styleUrl: 'search-button.scss',
  shadow: true,
})
export class SearchButton {
  /**
   * Text to display on the button
   */
  @Prop() label: string = 'Buscar';

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
  @Event() searchClick: EventEmitter<void>;

  private handleClick = () => {
    if (!this.disabled && !this.loading) {
      this.searchClick.emit();
    }
  };

  render() {
    const loadingText = this.loading ? 'Carregando...' : '';
    
    return (
      <button
        type={this.type}
        class={`search-button search-button--${this.variant} search-button--${this.size}`}
        disabled={this.disabled || this.loading}
        onClick={this.handleClick}
        aria-label={this.label}
        aria-busy={this.loading}
        aria-live={this.loading ? 'polite' : 'off'}
      >
        {this.loading ? (
          <span>
            <span class="search-button__loader" aria-hidden="true"></span>
            <span class="sr-only">{loadingText}</span>
          </span>
        ) : (
          <svg
            class="search-button__icon"
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
            focusable="false"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        )}
        <span class="search-button__label">{this.label}</span>
      </button>
    );
  }
}

