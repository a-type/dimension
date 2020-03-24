import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import smoothscroll from 'smoothscroll-polyfill';

window.scroll = jest.fn();

// @ts-ignore
window.__forceSmoothScrollPolyfill__ = true;

smoothscroll.polyfill();
