import { Type } from '@angular/core';
import { ArgTypes } from '@storybook/types';
import { ICollection } from './types';
import { ComponentInputsOutputs, getComponentDecoratorMetadata, getComponentInputsOutputs } from './utils/NgComponentAnalyzer';

const separateInputsOutputsAttributes = (ngComponentInputsOutputs: ComponentInputsOutputs, props: ICollection = {}) => {
  const inputs = ngComponentInputsOutputs.inputs.filter((i) => i.templateName in props).map((i) => i.templateName);
  const outputs = ngComponentInputsOutputs.outputs.filter((o) => o.templateName in props).map((o) => o.templateName);

  return {
    inputs,
    outputs,
    otherProps: Object.keys(props).filter((k) => ![...inputs, ...outputs].includes(k)),
  };
};

/**
 * Converts a component into a template with inputs/outputs present in initial props
 * @param component
 * @param initialProps
 * @param innerTemplate
 */
export const computesTemplateFromComponent = (component: Type<unknown>, initialProps?: ICollection, innerTemplate = '') => {
  const ngComponentMetadata = getComponentDecoratorMetadata(component);
  const ngComponentInputsOutputs = getComponentInputsOutputs(component);

  if (!ngComponentMetadata.selector) {
    // Allow to add renderer component when NgComponent selector is undefined
    return `<ng-container *ngComponentOutlet="storyComponent"></ng-container>`;
  }

  const { inputs: initialInputs, outputs: initialOutputs } = separateInputsOutputsAttributes(ngComponentInputsOutputs, initialProps);

  const templateInputs = initialInputs.length > 0 ? ` ${initialInputs.map((i) => `[${i}]="${i}"`).join(' ')}` : '';
  const templateOutputs = initialOutputs.length > 0 ? ` ${initialOutputs.map((i) => `(${i})="${i}($event)"`).join(' ')}` : '';

  return buildTemplate(ngComponentMetadata.selector, innerTemplate, templateInputs, templateOutputs);
};

const createAngularInputProperty = ({ propertyName, value, argType }: { propertyName: string; value: any; argType?: ArgTypes[string] }) => {
  const { name: type = null } = (typeof argType?.type === 'object' && argType?.type) || {};
  let templateValue = type === 'enum' && value;

  const actualType = type === 'enum' && typeof value;
  const requiresBrackets = ['object', 'any', 'boolean', 'enum', 'number'].includes(actualType);

  if (typeof value === 'object') {
    templateValue = propertyName;
  }

  return `${requiresBrackets ? '[' : ''}${propertyName}${requiresBrackets ? ']' : ''}="${templateValue}"`;
};

/**
 * Converts a component into a template with inputs/outputs present in initial props
 * @param component
 * @param initialProps
 * @param innerTemplate
 */
export const computesTemplateSourceFromComponent = (component: Type<unknown>, initialProps?: ICollection, argTypes?: ArgTypes) => {
  const ngComponentMetadata = getComponentDecoratorMetadata(component);
  if (!ngComponentMetadata) {
    return null;
  }

  if (!ngComponentMetadata.selector) {
    // Allow to add renderer component when NgComponent selector is undefined
    return `<ng-container *ngComponentOutlet="${component.name}"></ng-container>`;
  }

  const ngComponentInputsOutputs = getComponentInputsOutputs(component);
  const { inputs: initialInputs, outputs: initialOutputs } = separateInputsOutputsAttributes(ngComponentInputsOutputs, initialProps);

  const templateInputs =
    initialInputs.length > 0
      ? ` ${initialInputs
          .map((propertyName) =>
            createAngularInputProperty({
              propertyName,
              value: initialProps[propertyName],
              argType: argTypes?.[propertyName],
            })
          )
          .join(' ')}`
      : '';
  const templateOutputs = initialOutputs.length > 0 ? ` ${initialOutputs.map((i) => `(${i})="${i}($event)"`).join(' ')}` : '';

  return buildTemplate(ngComponentMetadata.selector, '', templateInputs, templateOutputs);
};

const buildTemplate = (selector: string, innerTemplate: string, inputs: string, outputs: string) => {
  // https://www.w3.org/TR/2011/WD-html-markup-20110113/syntax.html#syntax-elements
  const voidElements = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

  const firstSelector = selector.split(',')[0];
  const templateReplacers: [string | RegExp, string | ((substring: string, ...args: any[]) => string)][] = [
    [/(^.*?)(?=[,])/, '$1'],
    [/(^\..+)/, 'div$1'],
    [/(^\[.+?])/, 'div$1'],
    [/([\w[\]]+)(\s*,[\w\s-[\],]+)+/, `$1`],
    [/#([\w-]+)/, ` id="$1"`],
    [/((\.[\w-]+)+)/, (_, c) => ` class="${c.split`.`.join` `.trim()}"`],
    [/(\[.+?])/g, (_, a) => ` ${a.slice(1, -1)}`],
    [
      /([\S]+)(.*)/,
      (template, elementSelector) => {
        return voidElements.some((element) => elementSelector === element) ? template.replace(/([\S]+)(.*)/, `<$1$2${inputs}${outputs} />`) : template.replace(/([\S]+)(.*)/, `<$1$2${inputs}${outputs}>${innerTemplate}</$1>`);
      },
    ],
  ];

  return templateReplacers.reduce((prevSelector, [searchValue, replacer]) => prevSelector.replace(searchValue, replacer as any), firstSelector);
};
