export const generateId = (base?: string): string => {
  return `${base || 'generated'}-${Math.floor(Math.random() * 100000000)}`;
};

export const getSelectFocusElementId = (groupId: string) => `${groupId}-input`;
export const getSelectItemsContainerId = (groupId: string) =>
  `${groupId}-options`;
export const getSelectItemId = (groupId: string, optionKey: string) =>
  `${groupId}-option-${optionKey}`;
export const getRovingTabContainerId = (groupId: string) =>
  `${groupId}-container`;
