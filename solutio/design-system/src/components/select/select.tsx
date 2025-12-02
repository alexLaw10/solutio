import { Component, Prop, Event, EventEmitter, h, Element } from '@stencil/core';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  tag: 'design-system-select',
  styleUrl: 'select.scss',
  shadow: true,
})
export class Select {
  @Element() el!: HTMLElement;

  @Prop() value: string = '';

  @Prop() name: string = '';

  @Prop() placeholder: string = 'Selecione uma opção';

  @Prop() disabled: boolean = false;

  @Prop() required: boolean = false;

  @Prop() label: string = '';

  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  @Prop() options: SelectOption[] | string = '[]';

  @Event() selectChange: EventEmitter<string>;

  private parsedOptions: SelectOption[] = [];
  private selectElement?: HTMLSelectElement;

  componentWillLoad() {
    if (typeof this.options === 'string') {
      try {
        this.parsedOptions = JSON.parse(this.options);
      } catch {
        this.parsedOptions = [];
      }
    } else {
      this.parsedOptions = this.options;
    }
  }

  componentDidLoad() {
    if (this.selectElement && this.value) {
      this.selectElement.value = this.value;
    }
  }

  componentWillUpdate() {
    if (this.selectElement && this.value) {
      this.selectElement.value = this.value;
    }
  }

  private handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.selectChange.emit(target.value);
  };

  render() {
    const selectId = `select-${this.name || Math.random().toString(36).substr(2, 9)}`;

    return (
      <div class={`select select--${this.size}`}>
        {this.label && (
          <label htmlFor={selectId} class="select__label">
            {this.label}
            {this.required && <span class="select__required">*</span>}
          </label>
        )}
        <div class="select__wrapper">
          <select
            id={selectId}
            name={this.name}
            disabled={this.disabled}
            required={this.required}
            class="select__field"
            onChange={this.handleChange}
            ref={(el) => {
              this.selectElement = el;
              if (el && this.value) {
                el.value = this.value;
              }
            }}
          >
            {this.placeholder && (
              <option value="" disabled hidden>
                {this.placeholder}
              </option>
            )}
            {this.parsedOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                selected={option.value === this.value}
              >
                {option.label}
              </option>
            ))}
          </select>
          <span class="select__icon" aria-hidden="true">
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
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
      </div>
    );
  }
}

