import { newSpecPage } from '@stencil/core/testing';
import { Alert } from './alert';

describe('sds-alert', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [Alert],
      html: `<sds-alert></sds-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <sds-alert>
        <mock:shadow-root>
          <div class="sds-alert sds-alert--info" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="sds-alert__content">
              <div class="sds-alert__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div class="sds-alert__message"></div>
            </div>
          </div>
        </mock:shadow-root>
      </sds-alert>
    `);
  });

  it('renders with title and message', async () => {
    const page = await newSpecPage({
      components: [Alert],
      html: `<sds-alert title="Test Title" message="Test Message"></sds-alert>`,
    });
    expect(page.root!.shadowRoot!.querySelector('.sds-alert__title')?.textContent).toBe('Test Title');
    expect(page.root!.shadowRoot!.querySelector('.sds-alert__description')?.textContent).toBe('Test Message');
  });

  it('renders different variants', async () => {
    const variants: Array<'error' | 'success' | 'warning' | 'info'> = ['error', 'success', 'warning', 'info'];
    
    for (const variant of variants) {
      const page = await newSpecPage({
        components: [Alert],
        html: `<sds-alert variant="${variant}"></sds-alert>`,
      });
      expect(page.root!.shadowRoot!.querySelector('.sds-alert')?.classList.contains(`sds-alert--${variant}`)).toBe(true);
    }
  });

  it('hides when visible is false', async () => {
    const page = await newSpecPage({
      components: [Alert],
      html: `<sds-alert visible="false"></sds-alert>`,
    });
    expect(page.root!.shadowRoot!.querySelector('.sds-alert')).toBeNull();
  });

  it('shows close button when dismissible', async () => {
    const page = await newSpecPage({
      components: [Alert],
      html: `<sds-alert dismissible="true"></sds-alert>`,
    });
    expect(page.root!.shadowRoot!.querySelector('.sds-alert__close')).toBeTruthy();
  });

  it('emits dismiss event when close is clicked', async () => {
    const page = await newSpecPage({
      components: [Alert],
      html: `<sds-alert dismissible="true"></sds-alert>`,
    });
    
    const alert = page.rootInstance;
    const dismissSpy = jest.fn();
    alert.sdsDismiss = { emit: dismissSpy } as any;
    
    const closeButton = page.root!.shadowRoot!.querySelector('.sds-alert__close') as HTMLElement;
    closeButton.click();
    
    await page.waitForChanges();
    
    expect(dismissSpy).toHaveBeenCalled();
  });
});
