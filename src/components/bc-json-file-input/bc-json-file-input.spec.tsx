import { newSpecPage } from '@stencil/core/testing';
import { BcJsonFileInput } from './bc-json-file-input';

describe('bc-json-file-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BcJsonFileInput],
      html: `<bc-json-file-input></bc-json-file-input>`,
    });
    expect(page.root).toEqualHtml(`
      <bc-json-file-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </bc-json-file-input>
    `);
  });
});
