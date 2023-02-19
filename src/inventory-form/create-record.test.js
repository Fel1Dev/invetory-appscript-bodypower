import {
  fireEvent,
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
} from '@testing-library/dom';
import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';

const testPath = './src/record-creator/inventory-form-page.html';

describe('Record Creator UI', () => {
  const BAJA_VALUE = 'BAJA';
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

  const getCommonFields = (document) => {
    return {
      dateField: document.getElementById('record-date'),
      dateCheckbox: document.getElementById('keep-date'),
      encargadoField: document.getElementById('user-list'),
      encargadoCheckbox: document.getElementById('keep-user-list'),
      productField: document.getElementById('item-list'),
      currentStockField: document.getElementById('current-stock'),
    };
  };

  const getStockFields = (document) => {
    return {
      newStock: document.getElementById('new-stock'),
      differenceField: document.getElementById('difference'),
      outputFields: document.getElementById('new-stock-output-fields'),
      stockOutType: document.getElementById('stock-output-type-list'),
      stockOutputDesc: document.getElementById('new-output-desc'),
      inputFields: document.getElementById('new-stock-input-fields'),
      stockInvoice: document.getElementById('stock-invoice'),
      stockAmount: document.getElementById('stock-amount'),
    };
  };

  const getInputFields = (document) => {
    return {
      invoice: document.getElementById('invoice'),
      amount: document.getElementById('amount'),
      quantity: document.getElementById('quantity'),
      finalStockInput: document.getElementById('final-stock-input'),
    };
  };

  function getOutputFields(document) {
    return {
      outQuantity: document.getElementById('out-quantity'),
      finalStockOut: document.getElementById('final-stock-out'),
      outputTypeList: document.getElementById('output-type-list'),
      outputDescription: document.getElementById('output-description'),
    };
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

    expect(dateField.value.length).toBeGreaterThan(0);
  });

  test('renders same Fecha and Encargado after checkbox and click on Limpiar', async () => {
    let { document } = await load(testPath);

    /* fields */
    const commonFields = getCommonFields(document);

    const limpiarButton = document.getElementById('clear-fields');

    /* static values */
    const encargadaFer = 'Fernanda Ruiz';
    const testProduct = 'Sal cocina';
    const dateValue = commonFields.dateField.value;

    /*Active checkbox */
    commonFields.dateCheckbox.checked = true;
    commonFields.encargadoCheckbox.checked = true;

    /*Assing new values */
    commonFields.encargadoField.value = encargadaFer;
    fireEvent.change(commonFields.productField, { target: { value: testProduct } });

    /*Check load static value of current stock */
    expect(commonFields.currentStockField.value).toBe('10');

    fireEvent.click(limpiarButton);

    expect(commonFields.dateField.value).toBe(dateValue);
    expect(commonFields.encargadoField.value).toBe(encargadaFer);
    expect(commonFields.productField.value).not.toBe(testProduct);
  });

  test('renders difference value', async () => {
    let { document } = await load(testPath);

    const productField = document.getElementById('item-list');
    const currentStockField = document.getElementById('current-stock');

    const stockFields = getStockFields(document);

    const testProduct = 'Sal cocina';
    const currentStockInput = 5;

    expect(stockFields.stockOutputDesc).toBeDisabled();

    fireEvent.change(productField, { target: { value: testProduct } });
    expect(currentStockField.value).toBe('10');

    fireEvent.input(stockFields.newStock, { target: { value: currentStockInput } });
    expect(stockFields.differenceField.value).toBe('-5');
    expect(stockFields.outputFields).not.toBeDisabled();

    fireEvent.input(stockFields.stockOutType, { target: { value: BAJA_VALUE } });
    expect(stockFields.stockOutputDesc).not.toBeDisabled();
  });

  test("renders disabled fields while product isn't has value", async () => {
    let { document } = await load(testPath);

    const newStockTab = document.getElementById('new-stock-tab');
    const inputTab = document.getElementById('input-tab');
    const outputTab = document.getElementById('output-tab');

    const stockFields = getStockFields(document);
    const inputFields = getInputFields(document);
    const outputFields = getOutputFields(document);

    fireEvent.click(inputTab);

    expect(inputFields.invoice).toBeDisabled();
    expect(inputFields.amount).toBeDisabled();
    expect(inputFields.quantity).toBeDisabled();
    expect(inputFields.finalStockInput).toBeDisabled();

    fireEvent.click(outputTab);

    expect(outputFields.outQuantity).toBeDisabled();
    expect(outputFields.finalStockOut).toBeDisabled();
    expect(outputFields.outputTypeList).toBeDisabled();
    expect(outputFields.outputDescription).toBeDisabled();

    fireEvent.click(newStockTab);

    expect(stockFields.newStock).toBeDisabled();
    expect(stockFields.differenceField).toBeDisabled();
    expect(stockFields.outputFields).not.toBeVisible();
    expect(stockFields.inputFields).not.toBeVisible();
  });

  test('renders input and output values according with new stock field', async () => {
    let { document } = await load(testPath);

    const productField = document.getElementById('item-list');
    const stockFields = getStockFields(document);
    const testProduct = 'Sal cocina';
    const smallerStock = 5;
    const biggerStock = 20;

    fireEvent.change(productField, { target: { value: testProduct } });

    fireEvent.input(stockFields.newStock, { target: { value: smallerStock } });

    expect(stockFields.outputFields).toBeVisible();
    expect(stockFields.stockOutType).not.toBeDisabled();
    expect(stockFields.stockAmount).toBeDisabled();

    fireEvent.input(stockFields.newStock, { target: { value: biggerStock } });

    expect(stockFields.inputFields).toBeVisible();
    expect(stockFields.stockAmount).not.toBeDisabled();
    expect(stockFields.stockOutType).toBeDisabled();
  });

  test('renders input final value after put values on input tab', async () => {
    let { document } = await load(testPath);

    const productField = document.getElementById('item-list');
    const inputFields = getInputFields(document);
    const inputTab = document.getElementById('input-tab');

    const testProduct = 'Sal cocina';
    const inputQuantity = 20;

    fireEvent.change(productField, { target: { value: testProduct } });

    fireEvent.click(inputTab);

    expect(inputFields.amount).not.toBeDisabled();

    fireEvent.input(inputFields.quantity, { target: { value: inputQuantity } });

    expect(inputFields.finalStockInput.value).toBe('30');
    expect(inputFields.finalStockInput).toBeDisabled();
  });

  test('renders oputput final value after put values on ouput tab', async () => {
    let { document } = await load(testPath);

    const productField = document.getElementById('item-list');
    const outputFields = getOutputFields(document);
    const ouputTab = document.getElementById('output-tab');

    const testProduct = 'Sal cocina';
    const outputQuantity = 5;

    fireEvent.change(productField, { target: { value: testProduct } });

    fireEvent.click(ouputTab);

    expect(outputFields.outputTypeList).not.toBeDisabled();

    fireEvent.input(outputFields.outQuantity, { target: { value: outputQuantity } });
    expect(outputFields.finalStockOut.value).toBe('5');
    expect(outputFields.finalStockOut).toBeDisabled();
    expect(outputFields.outputDescription).toBeDisabled();

    fireEvent.input(outputFields.outputTypeList, { target: { value: BAJA_VALUE } });

    expect(outputFields.outputDescription).not.toBeDisabled();
  });
});
