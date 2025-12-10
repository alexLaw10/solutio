import { Component, Prop, h, Event, Watch } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  tag: 'sds-select',
  styleUrl: 'select.scss',
  shadow: true,
})
export class Select {
  @Prop() name?: string;
  @Prop() id?: string;
  @Prop() value?: string;
  @Prop() required: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() placeholder?: string;
  @Prop() multiple: boolean = false;
  @Prop() size?: number;
  @Prop() options: SelectOption[] = [];

  @Event() sdsChange!: EventEmitter<string | string[]>;
  @Event() sdsFocus!: EventEmitter<FocusEvent>;
  @Event() sdsBlur!: EventEmitter<FocusEvent>;

  private nativeSelect?: HTMLSelectElement;

  @Watch('value')
  valueChanged(newValue: string | undefined) {
    if (this.nativeSelect && this.nativeSelect.value !== newValue) {
      this.nativeSelect.value = newValue || '';
    }
  }

  componentDidLoad() {
    if (this.nativeSelect) {
      if (this.value !== undefined) {
        this.nativeSelect.value = this.value;
      }
      // Garantir que o valor inicial seja aplicado
      this.valueChanged(this.value);
    }
  }

  componentDidUpdate() {
    // Garantir sincronização após atualizações
    if (this.nativeSelect && this.value !== undefined) {
      if (this.nativeSelect.value !== this.value) {
        this.nativeSelect.value = this.value;
      }
    }
  }

  private handleChange = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    const value = this.multiple
      ? Array.from(select.selectedOptions).map(option => option.value)
      : select.value;
    this.sdsChange.emit(value);
  };

  private handleFocus = (event: FocusEvent) => {
    this.sdsFocus.emit(event);
  };

  private handleBlur = (event: FocusEvent) => {
    this.sdsBlur.emit(event);
  };

  // Public method to get the native select element
  public getNativeSelect(): HTMLSelectElement | undefined {
    return this.nativeSelect;
  }

  // Public method to get the current value
  public getValue(): string | string[] {
    if (!this.nativeSelect) {
      return this.multiple ? [] : '';
    }
    return this.multiple
      ? Array.from(this.nativeSelect.selectedOptions).map(option => option.value)
      : this.nativeSelect.value;
  }

  render() {
    return (
      <select
        ref={(el) => (this.nativeSelect = el as HTMLSelectElement)}
        name={this.name}
        id={this.id}
        required={this.required}
        disabled={this.disabled}
        multiple={this.multiple}
        size={this.size}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        class="sds-select"
      >
        {this.placeholder && !this.multiple && (
          <option value="" disabled selected={!this.value}>
            {this.placeholder}
          </option>
        )}
        {this.options.map(option => (
          <option 
            key={option.value} 
            value={option.value} 
            disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
}
