import { FlowView } from 'flow-view';
import { Dflow } from 'dflow';

const flowView = FlowView.instance(document.querySelector('.container'));

const outputsMap = new Map()

// Define a custom node via a WebComponent.
// A custom node can be any HTMLElement.

class JsonNode extends HTMLElement {
	/** @type {import('flow-view').FlowViewNode | undefined} */
	node;
	/** @type {import('flow-view').HTMLFlowViewElement | undefined} */
	view;
	content = document.createElement('code');
    pre = document.createElement('pre');
	#isEditing = false;
	text = '';

	connectedCallback() {
		const { pre, content, node } = this;
		pre.classList.add('data');
		pre.append(content)

		pre.addEventListener('pointerdown', this)
		content.addEventListener('blur', this)
		content.addEventListener('keydown', this)
		content.addEventListener('input', this)

		this.append(pre);

		if (node) {
			this.text = node.text;
			content.textContent = this.#indent(node.text);
		}
	}

	disconnectedCallback() {
		const { content, pre } = this
		pre.removeEventListener('pointerdown', this);
		content.removeEventListener('blur', this);
		content.removeEventListener('keydown', this);
		content.removeEventListener('input', this);
	}

	/** @param {Event} event */
	handleEvent(event) {
		event.stopPropagation();

		const { content, node, view } = this;
		if (!node || !view) return;

		if (event.type === 'pointerdown') {
			if (this.#isEditing) {
				content.blur();
				return;
			}

			content.setAttribute('contenteditable', 'plaintext-only');
			this.#setIsEditing(true);
			view.addEventListener('pointerdown', this);
		}

		if (event.type === 'blur') {
			this.#setIsEditing(false);
			view.removeEventListener('pointerdown', this);
			content.removeAttribute('contenteditable');

			const newText = content.textContent;

			if (typeof newText === 'string' && isJSON(newText)) {
				content.textContent = this.#indent(newText);
				node.text = this.text = JSON.stringify(JSON.parse(newText));
				this.hasError = false;
			} else
				this.#revert();
		}

		if (event.type === 'input') {
			const text = this.content.textContent;
			if (typeof text === 'string')
				this.hasError = !isJSON(text);
		}

		if (event.type === 'keydown') {
			const code = /** @type {KeyboardEvent} */ (event).code;
			if (code === 'Enter')
				content.blur();
			if (code === 'Escape') {
				this.#revert();
				content.blur();
			}
		}
	}

	/** @param {boolean} value */
	#setIsEditing(value) {
		if (this.#isEditing !== value)
			this.pre.classList.toggle('is-editing');
		this.#isEditing = value;
	}

	/** @param {boolean} value */
	set hasError(value) {
		if (value)
			this.pre.classList.add('has-error');
		else
			this.pre.classList.remove('has-error');
	}

	#revert() {
		this.content.textContent = this.text
		this.hasError = false;
	}

	/** @param {string} text */
	#indent(text) {
		return JSON.stringify(JSON.parse(text), null, 2)
	}
}

if (!customElements.get('json-node'))
	customElements.define('json-node', JsonNode);

class OutputNode extends HTMLElement {
	/** @type {import('flow-view').FlowViewNode | undefined} */
	node;
	content = document.createElement('code');
    pre = document.createElement('pre');

	connectedCallback() {
		const { pre, content, node } = this;
		pre.classList.add('data');
		pre.append(content)

		this.append(pre);

		if (node) {
			outputsMap.set(node.id, (text = '') => {
				if (text)
					content.textContent = JSON.stringify(JSON.parse(text), null, 2);
				else
					content.textContent = '';
			})
		}
	}
}

if (!customElements.get('output-node'))
	customElements.define('output-node', OutputNode);

class ToggleNode extends HTMLElement {
	/** @type {import('flow-view').FlowViewNode | undefined} */
	node;
	toggle = document.createElement('div');

	connectedCallback() {
		const { toggle, node } = this;
		toggle.classList.add('toggle');
		toggle.addEventListener('pointerdown', this);
		this.append(toggle);
		if (!node) return;
		if (node.text === 'true')
			toggle.classList.add('selected');
		else
			toggle.classList.remove('selected');
	}

	disconnectedCallback() {
		this.toggle.removeEventListener('pointerdown', this);
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'pointerdown') {
			event.stopPropagation();
			const { node, toggle } = this
			if (!node) return;
			if (node.text === 'true') {
				node.text = 'false';
				toggle.classList.remove('selected');
			} else {
				node.text = 'true';
				toggle.classList.add('selected');
			}
		}
	}
}

if (!customElements.get('toggle-node'))
	customElements.define('toggle-node', ToggleNode);

// Styling can be added via adoptedStyleSheets.

const customNodesSheet = new CSSStyleSheet();
customNodesSheet.replaceSync(`
  .data {
    font-family: ui-monospace, monospace;
	min-height: 1.2em;
	margin: 0 10px;
	padding: 0.25em;
	border: 1px solid transparent;
	cursor: default;
  }
  .data.is-editing {
	border-color: var(--fv-default-connection-color);
  }
  .data.has-error {
	border-color: var(--fv-default-error-color);
  }
  .data code {
	outline: none;
  }

  .toggle {
    height: 20px;
	width: 20px;
	margin: auto;
    border: 1px solid gainsboro;
	border-radius: 4px;
  }
  .toggle.selected {
    border-color: dimgray;
    background: dimgray;
  }
`)

flowView.adoptedStyleSheets.push(customNodesSheet);

// There is also a "+" node in the demo, see also PlusDflowNode below.
flowView.nodeList.add('+').add('if');

// Add also few other suggestions.
flowView.nodeList.add('true').add('false').add('null');

flowView.nodeTypeSignature
	.set('json', { outputs: [{ name: 'out' }] })
	.set('output', { inputs: [{ name: 'in' } ] })
	.set('if', { inputs: [{ name: 'condition' }, { name: 'then' }, { name: 'else' }], outputs: [{ name: 'out' }] })
	.set('+', { inputs: [{ name: 'in1' }, { name: 'in2' }], outputs: [{ name: 'out' }] })

/** @param {string} text */
function isJSON (text) {
	try {
		JSON.parse(text);
		return true;
	} catch (error) {
		return false;
	}
}

/** @type {import('flow-view').HTMLFlowViewElement['nodeTextToType']} */
function nodeTextToType (text) {
	if (isJSON(text))
		return 'json';

	if (text === '+')
		return '+';

	if (text === '')
		return 'output';

	// View node text is dflow node kind.
	return text;
}

flowView.nodeTextToType = nodeTextToType;

// Given the node text, the nodeTextToBody function will return an HTMLElement node.

/** @type {import('flow-view').HTMLFlowViewElement['nodeTextToBody']} */
flowView.nodeTextToBody = (text) => {
	if (isJSON(text)) {
		// The ToggleNode is a special case for nodes which text is JSON.
		if (text === 'true' || text === 'false')
			return (node) => {
				const element = /** @type {ToggleNode} */ (document.createElement('toggle-node'));
				element.node = node;
				return element;
			}

		return (node, view) => {
			const element = /** @type {JsonNode} */ (document.createElement('json-node'));
			element.node = node;
			element.view = view;
			return element;
		}
	}

	if (text === '')
		return (node) => {
			const element = /** @type {JsonNode} */ (document.createElement('output-node'));
			element.node = node;
			return element;
		}

	// If returns undefined, it means it will get the default FlowViewNode.
	return undefined;
}

/** @type {import('flow-view').FlowViewGraph} */
const initialGraph = {
	nodes: {
		'id0': {
			x: 50, y: 50, text: JSON.stringify('Click me'),
		},
		'id1': {
			x: 50, y: 150, text: JSON.stringify({
				foo: 1,
				bar: 2
			})
		},
		'id2': {
			x: 350, y: 90, text: JSON.stringify(42)
		},
		'id3': {
			x: 350, y: 170, text: '+'
		},
		'id4': {
			x: 350, y: 260, text: '',
		},
		'id5': {
			x: 220, y: 120, text: JSON.stringify(true)
		},
		'id6': {
			x: 240, y: 170, text: JSON.stringify(10)
		},
		'id7': {
			x: 220, y: 250, text: 'if'
		},
		'id8': {
			x: 220, y: 320, text: ''
		},
	},
	links: {
		'id3,0': 'id2,0',
		'id3,1': 'id2,0',
		'id4,0': 'id3,0',
		'id7,0': 'id5,0',
		'id7,1': 'id6,0',
		'id7,2': 'id2,0',
		'id8,0': 'id7,0',
	},
};

// FlowView is pure UI, it does not ship any Dataflow programmin engine.
// Let's use Dflow to provide a minimal example.
// See https://github.com/fibo/dflow

const PlusDflowNode = {
	kind: '+',
	inputs: [{ types: [] }, { types: [] }],
	outputs: [{ types: [] }],
	/**
	 * @param {unknown} a
	 * @param {unknown} b
	 */
	run(a, b) {
		if (typeof a === 'number' && typeof b === 'number')
			return a + b;
		if (typeof a === 'string' && typeof b === 'string')
			return a + b;
	}
};

const IfDflowNode = {
	kind: 'if',
	inputs: [{ types: [], name: 'condition' }, { types: [], name: 'then' }, { types: [], name: 'else' }],
	outputs: [{ types: [] }],
	/**
	 * @param {unknown} condition
	 * @param {unknown} thenBranch
	 * @param {unknown} elseBranch
	 */
	run(condition, thenBranch, elseBranch) {
		return condition ? thenBranch : elseBranch
	}
}

const OutputDflowNode = {
	kind: 'output',
	inputs: [{ types: [] }],
	// The output of the OutputDflowNode is not visible in the UI.
	outputs: [{ types: [] }],
	/** @param {unknown} a */
	run(a) {
		try {
			return JSON.stringify(a)
		} catch(_ignore) {}
	}
}

const nodeDefinitions = [
	PlusDflowNode,
	IfDflowNode,
	OutputDflowNode
];

let dflow = new Dflow(nodeDefinitions)

/** @param {Record<string, { text: string }>} nodes */
function createDflowNodes(nodes) {
	for (const [id, { text }] of Object.entries(nodes)) {
		const type = nodeTextToType(text)
		if (type === 'json') {
			dflow.data(JSON.parse(text), id);
		} else {
			dflow.node(type, id);
		}
	}
}

/** @param {Record<string, string>} links */
function createDflowLinks(links) {
	for (const [target, source] of Object.entries(links)) {
		const [sourceNodeId, sourcePosition] = source.split(',');
		const [targetNodeId, targetPosition] = target.split(',');
		dflow.link([sourceNodeId, +sourcePosition], [targetNodeId, +targetPosition])
	}
}

function runGraph() {
	dflow.run()
	const out = dflow.out;
	for (const [nodeId, setter] of outputsMap.entries()) {
		// @ts-ignore
		const value = out[nodeId][0];
		setter(value);
	}
}

flowView.addEventListener('fv:change', ({ detail }) => {
	if (detail.load) {
		createDflowNodes(detail.load.nodes);
		createDflowLinks(detail.load.links);
		runGraph();
	}
	if (detail.create) {
		createDflowNodes(detail.create.nodes);
		createDflowLinks(detail.create.links);
		runGraph();
	}
	if (detail.delete) {
		for (const id of Object.keys(detail.delete.links))
			dflow.delete(id);
		for (const id of Object.keys(detail.delete.nodes))
			dflow.delete(id);
		runGraph();
	}
	if (detail.updateText) {
		dflow = new Dflow(nodeDefinitions);
		const graph = flowView.graph;
		createDflowNodes(graph.nodes);
		createDflowLinks(graph.links);
		runGraph();
	}
});

// Finally load the graph.
flowView.load(initialGraph);
