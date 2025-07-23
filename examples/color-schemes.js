import { FlowView } from 'flow-view';

const lightElement = document.querySelector('flow-view[theme="light"]');
const darkElement = document.querySelector('flow-view[theme="dark"]');

if (!lightElement || !darkElement)
	throw new Error('Element not found');

const graph = {
	nodes: [
		{ text: 'Node', x: 10, y: 10 },
	]
};

new FlowView(lightElement).loadGraph(graph);
new FlowView(darkElement).loadGraph(graph);
