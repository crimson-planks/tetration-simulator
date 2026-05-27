<script setup lang="ts">
import { formatBENumber, type NumberNotation, type NumberNotationWithOptions } from '@/number_notation';
import type Decimal from 'break_eternity.js';
import { computed } from 'vue';

const props = defineProps<{ value: Decimal; notation: NumberNotationWithOptions }>();
const formattedValue = computed(() => formatBENumber(props.value, props.notation));
</script>
<template>
{{ formattedValue }}
</template>
