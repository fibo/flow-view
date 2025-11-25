import { FlowView } from 'flow-view';

const containerSelector = 'article#custom-theme .container';
const codeElement = document.querySelector('code');
const styleElement = document.querySelector('style#container-css-props');
const flowViewElement = document.querySelector('flow-view');

function applyCustomTheme() {
	if (!styleElement || !codeElement) return;
	styleElement.textContent = `
	  ${containerSelector} {
	    ${codeElement.textContent}
	  }
	`
}

applyCustomTheme();

const observer = new MutationObserver(() => { applyCustomTheme() });
observer.observe(/** @type {Node} */(codeElement), {
	characterData: true,
	childList: true,
	subtree: true
});

const flowView = FlowView.instance(flowViewElement);

flowView.nodeTypeSignature
	.set('one-one', { inputs: [{ name: 'in1' }], outputs: [{ name: 'out1' }] })

/** @param {string} _text */
flowView.nodeTextToType = (_text) => {
	return 'one-one';
}

flowView.load({
	nodes: {
		id1: {
			text: 'Hello World',
			x: 50,
			y: 50,
		},
	}
})
