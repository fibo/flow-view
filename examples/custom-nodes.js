import { FlowView } from 'flow-view';

const flowView = FlowView.instance(document.querySelector('.container'));

class JsonNode extends HTMLElement {
	/** @type {import('flow-view').HTMLFlowViewElement | undefined} */
	view;
	/** @type {import('flow-view').FlowViewNode | undefined} */
	node;
	content = document.createElement('code');
    pre = document.createElement('pre');
	#isEditing = false;
	text = '';

	connectedCallback() {
		const { pre, content, node } = this;
		pre.classList.add('json-data');
		pre.append(content)

		pre.addEventListener('pointerdown', this)
		content.addEventListener('blur', this)
		content.addEventListener('keydown', this)
		content.addEventListener('input', this)

		this.append(pre);

		if (node)
			this.text = content.textContent = this.#format(node.text);
	}

	disconnectedCallback() {
		const { content, pre } = this
		pre.removeEventListener('pointerdown', this)
		content.removeEventListener('blur', this)
		content.removeEventListener('keydown', this)
		content.removeEventListener('input', this)
	}

	/** @param {Event} event */
	handleEvent(event) {
		event.stopPropagation()

		const { content, node, view } = this;
		if (!view || !node) return;

		if (event.type === 'pointerdown') {
			if (this.#isEditing) {
				content.blur()
				return
			}

			content.setAttribute('contenteditable', 'plaintext-only')
			this.isEditing = true
			view.addEventListener('pointerdown', this)

			content.click()
		}

		if (event.type === 'blur') {
			this.isEditing = false
			view.removeEventListener('pointerdown', this)
			content.removeAttribute('contenteditable')

			const newText = content.textContent

			if (isJSON(newText)) {
				content.textContent = node.text = this.text = this.#format(newText);
				this.hasError = false;
			} else
				this.#revert();
		}

		if (event.type === 'input') {
			this.hasError = !isJSON(this.content.textContent);
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
	set isEditing(value) {
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
	#format(text) {
		return JSON.stringify(JSON.parse(text), null, 2)
	}
}

if (!customElements.get('json-node'))
	customElements.define('json-node', JsonNode);

const jsonNodeSheet = new CSSStyleSheet();
jsonNodeSheet.replaceSync(`
  .json-data {
    font-family: ui-monospace, monospace;
	margin: 0 10px;
	padding: 0.25em;
	border: 1px solid transparent;
  }
  .json-data.is-editing {
	border-color: var(--fv-default-connection-color);
  }
  .json-data.has-error {
	border-color: var(--fv-default-error-color);
  }
  .json-data code {
	outline: none;
  }
`)

flowView.adoptedStyleSheets.push(jsonNodeSheet);

/** @param {string} text */
function isJSON (text) {
	try {
		JSON.parse(text);
		return true;
	} catch (error) {
		return false;
	}
}

flowView.nodeTypeSignature
	.set('json', { outputs: [{ name: 'out' }] })
	.set('+', { inputs: [{ name: 'in1' }, { name: 'in2' }], outputs: [{ name: 'out' }] })

/** @type {import('flow-view').HTMLFlowViewElement['nodeTextToType']} */
flowView.nodeTextToType = (text) => {
	if (isJSON(text)) return 'json'
	if (text === '+') return '+'
}

// Given the node text, the nodeTextToBody function will return an HTMLElement node.

/** @type {import('flow-view').HTMLFlowViewElement['nodeTextToBody']} */
flowView.nodeTextToBody = (text) => {
	if (isJSON(text)) {
			return (node, view) => {
				const element = /** @type {JsonNode} */ (document.createElement('json-node'));
				element.view = view;
				element.node = node;
				return element;
			}
	}
	return undefined;
}

/** @type {import('flow-view').FlowViewGraph} */
const initialGraph = {
	nodes: {
		'id0': {
			x: 50, y: 50, text: JSON.stringify("Click me"),
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
		}
	},
	links: {
		'id3,0': 'id2,0',
		'id3,1': 'id2,0',
	},
};

flowView.load(initialGraph);
