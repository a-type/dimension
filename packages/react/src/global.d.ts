declare namespace jest {
  interface Matchers<R> {
    // jest-dom
    toBeDisabled: () => any;
    toBeEnabled: () => any;
    toBeEmpty: () => any;
    toBeInTheDocument: () => any;
    toBeVisible: () => any;
    toContainElement: (element: HTMLElement | SVGElement | null) => any;
    toContainHTML: (htmlString: string) => any;
    toHaveAttribute: (attr: string, value?: string) => any;
    toHaveClass: (...classNames: string[]) => any;
    toHaveFocus: () => any;
    toHaveFormValues: (expectedValues: { [name: string]: any }) => any;
    toHaveStyle: (css: string) => any;
    toHaveTextContent: (
      text: string | RegExp,
      options?: { normalizeWhitespace: boolean },
    ) => any;
  }

  interface Expect {
    // jest-dom
    toBeDisabled: () => any;
    toBeEnabled: () => any;
    toBeEmpty: () => any;
    toBeInTheDocument: () => any;
    toBeVisible: () => any;
    toContainElement: (element: HTMLElement | SVGElement | null) => any;
    toContainHTML: (htmlString: string) => any;
    toHaveAttribute: (attr: string, value?: string) => any;
    toHaveClass: (...classNames: string[]) => any;
    toHaveFocus: () => any;
    toHaveFormValues: (expectedValues: { [name: string]: any }) => any;
    toHaveStyle: (css: string) => any;
    toHaveTextContent: (
      text: string | RegExp,
      options?: { normalizeWhitespace: boolean },
    ) => any;
  }
}
