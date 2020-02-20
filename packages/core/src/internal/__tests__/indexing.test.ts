import {
  getOffsetDeepIndex,
  getUpwardDeepIndex,
  getDownwardDeepIndex,
  findNextEnabledIndex,
  findPreviousEnabledIndex,
  getClosestValidDeepIndex,
} from '../indexing';

const basicFlatStructure = {
  key: null,
  disabled: false,
  children: [
    [
      {
        key: 'a',
        disabled: false,
        children: [],
      },
      {
        key: 'b',
        disabled: false,
        children: [],
      },
    ],
  ],
};

const flatStructureWithDisabled = {
  key: null,
  disabled: false,
  children: [
    [
      {
        key: 'a',
        disabled: true,
        children: [],
      },
      {
        key: 'b',
        disabled: false,
        children: [],
      },
      {
        key: 'c',
        disabled: true,
        children: [],
      },
      {
        key: 'd',
        disabled: false,
        children: [],
      },
    ],
  ],
};

const basicNestedStructure = {
  key: null,
  disabled: false,
  children: [
    [
      {
        key: 'a',
        disabled: false,
        children: [
          [
            {
              key: 'i',
              disabled: false,
              children: [],
            },
            {
              key: 'ii',
              disabled: false,
              children: [],
            },
          ],
        ],
      },
      {
        key: 'b',
        disabled: false,
        children: [
          [
            {
              key: 'iii',
              disabled: false,
              children: [],
            },
            {
              key: 'iv',
              disabled: false,
              children: [
                {
                  key: '1',
                  disabled: false,
                  children: [],
                },
              ],
            },
          ],
        ],
      },
    ],
  ],
};

const minimalNestedStructureWithDisabled = {
  key: null,
  disabled: false,
  children: [
    [
      {
        key: 'a',
        disabled: false,
        children: [
          [
            {
              key: 'a-1',
              disabled: true,
              children: [
                [
                  {
                    key: 'a-1-i',
                    disabled: false,
                    children: [],
                  },
                ],
              ],
            },
            {
              key: 'a-2',
              disabled: false,
              children: [
                [
                  {
                    key: 'a-2-i',
                    disabled: true,
                    children: [],
                  },
                  {
                    key: 'a-2-ii',
                    disabled: true,
                    children: [],
                  },
                ],
              ],
            },
          ],
        ],
      },
    ],
  ],
};

const basic3dStructure = {
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
              key: 'a1i',
              disabled: false,
              children: [],
            },
            {
              key: 'a1ii',
              disabled: false,
              children: [],
            },
          ],
          [
            {
              key: 'a1j',
              disabled: false,
              children: [],
            },
            {
              key: 'a1jj',
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
              key: 'a2i',
              disabled: false,
              children: [],
            },
            {
              key: 'a2ii',
              disabled: false,
              children: [
                [
                  {
                    key: 'a2iiX',
                    disabled: false,
                    children: [],
                  },
                ],
              ],
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
              key: 'b1i',
              disabled: false,
              children: [],
            },
            {
              key: 'b1ii',
              disabled: false,
              children: [],
            },
          ],
          [
            {
              key: 'b1j',
              disabled: false,
              children: [],
            },
          ],
        ],
      },
      {
        key: 'b2',
        disabled: false,
        children: [],
      },
    ],
  ],
};

describe('indexing utils', () => {
  describe('2d indexing', () => {
    describe('get offset deep index', () => {
      test('advances in a flat structure', () => {
        expect(
          getOffsetDeepIndex([[0, 0]], basicFlatStructure, 'next'),
        ).toEqual([[1, 0]]);
      });

      test('wraps', () => {
        expect(
          getOffsetDeepIndex([[1, 0]], basicFlatStructure, 'next', true),
        ).toEqual([[0, 0]]);
      });

      test("doesn't advance past end when wrap = false", () => {
        expect(
          getOffsetDeepIndex([[1, 0]], basicFlatStructure, 'next'),
        ).toEqual([[1, 0]]);
      });

      test('goes back in a flat structure', () => {
        expect(
          getOffsetDeepIndex([[1, 0]], basicFlatStructure, 'previous'),
        ).toEqual([[0, 0]]);
      });

      test("doesn't go back past end when wrap = false", () => {
        expect(
          getOffsetDeepIndex([[0, 0]], basicFlatStructure, 'previous'),
        ).toEqual([[0, 0]]);
      });

      test('ignores nested items', () => {
        expect(
          getOffsetDeepIndex([[0, 0]], basicNestedStructure, 'next'),
        ).toEqual([[1, 0]]);
      });

      describe('skipping disabled items', () => {
        test('moves forward with skip', () => {
          expect(
            getOffsetDeepIndex([[1, 0]], flatStructureWithDisabled, 'next'),
          ).toEqual([[3, 0]]);
        });

        test('moves forward with wrap', () => {
          expect(
            getOffsetDeepIndex(
              [[3, 0]],
              flatStructureWithDisabled,
              'next',
              true,
            ),
          ).toEqual([[1, 0]]);
        });

        test('stays put trying to move forward without wrap', () => {
          expect(
            getOffsetDeepIndex(
              [[3, 0]],
              flatStructureWithDisabled,
              'next',
              false,
            ),
          ).toEqual([[3, 0]]);
        });

        test('stays put trying to move backward without wrap', () => {
          expect(
            getOffsetDeepIndex([[1, 0]], flatStructureWithDisabled, 'previous'),
          ).toEqual([[1, 0]]);
        });

        test('moves backward with wrap', () => {
          expect(
            getOffsetDeepIndex(
              [[1, 0]],
              flatStructureWithDisabled,
              'previous',
              true,
            ),
          ).toEqual([[3, 0]]);
        });
      });
    });

    describe('get upward deep index', () => {
      test('goes upward', () => {
        expect(
          getUpwardDeepIndex(
            [
              [0, 0],
              [1, 0],
            ],
            basicNestedStructure,
          ),
        ).toEqual([[0, 0]]);
      });
      test("doesn't go up too far", () => {
        expect(getUpwardDeepIndex([[1, 0]], basicNestedStructure)).toEqual([
          [1, 0],
        ]);
      });
      test("doesn't pass disabled parents", () => {
        expect(
          getUpwardDeepIndex([[0, 2]], minimalNestedStructureWithDisabled),
        ).toEqual([[0, 2]]);
      });
    });

    describe('get downward deep index', () => {
      test('goes downward', () => {
        expect(getDownwardDeepIndex([[1, 0]], basicNestedStructure)).toEqual([
          [1, 0],
          [0, 0],
        ]);
      });

      test("stops when there's no where to go", () => {
        expect(
          getDownwardDeepIndex(
            [
              [0, 0],
              [1, 0],
            ],
            basicNestedStructure,
          ),
        ).toEqual([
          [0, 0],
          [1, 0],
        ]);
      });

      test('stops when all children are disabled', () => {
        expect(
          getDownwardDeepIndex(
            [
              [0, 0],
              [1, 0],
            ],
            minimalNestedStructureWithDisabled,
          ),
        ).toEqual([
          [0, 0],
          [1, 0],
        ]);
      });

      test('finds an enabled child if available', () => {
        expect(
          getDownwardDeepIndex([[0, 0]], minimalNestedStructureWithDisabled),
        ).toEqual([
          [0, 0],
          [1, 0],
        ]);
      });
    });

    describe('get closest valid deep index', () => {
      test('resolves the same index when valid', () => {
        expect(
          getClosestValidDeepIndex(
            [
              [1, 0],
              [1, 0],
              [0, 0],
            ],
            basicNestedStructure,
          ),
        ).toEqual([
          [1, 0],
          [1, 0],
          [0, 0],
        ]);
        expect(
          getClosestValidDeepIndex(
            [
              [1, 0],
              [1, 0],
            ],
            basicNestedStructure,
          ),
        ).toEqual([
          [1, 0],
          [1, 0],
        ]);
        expect(
          getClosestValidDeepIndex([[1, 0]], basicNestedStructure),
        ).toEqual([[1, 0]]);
      });

      test('resolves an empty index to the first element', () => {
        expect(getClosestValidDeepIndex([], basicNestedStructure)).toEqual([
          [0, 0],
        ]);
      });

      test('finds a close sibling', () => {
        expect(
          getClosestValidDeepIndex(
            [
              [1, 0],
              [1, 0],
              [3, 0],
            ],
            basicNestedStructure,
          ),
        ).toEqual([
          [1, 0],
          [1, 0],
          [0, 0],
        ]);
      });

      test('goes up to a parent if no siblings', () => {
        expect(
          getClosestValidDeepIndex(
            [
              [0, 0],
              [1, 0],
              [1, 0],
            ],
            basicNestedStructure,
          ),
        ).toEqual([
          [0, 0],
          [1, 0],
        ]);
      });

      test("goes all the way up if there's no nesting", () => {
        expect(
          getClosestValidDeepIndex(
            [
              [1, 0],
              [2, 0],
              [3, 0],
              [4, 0],
              [5, 0],
            ],
            basicFlatStructure,
          ),
        ).toEqual([[1, 0]]);
      });
    });
  });

  describe('3d indexing', () => {
    describe('get offset deep index', () => {
      test('moves forward orthogonally', () => {
        expect(
          getOffsetDeepIndex([[0, 0]], basic3dStructure, 'nextOrthogonal'),
        ).toEqual([[0, 1]]);
      });

      test('wraps orthogonally', () => {
        expect(
          getOffsetDeepIndex(
            [[0, 1]],
            basic3dStructure,
            'nextOrthogonal',
            true,
          ),
        ).toEqual([[0, 0]]);
      });

      test('wraps in a deep structure orthogonally, preserving main axis value', () => {
        expect(
          getOffsetDeepIndex(
            [
              [0, 0],
              [1, 1],
            ],
            basic3dStructure,
            'nextOrthogonal',
            true,
          ),
        ).toEqual([
          [0, 0],
          [1, 0],
        ]);
      });
    });
  });

  describe('find enabled index helper', () => {
    test('works forward without wrap', () => {
      expect(
        findNextEnabledIndex(
          [
            {
              key: 'a',
              disabled: false,
              children: [],
            },
            {
              key: 'b',
              disabled: true,
              children: [],
            },
            {
              key: 'c',
              disabled: false,
              children: [],
            },
          ],
          0,
          false,
        ),
      ).toEqual(2);
    });

    test('works forward with wrap', () => {
      expect(
        findNextEnabledIndex(
          [
            {
              key: 'a',
              disabled: false,
              children: [],
            },
            {
              key: 'b',
              disabled: true,
              children: [],
            },
            {
              key: 'c',
              disabled: false,
              children: [],
            },
          ],
          2,
          true,
        ),
      ).toEqual(0);
    });

    test('works backward without wrap', () => {
      expect(
        findPreviousEnabledIndex(
          [
            {
              key: 'a',
              disabled: false,
              children: [],
            },
            {
              key: 'b',
              disabled: true,
              children: [],
            },
            {
              key: 'c',
              disabled: false,
              children: [],
            },
          ],
          2,
          false,
        ),
      ).toEqual(0);
    });

    test('works backward with wrap', () => {
      expect(
        findPreviousEnabledIndex(
          [
            {
              key: 'a',
              disabled: false,
              children: [],
            },
            {
              key: 'b',
              disabled: true,
              children: [],
            },
            {
              key: 'c',
              disabled: false,
              children: [],
            },
          ],
          0,
          true,
        ),
      ).toEqual(2);
    });

    test('handles a singluar option', () => {
      expect(
        findNextEnabledIndex(
          [
            {
              key: 'a',
              disabled: false,
              children: [],
            },
            {
              key: 'b',
              disabled: true,
              children: [],
            },
            {
              key: 'c',
              disabled: true,
              children: [],
            },
          ],
          0,
          true,
        ),
      ).toEqual(0);
    });
  });
});
