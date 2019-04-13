import './hot-reload.ts';
import {AudioRecordManager} from './audio-record-manager';
import {ScoringManager} from './scoring-manager';
import {ActionIconRenderer} from './action-icon-renderer';

AudioRecordManager.getInstance().init();

const scoringManager = new ScoringManager();
scoringManager.start();

const actionIconRenderer = new ActionIconRenderer(16);
scoringManager.addValueListener(value => actionIconRenderer.updateValue(value));
