import { Component, Prop, h, Event, Watch, State } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

@Component({
  tag: 'sds-textarea',
  styleUrl: 'textarea.scss',
  shadow: true,
})
export class Textarea {
  @Prop() placeholder?: string;
  @Prop() value?: string;
  @Prop() name?: string;
  @Prop() id?: string;
  @Prop() required: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() readonly: boolean = false;
  @Prop() rows?: number;
  @Prop() cols?: number;
  @Prop() minlength?: number;
  @Prop() maxlength?: number;
  @Prop() resize: 'none' | 'both' | 'horizontal' | 'vertical' = 'vertical';

  @Event() sdsInput!: EventEmitter<string>;
  @Event() sdsChange!: EventEmitter<string>;
  @Event() sdsFocus!: EventEmitter<FocusEvent>;
  @Event() sdsBlur!: EventEmitter<FocusEvent>;

  private nativeTextarea?: HTMLTextAreaElement;
  @State() private internalValue: string = '';

  @Watch('value')
  valueChanged(newValue: string | undefined) {
    const value = newValue || '';
    if (this.internalValue !== value) {
      this.internalValue = value;
      if (this.nativeTextarea && this.nativeTextarea.value !== value) {
        this.nativeTextarea.value = value;
      }
    }
  }

  componentDidLoad() {
    this.internalValue = this.value || '';
    if (this.nativeTextarea) {
      this.nativeTextarea.value = this.internalValue;
    }
  }

  private handleInput = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    this.internalValue = textarea.value;
    this.sdsInput.emit(textarea.value);
  };

  private handleChange = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    this.internalValue = textarea.value;
    this.sdsChange.emit(textarea.value);
  };

  private handleFocus = (event: FocusEvent) => {
    this.sdsFocus.emit(event);
  };

  private handleBlur = (event: FocusEvent) => {
    this.sdsBlur.emit(event);
  };

  // Public method to get the native textarea element
  public getNativeTextarea(): HTMLTextAreaElement | undefined {
    return this.nativeTextarea;
  }

  // Public method to get the current value
  public getValue(): string {
    return this.nativeTextarea?.value || '';
  }

  render() {
    return (
      <textarea
        ref={(el) => (this.nativeTextarea = el as HTMLTextAreaElement)}
        placeholder={this.placeholder}
        value={this.internalValue}
        name={this.name}
        id={this.id}
        required={this.required}
        disabled={this.disabled}
        readonly={this.readonly}
        rows={this.rows}
        cols={this.cols}
        minlength={this.minlength}
        maxlength={this.maxlength}
        onInput={this.handleInput}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        class={`sds-textarea sds-textarea--resize-${this.resize}`}
        style={{
          resize: this.resize,
        }}
      />
    );
  }
}
