<script setup lang="ts">
import { formatNumber, type NumberNotationWithOptions } from '@/number_notation';
import { computed } from 'vue';

const props = defineProps<{ value: number; notation: NumberNotationWithOptions }>()
const formattedValue = computed(() => formatNumber(props.value, props.notation));
</script>
<template>
  {{ formattedValue }}
</template>
