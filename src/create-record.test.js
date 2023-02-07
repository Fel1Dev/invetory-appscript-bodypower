const { fireEvent, getByText } = require('@testing-library/dom');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');
// import { fireEvent, getByText } from '@testing-library/dom';
// import '@testing-library/jest-dom/extend-expect';
// import { JSDOM } from 'jsdom';
// import fs from 'fs';
// import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, './create-record.test.js'), 'utf8');

let dom;
let container;

describe('index.html', () => {
  beforeEach(() => {
    // Constructing a new JSDOM with this option is the key
    // to getting the code in the script tag to execute.
    // This is indeed dangerous and should only be done with trusted content.
    // https://github.com/jsdom/jsdom#executing-scripts
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    container = dom.window.document.body;
  });

  it('renders a heading element', () => {
    // const titleContainer = container.getElementsByClassName('record-form--title');
    expect(container.getElementsByClassName('record-form--title')).not.toBeNull();
    // expect(titleContainer.querySelector('span')).toBeInTheDocument();
  });
});
