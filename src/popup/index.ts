import './style.scss';
import {GaugeIndicator} from './gauge-indicator';
import {WorstPages} from './worst-pages';

const gaugeCanvas = document.getElementById('mood-gauge') as HTMLCanvasElement;
new GaugeIndicator(gaugeCanvas).start();

const worstPagesList = document.getElementById('worst-pages');
new WorstPages(worstPagesList).render();
