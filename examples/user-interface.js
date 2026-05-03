import { FlowView } from 'flow-view';

const flowView = FlowView.instance(document.querySelector('.container'));

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

// This is a graph, you usually create it via UI.

/** @type {import('flow-view').FlowViewGraph} */
const initialGraph = {
	nodes: {
		dad: { text: 'Homer', x: 60, y: 70 },
		mom: { text: 'Marge', x: 160, y: 70 },
		son: { text: 'Bart', x: 60, y: 240 },
		daughter: { text: 'Lisa', x: 220, y: 240 }
    },
	links: {
		// Link id is given by its target that is a node input.
		// A node input can be connected only by one link.
		// So this row can be read as:
		//
		//     from 'dad,0' to 'son,0'
		//
		// From Homer's first output to Bart's first input.
		'son,0': 'dad,0',
		'daughter,0': 'dad,0',
		'son,1': 'mom,0',
		'daughter,1': 'mom,0',
	}
};

// This function can be used to connect to some engine or library.
// It gets triggered when items are created, deleted, moved, etc.

flowView.onChange((detail) => {
	console.info('change', JSON.stringify(detail, null, 2));
});

// In this example we have only two type of nodes: "parent" and "child".
// When a node is created the type is given by its text via a `nodeTextToType` function.
// Then a `nodeTypeSignature` Map associates a type with a signature, i.e. inputs and outputs.

const parents = ['Marge', 'Homer', 'Ned'];
const children = ['Bart', 'Lisa', 'Milhouse', 'Ralph'];

flowView.nodeTextToType = (/** @type {string} */ text) => {
	if (parents.includes(text))
		return 'parent';
	if (children.includes(text))
		return 'child';
}

flowView.nodeTypeSignature
	.set('child', { inputs: [{ name: 'in1' }, { name: 'in2' }] })
	.set('parent', { outputs: [{ name: 'out' }] });

// All good, load the graph.

flowView.load(initialGraph);
