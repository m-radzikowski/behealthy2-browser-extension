import './style.scss';
import {GaugeIndicator} from './gauge-indicator';

const gaugeCanvas = document.getElementById('mood-gauge') as HTMLCanvasElement;
new GaugeIndicator(gaugeCanvas).start();
