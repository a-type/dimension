import {
  KEY_DATA_ATTRIBUTE,
  CONTAINER_ATTRIBUTE,
  ROW_CONTAINER_ATTRIBUTE,
  X_INDEX_DATA_ATTRIBUTE,
  Y_INDEX_DATA_ATTRIBUTE,
  DISABLED_ATTRIBUTE,
} from '../../constants';
import { discoverOrderingStructure } from '../tree';

describe('selection utils', () => {
  describe('discover ordering structure', () => {
    describe('can convert an example 2d DOM structure into correct tree ordering', () => {
      var parser = new DOMParser();
      var html = parser.parseFromString(
        `
        <div>
          <div ${KEY_DATA_ATTRIBUTE}="a">
            <div ${KEY_DATA_ATTRIBUTE}="a-i">
              <div ${KEY_DATA_ATTRIBUTE}="a-i-1"></div>
              <div ${CONTAINER_ATTRIBUTE}>
                <div ${KEY_DATA_ATTRIBUTE}="childcontainer-1"></div>
              </div>
              <div ${KEY_DATA_ATTRIBUTE}="a-i-2"></div>
            </div>
            <div ${KEY_DATA_ATTRIBUTE}="a-ii" ${DISABLED_ATTRIBUTE}="true"></div>
          </div>
          <div>
            <div ${KEY_DATA_ATTRIBUTE}="b">
              <div>
                <div ${KEY_DATA_ATTRIBUTE}="b-i"></div>
              </div>
            </div>
          </div>
        </div>
      `,
        'text/html',
      );

      test('ignoring sub-containers', () => {
        const tree = {
          key: null,
          children: [],
          disabled: false,
        };
        const elementMap: any = {};
        discoverOrderingStructure(tree, elementMap, html, {
          parentIndex: [],
          crossContainerBoundaries: false,
          crossAxisRowPosition: 0,
        });
        expect(tree).toEqual({
          children: [
            [
              {
                children: [
                  [
                    {
                      children: [
                        [
                          {
                            children: [],
                            key: 'a-i-1',
                            disabled: false,
                          },
                          {
                            children: [],
                            key: 'a-i-2',
                            disabled: false,
                          },
                        ],
                      ],
                      key: 'a-i',
                      disabled: false,
                    },
                    {
                      children: [],
                      key: 'a-ii',
                      disabled: true,
                    },
                  ],
                ],
                key: 'a',
                disabled: false,
              },
              {
                children: [
                  [
                    {
                      children: [],
                      key: 'b-i',
                      disabled: false,
                    },
                  ],
                ],
                key: 'b',
                disabled: false,
              },
            ],
          ],
          key: null,
          disabled: false,
        });
        expect(Object.keys(elementMap).sort()).toEqual([
          'a',
          'a-i',
          'a-i-1',
          'a-i-2',
          'a-ii',
          'b',
          'b-i',
        ]);
        expect(elementMap['a-i-2'].index).toEqual([
          [0, 0],
          [0, 0],
          [1, 0],
        ]);
      });
    });

    describe('can convert an example 3d DOM structure into correct tree ordering', () => {
      var parser = new DOMParser();
      var html = parser.parseFromString(
        `
        <div>
          <div ${ROW_CONTAINER_ATTRIBUTE}>
            <div ${KEY_DATA_ATTRIBUTE}="a1">
              <div ${ROW_CONTAINER_ATTRIBUTE}>
                <div ${KEY_DATA_ATTRIBUTE}="a1-i">
                  <div ${KEY_DATA_ATTRIBUTE}="a1-i-1"></div>
                  <div ${CONTAINER_ATTRIBUTE}>
                    <div ${KEY_DATA_ATTRIBUTE}="childcontainer-1"></div>
                  </div>
                  <div ${KEY_DATA_ATTRIBUTE}="a1-i-2"></div>
                </div>
                <div ${KEY_DATA_ATTRIBUTE}="a1-ii"></div>
              </div>
              <div ${ROW_CONTAINER_ATTRIBUTE}>
                <div ${KEY_DATA_ATTRIBUTE}="a1-j"></div>
                <div ${KEY_DATA_ATTRIBUTE}="a1-jj">
                  <div ${KEY_DATA_ATTRIBUTE}="a1-jj-1"></div>
                </div>
              </div>
              <div ${ROW_CONTAINER_ATTRIBUTE}>
                <div ${KEY_DATA_ATTRIBUTE}="a1-k"></div>
              </div>
            </div>
            <div ${KEY_DATA_ATTRIBUTE}="a2">
              <div ${KEY_DATA_ATTRIBUTE}="a2-i">
                <div ${KEY_DATA_ATTRIBUTE}="a2-i-1"></div>
              </div>
              <div ${KEY_DATA_ATTRIBUTE}="a2-ii"></div>
            </div>
          </div>
          <div>
            <div ${ROW_CONTAINER_ATTRIBUTE}>
              <div>
                <div ${KEY_DATA_ATTRIBUTE}="b1">
                  <div>
                    <div ${KEY_DATA_ATTRIBUTE}="b1-i"></div>
                  </div>
                </div>
                <div ${KEY_DATA_ATTRIBUTE}="b2">
                  <div>
                    <div ${KEY_DATA_ATTRIBUTE}="b2-i" ${DISABLED_ATTRIBUTE}="true"></div>
                  </div>
                  <div ${KEY_DATA_ATTRIBUTE}="b2-ii"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
        'text/html',
      );

      test('ignoring sub-containers', () => {
        const tree = {
          key: null,
          children: [],
          disabled: false,
        };
        const elementMap: any = {};
        discoverOrderingStructure(tree, elementMap, html, {
          crossAxisRowPosition: 0,
          crossContainerBoundaries: false,
          parentIndex: [],
        });
        expect(tree).toEqual({
          key: null,
          disabled: false,
          children: [
            [
              {
                key: 'a1',
                disabled: false,
                children: [
                  [
                    {
                      key: 'a1-i',
                      disabled: false,
                      children: [
                        [
                          {
                            key: 'a1-i-1',
                            disabled: false,
                            children: [],
                          },
                          {
                            key: 'a1-i-2',
                            disabled: false,
                            children: [],
                          },
                        ],
                      ],
                    },
                    {
                      key: 'a1-ii',
                      disabled: false,
                      children: [],
                    },
                  ],
                  [
                    {
                      key: 'a1-j',
                      disabled: false,
                      children: [],
                    },
                    {
                      key: 'a1-jj',
                      disabled: false,
                      children: [
                        [
                          {
                            key: 'a1-jj-1',
                            disabled: false,
                            children: [],
                          },
                        ],
                      ],
                    },
                  ],
                  [
                    {
                      key: 'a1-k',
                      disabled: false,
                      children: [],
                    },
                  ],
                ],
              },
              {
                key: 'a2',
                disabled: false,
                children: [
                  [
                    {
                      key: 'a2-i',
                      disabled: false,
                      children: [
                        [
                          {
                            key: 'a2-i-1',
                            disabled: false,
                            children: [],
                          },
                        ],
                      ],
                    },
                    {
                      key: 'a2-ii',
                      disabled: false,
                      children: [],
                    },
                  ],
                ],
              },
            ],
            [
              {
                key: 'b1',
                disabled: false,
                children: [
                  [
                    {
                      key: 'b1-i',
                      disabled: false,
                      children: [],
                    },
                  ],
                ],
              },
              {
                key: 'b2',
                disabled: false,
                children: [
                  [
                    {
                      key: 'b2-i',
                      disabled: true,
                      children: [],
                    },
                    {
                      key: 'b2-ii',
                      disabled: false,
                      children: [],
                    },
                  ],
                ],
              },
            ],
          ],
        });
        expect(Object.keys(elementMap).sort()).toEqual(
          [
            'a1',
            'a2',
            'a1-i',
            'a1-j',
            'a1-ii',
            'a1-jj',
            'a1-i-1',
            'a1-i-2',
            'a1-jj-1',
            'a1-k',
            'a2-i',
            'a2-i-1',
            'a2-ii',
            'b1',
            'b2',
            'b1-i',
            'b2-i',
            'b2-ii',
          ].sort(),
        );

        expect(elementMap['a1-jj-1'].index).toEqual([
          [0, 0],
          [1, 1],
          [0, 0],
        ]);

        expect(elementMap['a2'].index).toEqual([[1, 0]]);

        expect(elementMap['a2-ii'].index).toEqual([
          [1, 0],
          [1, 0],
        ]);

        expect(elementMap['b2-i'].index).toEqual([
          [1, 1],
          [0, 0],
        ]);
      });
    });

    describe('can convert an example flat DOM structure with manual coordinates into correct tree ordering', () => {
      var parser = new DOMParser();
      var html = parser.parseFromString(
        `
        <div>
          <div ${KEY_DATA_ATTRIBUTE}="a1" ${X_INDEX_DATA_ATTRIBUTE}="0" ${Y_INDEX_DATA_ATTRIBUTE}="0">
            <!-- sub-grid -->
            <div ${KEY_DATA_ATTRIBUTE}="a1-b2" ${X_INDEX_DATA_ATTRIBUTE}="1" ${Y_INDEX_DATA_ATTRIBUTE}="1"></div>
            <div ${KEY_DATA_ATTRIBUTE}="a1-a1" ${X_INDEX_DATA_ATTRIBUTE}="0" ${Y_INDEX_DATA_ATTRIBUTE}="0"></div>
            <div ${KEY_DATA_ATTRIBUTE}="a1-b1" ${X_INDEX_DATA_ATTRIBUTE}="0" ${Y_INDEX_DATA_ATTRIBUTE}="1"></div>
            <div ${KEY_DATA_ATTRIBUTE}="a1-a2" ${X_INDEX_DATA_ATTRIBUTE}="1" ${Y_INDEX_DATA_ATTRIBUTE}="0"></div>
          </div>
          <div ${KEY_DATA_ATTRIBUTE}="a2" ${X_INDEX_DATA_ATTRIBUTE}="1" ${Y_INDEX_DATA_ATTRIBUTE}="0"></div>
          <div ${KEY_DATA_ATTRIBUTE}="b2" ${X_INDEX_DATA_ATTRIBUTE}="1" ${Y_INDEX_DATA_ATTRIBUTE}="1"></div>
          <div ${KEY_DATA_ATTRIBUTE}="b3" ${X_INDEX_DATA_ATTRIBUTE}="2" ${Y_INDEX_DATA_ATTRIBUTE}="1"></div>
          <div ${KEY_DATA_ATTRIBUTE}="c4" ${X_INDEX_DATA_ATTRIBUTE}="3" ${Y_INDEX_DATA_ATTRIBUTE}="2"></div>
        </div>
      `,
        'text/html',
      );

      test('ignoring sub-containers', () => {
        const tree = {
          key: null,
          children: [],
          disabled: false,
        };
        const elementMap: any = {};
        discoverOrderingStructure(tree, elementMap, html, {
          crossAxisRowPosition: 0,
          crossContainerBoundaries: false,
          parentIndex: [],
        });
        expect(tree).toEqual({
          key: null,
          disabled: false,
          children: [
            [
              {
                key: 'a1',
                disabled: false,
                children: [
                  [
                    {
                      key: 'a1-a1',
                      disabled: false,
                      children: [],
                    },
                    {
                      key: 'a1-a2',
                      children: [],
                      disabled: false,
                    },
                  ],
                  [
                    {
                      key: 'a1-b1',
                      disabled: false,
                      children: [],
                    },
                    {
                      key: 'a1-b2',
                      disabled: false,
                      children: [],
                    },
                  ],
                ],
              },
              {
                key: 'a2',
                disabled: false,
                children: [],
              },
            ],
            [
              undefined,
              {
                key: 'b2',
                disabled: false,
                children: [],
              },
              {
                key: 'b3',
                disabled: false,
                children: [],
              },
            ],
            [
              undefined,
              undefined,
              undefined,
              {
                key: 'c4',
                disabled: false,
                children: [],
              },
            ],
          ],
        });
        expect(Object.keys(elementMap).sort()).toEqual(
          [
            'a1',
            'a2',
            'a1-a1',
            'a1-a2',
            'a1-b1',
            'a1-b2',
            'b2',
            'b3',
            'c4',
          ].sort(),
        );

        expect(elementMap['a1'].index).toEqual([[0, 0]]);

        expect(elementMap['a2'].index).toEqual([[1, 0]]);

        expect(elementMap['b3'].index).toEqual([[2, 1]]);

        expect(elementMap['c4'].index).toEqual([[3, 2]]);

        expect(elementMap['a1-b2'].index).toEqual([
          [0, 0],
          [1, 1],
        ]);
      });
    });
  });
});
