export const isHtmlElement = (node: Node): node is HTMLElement =>
  node.nodeType === node.ELEMENT_NODE;
