import { FlowView } from 'flow-view';

const lightContainer = document.querySelector('article#color-schemes .container.light-theme');
const darkContainer = document.querySelector('article#color-schemes .container.dark-theme');

if (!lightContainer || !darkContainer)
	throw new Error('Element not found');

const graph = {
	nodes: [
		{ text: 'Node', x: 10, y: 10 },
	]
};

new FlowView(lightContainer).loadGraph(graph);
new FlowView(darkContainer).loadGraph(graph);
