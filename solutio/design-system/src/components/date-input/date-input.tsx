import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'design-system-date-input',
  styleUrl: 'date-input.scss',
})
export class DateInput {
  @Prop() value: string = '';

  @Prop() name: string = '';

  @Prop() placeholder: string = '';

  @Prop() disabled: boolean = false;

  @Prop() required: boolean = false;

  @Prop() label: string = '';

  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  @Prop() min: string = '';

  @Prop() max: string = '';

  @Event() dateChange: EventEmitter<string>;

  @Event() dateInput: EventEmitter<string>;

  private handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.dateChange.emit(target.value);
  };

  private handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.dateInput.emit(target.value);
  };

  render() {
    const inputId = `date-input-${this.name || Math.random().toString(36).substr(2, 9)}`;

    return (
      <div class={`date-input date-input--${this.size}`}>
        {this.label && (
          <label htmlFor={inputId} class="date-input__label">
            {this.label}
            {this.required && <span class="date-input__required">*</span>}
          </label>
        )}
        <div class="date-input__wrapper">
          <input
            type="date"
            id={inputId}
            name={this.name}
            value={this.value}
            placeholder={this.placeholder}
            disabled={this.disabled}
            required={this.required}
            min={this.min || undefined}
            max={this.max || undefined}
            class="date-input__field"
            onInput={this.handleInput}
            onChange={this.handleChange}
          />
          <span class="date-input__icon" aria-hidden="true">
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
              focusable="false"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </span>
        </div>
      </div>
    );
  }
}

