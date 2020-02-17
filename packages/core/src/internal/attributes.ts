import {
  KEY_DATA_ATTRIBUTE,
  X_INDEX_DATA_ATTRIBUTE,
  Y_INDEX_DATA_ATTRIBUTE,
  ROW_CONTAINER_ATTRIBUTE,
} from '../constants';
import { isHtmlElement } from './guards';
import { DISABLED_ATTRIBUTE } from '../constants';

export const getElementKey = (node: Node) => {
  if (isHtmlElement(node)) {
    return node.getAttribute(KEY_DATA_ATTRIBUTE) || null;
  }
  return null;
};

const nullingParseInt = (maybeInt: string): number | null => {
  const result = parseInt(maybeInt, 10);
  if (isNaN(result)) {
    return null;
  }
  return result;
};

export const getElementManualCoordinates = (
  node: Node,
): [number | null, number | null] => {
  if (isHtmlElement(node)) {
    const xIndexString = node.getAttribute(X_INDEX_DATA_ATTRIBUTE) || null;
    const x = nullingParseInt(xIndexString || '');
    const yIndexString = node.getAttribute(Y_INDEX_DATA_ATTRIBUTE) || null;
    const y = nullingParseInt(yIndexString || '');
    return [x, y];
  }
  return [null, null];
};

export const isElementRow = (node: Node) => {
  if (!isHtmlElement(node)) {
    return null;
  }
  return node.hasAttribute(ROW_CONTAINER_ATTRIBUTE);
};

export const isElementDisabled = (node: Node) => {
  if (!isHtmlElement(node)) return false;
  return node.getAttribute(DISABLED_ATTRIBUTE) === 'true';
};
