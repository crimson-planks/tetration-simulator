import type { DecimalSource } from 'break_eternity.js';
import Decimal from 'break_eternity.js';
export const toStringNotationSymbol: unique symbol = Symbol('toString');
export const numberNotationArr = Object.freeze([toStringNotationSymbol, 'toFixed2'] as const);
export type NumberNotation = typeof toStringNotationSymbol | 'toFixed2';

export function formatNumber(n: number, notation: NumberNotationWithOptions) {
  const nn = notation.numberNotation;
  if (nn === toStringNotationSymbol) {
    return n.toString();
  }
  if (nn === 'toFixed2') {
    return n.toFixed(notation.numPlaces);
  } else {
    return `Unknown NumberNotation: ${notation}`;
  }
}

export function formatBENumber(n: DecimalSource, notation: NumberNotationWithOptions) {
  const nn = notation.numberNotation;
  n = Decimal.fromValue_noAlloc(n);
  if (nn === toStringNotationSymbol) {
    return n.toString();
  }
  if (nn === 'toFixed2') {
    return n.toFixed(notation.numPlaces);
  } else {
    return `Unknown NumberNotation: ${notation}`;
  }
}
export function getNumberNotationName(nn: NumberNotation) {
  if (nn === toStringNotationSymbol) return 'toString';
  if (nn === 'toFixed2') return nn;
  else return 'toString';
}
export type NumberNotationWithOptions =
  | {
      numberNotation: typeof toStringNotationSymbol;
    }
  | {
      numberNotation: 'toFixed2';
      numPlaces: number;
    };
export function getNumberNotationWithOptions(
  n: NumberNotation,
  allOptions: any,
): NumberNotationWithOptions {
  if (n === toStringNotationSymbol) return { numberNotation: toStringNotationSymbol };
  if (n === 'toFixed2') return { numberNotation: n, numPlaces: allOptions.numPlaces };
  else return { numberNotation: toStringNotationSymbol };
}
