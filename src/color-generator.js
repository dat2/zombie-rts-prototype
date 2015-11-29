// slightly modified version of color-generator on npm
import Color from 'color';

const COLORS = ['red', 'green', 'blue', 'yellow'];

export function colors(length) {
  let currentIndex = 0;

  const result = [];

  for(let i = 0; i < length; i++) {
    const c = Color(COLORS[currentIndex]);
    currentIndex = ++currentIndex % COLORS.length;

    result.push(c);
  }

  return result;
}
