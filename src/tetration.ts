import Decimal from 'break_eternity.js';

export function tetrate_linear(base: Decimal, height: number) {
  return Decimal.tetrate(base, height, 1, true);
}

/**
 * @param base must be 2<=base<=10
 * @throws {RangeError} if base is not 2<=base<=10
 */
export function tetrate_analytic(base: Decimal, height: number) {
  if (!(base.gte(2) && base.lte(10))) {
    throw new RangeError('if base is not 2<=base<=10');
  }
  return Decimal.tetrate(base, height);
}
/**
 * @param critical_lower_value the minimum value of height for critical_function
 * @param critical_upper_value the maximum value of height for critical_function, must be critical_lower_value+1
 * @param critical_function
 * @throws {RangeError} if critical_upper_value - critical_lower_value !== 1
 */
export function tetrate_customCritical(
  critical_lower_value: number,
  critical_upper_value: number,
  critical_function: (base: Decimal, height: number) => Decimal,
) {
  if (critical_upper_value - critical_lower_value !== 1)
    throw new RangeError('critical_upper_value - critical_lower_value !== 1');
  return function (base: Decimal, height: number) {
    const wholeHeight = Math.floor(height - critical_lower_value);
    const fracHeight = height - wholeHeight;

    return Decimal.tetrate(base, wholeHeight, critical_function(base, fracHeight));
  };
}

function tetrate_criticalSection_quadratic(base: Decimal, height: number) {
  if (base.eq(Decimal.dInf) || base.eq(Decimal.dZero)) return new Decimal((height + 1) ** 2);
  const lnb = base.ln();
  return lnb
    .sub(1)
    .div(lnb.add(1))
    .mul(height)
    .add(1)
    .mul(height + 1);
  //return lnb.add(-1).mul(height).add(lnb.mul(2)).mul(height).div(lnb.add(1)).add(1);
}
export const tetrate_quadratic = tetrate_customCritical(-1, 0, tetrate_criticalSection_quadratic);
export type TetrationOption = 'linear' | 'analytic' | 'quadratic';
export function tetrate(approximation: TetrationOption) {
  switch (approximation) {
    case 'linear':
      return tetrate_linear;
    case 'analytic':
      return tetrate_analytic;
    case 'quadratic':
      return tetrate_quadratic;
    default:
      console.error(`Unknown TetrationOption: ${approximation}`);
      return tetrate_linear;
  }
}
