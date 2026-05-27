<script setup lang="ts">
import type Decimal from 'break_eternity.js';
import BENumberDisplay from './BENumberDisplay.vue';
import type { NumberNotation, NumberNotationWithOptions } from '@/number_notation';
import NumberDisplay from './NumberDisplay.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ base: Decimal; height: number; notation: NumberNotationWithOptions }>();
</script>
<template>
  <mn>
    <BENumberDisplay :value="base" :notation="notation" />
  </mn>
  <mo>↑↑</mo>
  <mn>
    <NumberDisplay :value="height" :notation="notation" />
  </mn>
</template>
<style lang="css"></style>
