import { Component, Prop, h, Event, Watch } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

@Component({
  tag: 'sds-simple-input',
  shadow: true,
})
export class SimpleInput {
  @Prop() type: string = 'text';
  @Prop() placeholder?: string;
  @Prop() value?: string;
  @Prop() name?: string;
  @Prop() id?: string;
  @Prop() required: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() readonly: boolean = false;
  @Prop() min?: string | number;
  @Prop() max?: string | number;

  @Event() sdsInput!: EventEmitter<string>;
  @Event() sdsChange!: EventEmitter<string>;
  @Event() sdsFocus!: EventEmitter<FocusEvent>;
  @Event() sdsBlur!: EventEmitter<FocusEvent>;

  private nativeInput?: HTMLInputElement;
  private inputHasFocus: boolean = false;

  @Watch('value')
  valueChanged(newValue: string | undefined) {
    const value = newValue || '';
    
    // Só atualizar se o input não está focado (usuário não está interagindo)
    if (this.nativeInput && !this.inputHasFocus && value !== (this.nativeInput.value || '')) {
      this.nativeInput.value = value;
    }
  }

  componentDidLoad() {
    // Sincronizar valor inicial após carregamento completo
    if (this.nativeInput && this.value) {
      this.nativeInput.value = this.value;
    }
  }

  private handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.sdsInput.emit(newValue);
  };

  private handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.sdsChange.emit(newValue);
  };

  private handleFocus = (event: FocusEvent) => {
    this.inputHasFocus = true;
    this.sdsFocus.emit(event);
  };

  private handleBlur = (event: FocusEvent) => {
    this.inputHasFocus = false;
    this.sdsBlur.emit(event);
  };

  render() {
    return (
      <input
        ref={(el) => {
          if (el) {
            this.nativeInput = el as HTMLInputElement;
            if (this.value && !el.value) {
              el.value = this.value;
            }
          }
        }}
        type={this.type}
        placeholder={this.placeholder}
        name={this.name}
        id={this.id}
        required={this.required}
        disabled={this.disabled}
        readonly={this.readonly}
        min={this.min}
        max={this.max}
        onInput={this.handleInput}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    );
  }
}
