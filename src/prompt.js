import { Container, createDiv, stop } from './common.js';
import { cssClass } from './style.js';

/**
 * @typedef {import('./types').Vector} Vector
 *
 * @typedef {{
 *   delete: () => void,
 *   newNode: (text: string) => void
 * }} PromptAction
 */

const eventTypes = {
	container: ['dblclick', 'pointerdown', 'pointerleave'],
    input: ['keydown', 'keyup']
};

export class Prompt {
	container = new Container(cssClass.prompt);
	input = document.createElement('input');
	hint = document.createElement('input');
	options = createDiv(cssClass.promptOptions);

	/** @type {Set<string>} */
	#nodeList;

	#highlightedOptionIndex = -1;

	/** @type {PromptAction} */
	#action;

	/**
	 * @param {Set<string>} nodeList
	 * @param {Vector} position
	 * @param {PromptAction} action
	 */
	constructor(nodeList, position, action) {
		this.#nodeList = nodeList;
		this.#action = action;

		const { container, hint, input } = this;

		hint.classList.add(cssClass.promptHint);
		container.element.append(input, hint, this.options);

		container.position = position;
		container.setElementPosition();

		eventTypes.container.forEach(eventType => container.element.addEventListener(eventType, this));
		eventTypes.input.forEach(eventType => input.addEventListener(eventType, this));
	}

	dispose() {
		const { container, input } = this;
		eventTypes.container.forEach(eventType => container.element.removeEventListener(eventType, this));
		eventTypes.input.forEach(eventType => input.removeEventListener(eventType, this));
		container.element.remove();
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'dblclick' || event.type === 'pointerdown')
			return stop(event);

		if (event.type === 'pointerleave') {
			this.#highlightedOptionIndex = -1;
			return;
		}

		if (event instanceof KeyboardEvent && event.type === 'keydown') {
			stop(event);
			if (['ArrowUp', 'Tab'].includes(event.code)) event.preventDefault();
			return;
		}

		if (event instanceof KeyboardEvent && event.type === 'keyup') {
			stop(event);
			switch (event.code) {
				case 'Enter':
					this.#createNode();
					break;
				case 'Escape':
					if (this.input.value === '')
						this.#action.delete();
					else {
						this.#completion = '';
						this.input.value = '';
						this.#resetOptions();
					}
					break;
				case 'ArrowLeft':
				case 'ShiftLeft':
				case 'ShiftRight':
					break;
				case 'ArrowDown':
					this.#fixCase();
					this.#nextOption();
					this.#highlightOptions();
					this.#setCompletion();
					break;
				case 'ArrowUp':
					event.preventDefault();
					this.#fixCase();
					this.#previousOption();
					this.#highlightOptions();
					this.#setCompletion();
					break;
				case 'ArrowRight':
					if (this.input.value.length === this.input.selectionStart) {
						this.#autocomplete();
						this.#resetOptions();
					}
					break;
				case 'Backspace':
					this.#highlightedOptionIndex = -1;
					this.#createOptions();
					this.#setCompletion();
					break;
				case 'Tab': {
					event.preventDefault();
					// Fix case with Tab.
					this.#fixCase();
					// Exact match.
					if (this.#matchingNodes.length === 1) {
						this.#setCompletion();
						this.#autocomplete();
						this.#resetOptions();
						break;
					}
					// Use Tab or Shift-Tab to highlight options ciclically.
					if (event.shiftKey) {
						if (0 === this.#highlightedOptionIndex)
							this.#highlightedOptionIndex = this.options.childElementCount - 1;
						else this.#previousOption();
					} else {
						if (this.options.childElementCount - 1 === this.#highlightedOptionIndex)
							this.#highlightedOptionIndex = 0;
						else this.#nextOption();
					}
					this.#createOptions();
					this.#setCompletion();
					this.#highlightOptions();
					break;
				}
				default:
					this.#createOptions();
					this.#setCompletion();
			}
		}
	}

	get #completion() { return this.hint.getAttribute('placeholder') ?? '' }

	set #completion(text) { this.hint.setAttribute('placeholder', text) }

	get #matchingNodes() {
		const search = this.input.value.toLowerCase();
		if (search.length === 0) return [];
		return Array.from(this.#nodeList).filter(name =>
			// input value fits into node name...
			name.toLowerCase().startsWith(search) &&
			// ...but they are not the same yet.
			// Otherwise if a text starts with another text, some completions could be missed.
			name.toLowerCase() !== search
		);
	}

	#createNode() {
		const nodeText = this.options.children?.[this.#highlightedOptionIndex]?.textContent ?? this.input.value;
		const exactMatch = this.#nodeList.has(nodeText) ? nodeText : undefined;
		if (exactMatch)
			this.#action.newNode(exactMatch);
		else {
			const nodeTextLowerCase = nodeText.toLowerCase();
			let foundCaseInsensitiveMatch = false;
			for (const name of this.#nodeList)
				if (name.toLowerCase() === nodeTextLowerCase) {
					foundCaseInsensitiveMatch = true;
					this.#action.newNode(name);
					break;
				}
			if (!foundCaseInsensitiveMatch)
				this.#action.newNode(nodeText);
		}
		this.#action.delete();
	}

	#deleteOptions() {
		while (this.options.firstChild)
			if (this.options.lastChild)
				 this.options.removeChild(this.options.lastChild);
	}

	#autocomplete() { if (this.#completion) this.input.value = this.#completion }

	#nextOption() {
		this.#highlightedOptionIndex = Math.min(this.#highlightedOptionIndex + 1, this.options.childElementCount - 1);
	}

	#previousOption() {
		this.#highlightedOptionIndex = this.#highlightedOptionIndex !== -1 ? Math.max(this.#highlightedOptionIndex - 1, 0) : -1;
	}

	#highlightOptions() {
		for (let i = 0; i < this.options.childElementCount; i++) {
			const option = this.options.children[i];
			if (this.#highlightedOptionIndex === i)
				option.classList.add(cssClass.promptOptionHighlighted);
			else
				option.classList.remove(cssClass.promptOptionHighlighted);
		}
	}

	#createOptions() {
		this.#deleteOptions();
		for (let i = 0; i < this.#matchingNodes.length; i++) {
			const name = this.#matchingNodes[i];
			const option = createDiv(cssClass.promptOption);
			option.textContent = name;
			option.onclick = () => {
				this.input.value = name;
				this.#createNode();
			}
			option.onpointerenter = () => {
				this.#highlightedOptionIndex = i;
				option.classList.add(cssClass.promptOptionHighlighted);
			}
			option.onpointerleave = () => {
				option.classList.remove(cssClass.promptOptionHighlighted);
			}
			this.options.append(option);
		}
	}

	#resetOptions() {
		this.#highlightedOptionIndex = -1;
		this.#deleteOptions();
	}

	#caseInsensitiveMatchingNode() {
		return this.#matchingNodes.find(name =>
			!name.startsWith(this.input.value) && name.toLowerCase().startsWith(this.input.value.toLowerCase())
		)
	}

	#fixCase() {
		const text = this.#caseInsensitiveMatchingNode();
		if (!text) return;
		this.input.value = text.substring(0, this.input.value.length);
		this.#setCompletion();
	}

	#setCompletion() {
		switch (this.#matchingNodes.length) {
			case 0:
				this.#completion = '';
				this.#highlightedOptionIndex = -1;
				break;
			case 1: {
				const name = this.#matchingNodes[0];
				if (name.includes(this.input.value))
					this.#completion = name;
				break;
			}
			default: {
				if (this.#highlightedOptionIndex !== -1) {
					this.#completion = this.options.children[this.#highlightedOptionIndex].textContent ?? '';
					break;
				}
				this.#completion = this.input.value;

				const shortestMatch = this.#matchingNodes.reduce((shortest, match) =>
					shortest.length < match.length ? shortest : match
				);

				for (let i = this.input.value.length; i < shortestMatch.length; i++) {
					const currentChar = shortestMatch[i];
					if (this.#matchingNodes.every((name) => name.startsWith(this.#completion + currentChar))) {
						this.#completion += currentChar;
					}
				}
			}
		}
	}
}
