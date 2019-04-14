import './style.scss';
import {GaugeIndicator} from './gauge-indicator';
import {WorstPages} from './worst-pages';
import {HistoryChart} from './history-chart';
import {PositivePages} from './positive-pages';

const gaugeCanvas = document.getElementById('mood-gauge') as HTMLCanvasElement;
new GaugeIndicator(gaugeCanvas).start();

const chartCanvas = document.getElementById('history-chart') as HTMLCanvasElement;
new HistoryChart(chartCanvas).start();

const worstPagesList = document.getElementById('worst-pages');
new WorstPages(worstPagesList).render();

const positivePagesList = document.getElementById('positive-pages');
new PositivePages(positivePagesList).render();
