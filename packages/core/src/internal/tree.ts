import { DeepIndex, DeepOrderingNode, ElementMap } from '../types';
import { isHtmlElement } from './guards';
import { CONTAINER_ATTRIBUTE } from '../constants';
import {
  getElementKey,
  getElementManualCoordinates,
  isElementDisabled,
  isElementRow,
} from './attributes';

type OrderingDiscoveryContext = {
  crossContainerBoundaries?: boolean;
  parentIndex: DeepIndex;
  crossAxisRowPosition: number;
};
/**
 * Mutates a master DeepOrderingNode tree and ElementMap. Traverses
 * the DOM tree and fills in the parallel DeepOrdering tree, and
 * documents the key lookup for each item element.
 */
export const discoverOrderingStructure = (
  parent: DeepOrderingNode,
  elementMap: ElementMap,
  root: Node,
  {
    crossContainerBoundaries,
    parentIndex,
    crossAxisRowPosition,
  }: OrderingDiscoveryContext = {
    parentIndex: [],
    crossAxisRowPosition: 0,
  },
): void => {
  // parent ordering node represents the root node.
  // assume root node has already been processed.

  let currentCrossAxisRowPosition = crossAxisRowPosition;

  root.childNodes.forEach(node => {
    // bail if text node or other non-html node
    if (!isHtmlElement(node)) {
      return;
    }

    // bail if reaching a child container (indicated by attr)
    // and cross container boundaries is false
    if (!crossContainerBoundaries && node.hasAttribute(CONTAINER_ATTRIBUTE)) {
      return;
    }

    // check if child is a selectable item
    const key = getElementKey(node);

    if (key) {
      // the user may specify manual coordinates for an element. this allows them
      // to place the element anywhere within the 2d grid of children of the parent
      // node context. the user can't today specify a "z" coordinate (i.e. break out
      // of the natural DOM inheritance structure and put a child element above or
      // beside its parent in ordering)
      const [
        manualXCoordinate,
        manualYCoordinate,
      ] = getElementManualCoordinates(node);

      // resolve the final coordinates
      const finalY = manualYCoordinate ?? currentCrossAxisRowPosition;
      if (!parent.children[finalY]) {
        parent.children[finalY] = [];
      }
      const naturalX = parent.children[finalY].length;
      const finalX = manualXCoordinate ?? naturalX;

      const childIndex: DeepIndex = [...parentIndex, [finalX, finalY]];

      elementMap[key] = {
        element: node,
        index: childIndex,
      };

      const newOrderingNode = {
        key,
        disabled: isElementDisabled(node),
        children: [],
      };

      discoverOrderingStructure(newOrderingNode, elementMap, node, {
        parentIndex: childIndex,
        crossAxisRowPosition: 0,
        crossContainerBoundaries,
      });
      parent.children[finalY][finalX] = newOrderingNode;
    } else {
      // if not, continue traversing downward...
      // kind of a 'skip level'
      discoverOrderingStructure(parent, elementMap, node, {
        parentIndex,
        crossAxisRowPosition: currentCrossAxisRowPosition,
        crossContainerBoundaries,
      });

      if (isElementRow(node)) {
        currentCrossAxisRowPosition = currentCrossAxisRowPosition + 1;
      }
    }
  });
};
