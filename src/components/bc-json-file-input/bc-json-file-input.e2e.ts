import { newE2EPage } from '@stencil/core/testing';

describe('bc-json-file-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bc-json-file-input></bc-json-file-input>');

    const element = await page.find('bc-json-file-input');
    expect(element).toHaveClass('hydrated');
  });
});
