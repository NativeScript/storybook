import type {
  ArgTypes,
  GlobalTypes,
  InputType,
  StrictArgTypes,
  StrictGlobalTypes,
  StrictInputType,
} from '@storybook/types';

const normalizeType = (type: InputType['type']): StrictInputType['type'] => {
  return typeof type === 'string' ? { name: type } : type;
};

const normalizeControl = (control: InputType['control']): StrictInputType['control'] =>
  typeof control === 'string' ? { type: control } : control;

export const normalizeInputType = (
  inputType: InputType,
  key: string
): StrictInputType => {
  const { type, control, ...rest } = inputType;
  const normalized: StrictInputType = {
    name: key,
    ...rest,
  };
  if (type) normalized.type = normalizeType(type);
  if (control) {
    normalized.control = normalizeControl(control);
  } else if (control === false) {
    normalized.control = { disable: true };
  }
  return normalized;
};

export const normalizeInputTypes = (
  inputTypes: ArgTypes | GlobalTypes
): StrictArgTypes | StrictGlobalTypes => mapValue(inputTypes, normalizeInputType);

function mapValue(object, iteratee) {
  object = Object(object);
  const result = {};

  Object.keys(object).forEach((key) => {
    result[key] = iteratee(object[key], key, object);
  });
  return result;
}
