import {
  fireEvent,
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
} from '@testing-library/dom';
import { JSDOM } from 'jsdom';

const testPath = './src/record-creator/record-creator.html';

describe('record-creator.html', () => {
  async function load(file) {
    let dom = await JSDOM.fromFile(file, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: `file://${__dirname}/`,
    });
    return new Promise((resolve) => {
      dom.window.addEventListener('load', () => {
        resolve({
          window: dom.window,
          document: dom.window.document,
        });
      });
    });
  }

  it('no renders a loading animation', async () => {
    let { document } = await load(testPath);

    const loadingElement = document.getElementById('loading');
    expect(loadingElement).not.toBeNull();
    expect(loadingElement.classList.contains('hide')).toBeTruthy();
  });

  test('renders current date when the page load', async () => {
    let { document } = await load(testPath);
    const dateField = document.getElementById('record-date');

    console.log(document.getElementById('record-date').value);
    expect(dateField.value.length).toBeGreaterThan(0);
  });
});
