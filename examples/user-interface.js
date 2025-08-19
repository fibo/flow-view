import { FlowView } from 'flow-view';

const container = document.querySelector('.container');
if (!container)
  throw new Error('Container element not found');
const flowView = FlowView.instance(container);

const parents = ['Marge', 'Homer', 'Ned'];
const children = ['Bart', 'Lisa', 'Milhouse', 'Ralph'];

/** @param {string} text */
flowView.nodeTextToType = (text) => {
	if (parents.includes(text)) return 'parent';
	if (children.includes(text)) return 'child';
}

flowView.nodeTypeSignature
	.set('child', { inputs: [{ name: 'in1' }, { name: 'in2' }] })
	.set('parent', { outputs: [{ name: 'out' }] });

const nodeList = [
    'Marge',
    'Homer',
    'Bart',
    'Lisa',
    'Barney',
    'Milhouse',
    'Moe',
    'Ned',
    'Patty',
    'Ralph',
    'Selma',
    'Mr. Burns',
];
nodeList.forEach(item => flowView.nodeList.add(item));

/** @type {import('flow-view').FlowViewGraph} */
const initialGraph = {
	nodes: {
		dad: { text: 'Homer', x: 60, y: 70 },
		mom: { text: 'Marge', x: 160, y: 70 },
		son: { text: 'Bart', x: 60, y: 240 },
		daughter: { text: 'Lisa', x: 220, y: 240 }
    },
	links: [
		{ from: ['dad', 0], to: ['son', 0] },
		{ from: ['dad', 0], to: ['daughter', 0] },
		{ from: ['mom', 0], to: ['son', 1] },
		{ from: ['mom', 0], to: ['daughter', 1] },
	]
};

flowView.load(initialGraph);
