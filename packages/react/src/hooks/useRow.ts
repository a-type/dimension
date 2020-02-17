import { ROW_CONTAINER_ATTRIBUTE } from '@dimension/core';

export const useRow = () => {
  return {
    props: {
      [ROW_CONTAINER_ATTRIBUTE]: true,
    },
  };
};
