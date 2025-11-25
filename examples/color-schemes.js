import { FlowView } from 'flow-view';

const lightElement = document.querySelector('flow-view[theme="light"]');
const darkElement = document.querySelector('flow-view[theme="dark"]');

/** @type {import('flow-view').FlowViewGraph} */
const graph = {
	nodes: {
		id1: { text: 'Node', x: 10, y: 10 },
	}
};

FlowView.instance(lightElement).load(graph);
FlowView.instance(darkElement).load(graph);
