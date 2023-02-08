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

  test('renders same Fecha and Encargado after checkbox and click on Limpiar', async () => {
    let { document } = await load(testPath);

    /* fields */
    const dateField = document.getElementById('record-date');
    const dateCheckbox = document.getElementById('keep-date');
    const encargadoField = document.getElementById('user-list');
    const encargadoCheckbox = document.getElementById('keep-user-list');
    const productField = document.getElementById('item-list');
    const currentStockField = document.getElementById('current-stock');

    const limpiarButton = document.getElementById('clear-fields');

    /* static values */
    const encargadaFer = 'Fernanda Ruiz';
    const testProduct = 'Sal cocina';
    const dateValue = dateField.value;
    
    /*Active checkbox */
    dateCheckbox.checked = true;
    encargadoCheckbox.checked = true;

    /*Assing new values */
    encargadoField.value = encargadaFer;
    fireEvent.change(productField, { target: { value: testProduct } })

    /*Check load static value of current stock */
    expect(currentStockField.value).toBe("10");

    fireEvent.click(limpiarButton);

    expect(dateField.value).toBe(dateValue);
    expect(encargadoField.value).toBe(encargadaFer);
    expect(productField.value).not.toBe(testProduct);
  });
});
