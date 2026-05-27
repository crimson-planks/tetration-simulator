<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import TetrationDisplay from './components/TetrationDisplay.vue';
import Decimal from 'break_eternity.js';
import { tetrate, tetrate_linear, type TetrationOption } from './tetration';
import type { ArgumentKind } from './main';
import NumberDisplay from './components/NumberDisplay.vue';
import BENumberDisplay from './components/BENumberDisplay.vue';
import { getNumberNotationName, getNumberNotationWithOptions, numberNotationArr, toStringNotationSymbol, type NumberNotation } from './number_notation';


// eslint-disable-next-line prefer-const
let startTime = Date.now();
function getTime() {
  return (Date.now() - startTime) / 1000;
}

const t = ref(0);

const s = ref(new Decimal(1));
const numberNotation = ref('toString' as NumberNotation);
const currentNumberNotationWithOptions = computed(() => getNumberNotationWithOptions(inputs.value.numberNotation, parsedInputs.value.numberNotationOptions))
const inputs = ref({
  base: '',
  height: '',
  approximationKind: 'linear' as TetrationOption,
  baseKind: 'constant' as ArgumentKind,
  heightKind: 'constant' as ArgumentKind,
  sMul: '1',
  numberNotation: toStringNotationSymbol as NumberNotation,
  numberNotationOptions: {
    numPlaces: '',
  }
});
const parsedInputs = ref({
  base: new Decimal(0),
  height: 0,
  sMul: new Decimal(1),
  numberNotationOptions: {
    numPlaces: 0
  }
});
const realValues = ref({
  base: new Decimal(0),
  height: 0,
  result: new Decimal(0),
  fallbackToLinear: false,
})
function updateResult() {
  realValues.value.base = inputs.value.baseKind === 'time' ? new Decimal(s.value) : parsedInputs.value.base;
  realValues.value.height = inputs.value.heightKind === 'time' ? s.value.toNumber() : parsedInputs.value.height;
  try {
    realValues.value.result = tetrate(inputs.value.approximationKind)(realValues.value.base, realValues.value.height);
    realValues.value.fallbackToLinear = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    realValues.value.result = tetrate_linear(realValues.value.base, realValues.value.height);
    realValues.value.fallbackToLinear = true;
  }
}
let shouldUpdateResult = false;
watch(() => inputs.value.sMul, () => { parsedInputs.value.sMul = new Decimal(inputs.value.sMul); shouldUpdateResult = true; })
watch(() => inputs.value.base, () => { parsedInputs.value.base = new Decimal(inputs.value.base); shouldUpdateResult = true; });
watch(() => inputs.value.height, () => { parsedInputs.value.height = parseFloat(inputs.value.height); shouldUpdateResult = true; });
watch(() => inputs.value.approximationKind, () => { shouldUpdateResult = true; });
watch(() => inputs.value.baseKind, () => () => { shouldUpdateResult = true; });
watch(() => inputs.value.numberNotation, () => numberNotation.value = inputs.value.numberNotation);
watch(() => inputs.value.numberNotationOptions.numPlaces, () => {
  parsedInputs.value.numberNotationOptions.numPlaces = Math.min(20, Math.max(0, parseInt(inputs.value.numberNotationOptions.numPlaces)))
})

const tetrationApproximationOptionArr = ['linear', 'analytic', 'quadratic'] as const satisfies TetrationOption[];

setInterval(() => {
  t.value = getTime();
  s.value = parsedInputs.value.sMul.mul(t.value);
  if (shouldUpdateResult || inputs.value.baseKind === 'time' || inputs.value.heightKind === 'time') {
    updateResult();
    shouldUpdateResult = false;
  }
}, 50);
updateResult();
</script>
<template>
  <h1>Tetration Simulator</h1>
  <div id="result">
    <p>
      <math display="block">
        <mi>t</mi>
        <mo>=</mo>
        <mn>
          <NumberDisplay :value="t" :notation="currentNumberNotationWithOptions" />
        </mn>
      </math>
    </p>
    <p>
      <math display="block">
        <mi>s</mi>
        <mo>=</mo>
        <mi>t</mi>
        <mo>×</mo>
        <mn>
          <BENumberDisplay :value="parsedInputs.sMul" :notation="currentNumberNotationWithOptions" />
        </mn>
      </math>
    </p>
    <p>
      <math display="block">
        <mi>s</mi>
        <mo>=</mo>
        <mn>
          <BENumberDisplay :value="s" :notation="currentNumberNotationWithOptions" />
        </mn>
      </math>
    </p>
    <p>
      <math display="block">
        <TetrationDisplay :base="realValues.base" :height="realValues.height"
          :notation="currentNumberNotationWithOptions" />
        <mo>=</mo>
        <mn>
          <BENumberDisplay :value="realValues.result" :notation="currentNumberNotationWithOptions" />
        </mn>
      </math>
    </p>
  </div>
  <button @click="startTime = Date.now()">Reset t</button>
  <button @click="startTime = startTime - 1000">Add 1 to t</button>
  <button @click="startTime = startTime - 10000">Add 10 to t</button>
  <button @click="startTime = startTime - 100000">Add 100 to t</button>
  <label for="s-mul">Multiplier for s: </label>
  <input v-model="inputs.sMul" id="s-mul">
  Select base kind:<br>
  <label for="base-kind-constant">Constant</label>
  <input type="radio" name="base-kind" value="constant" id="base-kind-constant" checked
    @change="inputs.baseKind = 'constant'" />
  <label for="base-kind-time">Time</label>
  <input type="radio" name="base-kind" value="time" id="base-kind-time" @change="inputs.baseKind = 'time'" />
  <input v-model="inputs.base" id="base-input"><br>
  Select height kind:<br>
  <label for="height-kind-constant">Constant</label>
  <input type="radio" name="height-kind" value="constant" id="height-kind-constant" checked
    @change="inputs.heightKind = 'constant'" />
  <label for="height-kind-time">Time</label>
  <input type="radio" name="height-kind" value="time" id="height-kind-time" @change="inputs.heightKind = 'time'" />
  <input v-model="inputs.height" id="height-input">
  <select v-model="inputs.approximationKind" id="approimation-select">
    <option value="linear" selected>Select approximation</option>
    <option v-for="tetrationApproximation in tetrationApproximationOptionArr" :key="tetrationApproximation"
      :value="tetrationApproximation">{{
        tetrationApproximation }}</option>
  </select>
  <span v-show="realValues.fallbackToLinear">Outside of range of selected approximation; falling back to linear
    approximation.</span>
  <select v-model="inputs.numberNotation">
    <option v-for="numberNotation in numberNotationArr" :key="numberNotation" :value="numberNotation">{{
      getNumberNotationName(numberNotation)
    }}</option>
  </select>
  <label for="num-places-input">numPlaces: </label>
  <input id="num-places-input" v-model="inputs.numberNotationOptions.numPlaces">

</template>

<style></style>
