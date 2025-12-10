import { newSpecPage } from '@stencil/core/testing';
import { Select } from './select';

describe('sds-select', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `<sds-select></sds-select>`,
    });
    expect(page.root!.shadowRoot!.querySelector('select')).toBeTruthy();
  });

  it('renders with placeholder', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `<sds-select placeholder="Choose an option"></sds-select>`,
    });
    const option = page.root!.shadowRoot!.querySelector('option');
    expect(option?.textContent).toBe('Choose an option');
    expect(option?.hasAttribute('disabled')).toBe(true);
  });

  it('handles disabled state', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `<sds-select disabled></sds-select>`,
    });
    expect(page.root!.shadowRoot!.querySelector('select')?.hasAttribute('disabled')).toBe(true);
  });

  it('handles multiple selection', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `<sds-select multiple></sds-select>`,
    });
    expect(page.root!.shadowRoot!.querySelector('select')?.hasAttribute('multiple')).toBe(true);
  });

  it('emits change event', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `<sds-select><option value="1">Option 1</option></sds-select>`,
    });
    
    const select = page.rootInstance;
    const changeSpy = jest.fn();
    select.sdsChange = { emit: changeSpy } as any;
    
    const nativeSelect = page.root!.shadowRoot!.querySelector('select') as HTMLSelectElement;
    nativeSelect.value = '1';
    nativeSelect.dispatchEvent(new Event('change'));
    
    await page.waitForChanges();
    
    expect(changeSpy).toHaveBeenCalledWith('1');
  });
});
