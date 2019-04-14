import './hot-reload.ts';
import {AudioRecordManager} from './audio-record-manager';
import {ScoringManager} from './scoring-manager';
import {ActionIconRenderer} from './action-icon-renderer';
import {PositiveCacher} from './positive-cacher';

AudioRecordManager.getInstance().init();

const scoringManager = new ScoringManager();
scoringManager.start();

scoringManager.addValueListener(value => {
	chrome.runtime.sendMessage({action: 'new-value'});
});

const actionIconRenderer = new ActionIconRenderer(16);
scoringManager.addValueListener(value => actionIconRenderer.updateValue(value));

new PositiveCacher().start();
