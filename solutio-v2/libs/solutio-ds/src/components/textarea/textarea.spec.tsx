import { newSpecPage } from '@stencil/core/testing';
import { Textarea } from './textarea';

describe('sds-textarea', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `<sds-textarea></sds-textarea>`,
    });
    expect(page.root!.shadowRoot!.querySelector('textarea')).toBeTruthy();
  });

  it('handles disabled state', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `<sds-textarea disabled></sds-textarea>`,
    });
    expect(page.root!.shadowRoot!.querySelector('textarea')?.hasAttribute('disabled')).toBe(true);
  });

  it('emits input event', async () => {
    const page = await newSpecPage({
      components: [Textarea],
      html: `<sds-textarea></sds-textarea>`,
    });
    
    const textarea = page.rootInstance;
    const inputSpy = jest.fn();
    textarea.sdsInput = { emit: inputSpy } as any;
    
    const nativeTextarea = page.root!.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement;
    nativeTextarea.value = 'test';
    nativeTextarea.dispatchEvent(new Event('input'));
    
    await page.waitForChanges();
    
    expect(inputSpy).toHaveBeenCalledWith('test');
  });
});
