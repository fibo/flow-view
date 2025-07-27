import { FlowView } from 'flow-view';

const containerSelector = 'article#custom-theme .container';
const codeElement = document.querySelector('code');
const styleElement = document.querySelector('style#container-css-props');
const container = document.querySelector(containerSelector);
if (!codeElement || !container || !styleElement)
	throw new Error('Element not found');

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
observer.observe(codeElement, {
	characterData: true,
	childList: true,
	subtree: true
});

const flowView = FlowView.instance(container);

flowView.load({
	nodes: {
		id1: {
			text: 'Hello World',
			x: 50,
			y: 50,
		},
	}
})
