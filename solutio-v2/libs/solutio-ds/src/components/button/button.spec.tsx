import { newSpecPage } from '@stencil/core/testing';
import { Button } from './button';

describe('sds-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<sds-button></sds-button>`,
    });
    expect(page.root).toEqualHtml(`
      <sds-button>
        <mock:shadow-root>
          <button class="sds-button sds-button--primary sds-button--md" type="button">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </sds-button>
    `);
  });
});
