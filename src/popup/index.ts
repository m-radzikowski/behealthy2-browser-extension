import './style.scss';
import {GaugeIndicator} from './gauge-indicator';
import {WorstPages} from './worst-pages';

const gaugeCanvas = document.getElementById('mood-gauge') as HTMLCanvasElement;
const chartCanvas = <HTMLCanvasElement>document.getElementById('history-chart');
new GaugeIndicator(gaugeCanvas, chartCanvas).start();

const worstPagesList = document.getElementById('worst-pages');
new WorstPages(worstPagesList).render();
