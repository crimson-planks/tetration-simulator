import { createApp } from 'vue';
import App from './App.vue';
import type Decimal from 'break_eternity.js';
const app = createApp(App);
app.mount('#app');

export interface TetrationArguments {
  base: Decimal;
  height: number;
  payload?: Decimal;
}

export type ArgumentKind = 'constant' | 'time';
