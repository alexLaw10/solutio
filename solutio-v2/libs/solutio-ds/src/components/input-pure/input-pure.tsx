import { Component, Prop, Event, h } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

@Component({
  tag: 'basic-input',
  shadow: true,
})
export class BasicInput {
  @Prop({ mutable: true }) value: string = '';
  @Prop() placeholder: string = '';
  @Prop() type: string = 'text';
  @Prop() disabled: boolean = false;

  @Event() valueChange!: EventEmitter<string>;

  private onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(this.value);
  }

  render() {
    return (
      <input
        class="basic-input"
        value={this.value}
        type={this.type}
        placeholder={this.placeholder}
        disabled={this.disabled}
        onInput={(e) => this.onInput(e)}
      />
    );
  }
}
