import { createDiv } from './common.js';
import { cssClass, cssPrompt } from './style.js';

/**
 * @typedef {import('./types').Vector} Vector
 */

const optionHighlightedClass = `${cssClass.prompt}__option--highlighted`;

export class Prompt {
	element = createDiv(cssClass.prompt);

	input = document.createElement('input');
	hint = document.createElement('input');
	options = createDiv(`${cssClass.prompt}__options`);

	/** @type {Set<string>} */
	#nodeList;

	#highlightedOptionIndex = -1;

	/**
	 * @type {{
	 *   delete: () => void,
	 *   newNode: (text: string) => void
	 * }} action
	 */
	#action;

	/**
	 * @param {Set<string>} nodeList
	 * @param {Vector} position
	 * @param {{
	 *   origin: Vector,
	 *   width: number,
	 *   height: number
	 * }} view
	 * @param {{
	 *   delete: () => void,
	 *   newNode: (text: string) => void
	 * }} action
	 */
	constructor(nodeList, { x, y }, view, action) {
		this.#nodeList = nodeList;
		this.#action = action

		// Avoid overflow, using some heuristic values.
		const overflowY = y - view.origin.y + 40 >= view.height
		const overflowX = x - view.origin.x + cssPrompt.width >= view.width
		this.x = overflowX ? view.width + view.origin.x - cssPrompt.width - 10 : x
		this.y = overflowY ? view.height + view.origin.y - 50 : y

		this.element.style.top = `${this.y - view.origin.y}px`
		this.element.style.left = `${this.x - view.origin.x}px`

		this.hint.classList.add(`${cssClass.prompt}__hint`);
		this.element.append(this.input, this.hint, this.options);

		this.element.addEventListener('dblclick', this)
		this.element.addEventListener('pointerdown', this)
		this.element.addEventListener('pointerleave', this)

		this.input.addEventListener('keydown', this)
		this.input.addEventListener('keyup', this)
	}

	dispose() {
		const { element, input } = this
		element.removeEventListener('dblclick', this)
		element.removeEventListener('pointerdown', this)
		element.removeEventListener('pointerleave', this)
		input.removeEventListener('keydown', this)
		input.removeEventListener('keyup', this)
		element.remove();
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'dblclick') {
			event.stopPropagation()
			return
		}

		if (event.type === 'pointerdown') {
			event.stopPropagation()
			return
		}

		if (event.type === 'pointerleave') {
			this.#highlightedOptionIndex = -1
			return
		}

		if (event instanceof KeyboardEvent && event.type === 'keydown') {
			event.stopPropagation()
			if (['ArrowUp', 'Tab'].includes(event.code)) event.preventDefault()
			return
		}

		if (event instanceof KeyboardEvent && event.type === 'keyup') {
			event.stopPropagation()
			switch (event.code) {
				case 'Enter':
					this.#createNode()
					break
				case 'Escape':
					if (this.input.value === '')
						this.#action.delete();
					else {
						this.#completion = '';
						this.input.value = '';
						this.#resetOptions();
					}
					break
				case 'ArrowLeft':
				case 'ShiftLeft':
				case 'ShiftRight':
					break;
				case 'ArrowDown':
					this.#fixCase()
					this.#nextOption()
					this.#highlightOptions()
					this.#setCompletion();
					break;
				case 'ArrowUp':
					event.preventDefault()
					this.#fixCase()
					this.#previousOption()
					this.#highlightOptions()
					this.#setCompletion();
					break;
				case 'ArrowRight':
					if (this.input.value.length === this.input.selectionStart) {
						this.#autocomplete()
						this.#resetOptions()
					}
					break;
				case 'Backspace':
					this.#highlightedOptionIndex = -1
					this.#createOptions()
					this.#setCompletion();
					break
				case 'Tab': {
					event.preventDefault()
					// Fix case with Tab.
					this.#fixCase()
					// Exact match.
					if (this.#matchingNodes.length === 1) {
						this.#setCompletion();
						this.#autocomplete()
						this.#resetOptions()
						break
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
					this.#highlightOptions()
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
		const search = this.input.value.toLowerCase()
		if (search.length === 0) return []
		return Array.from(this.#nodeList).filter(
			(name) =>
				// input value fits into node name...
				name.toLowerCase().startsWith(search) &&
				// ...but they are not the same yet.
				// Otherwise if a text starts with another text, some completions could be missed.
				name.toLowerCase() !== search
		)
	}

	#createNode() {
		const nodeText = this.options.children?.[this.#highlightedOptionIndex]?.textContent ?? this.input.value;
		const exactMatch = this.#nodeList.has(nodeText) ? nodeText : undefined;
		if (exactMatch) {
			this.#action.newNode(exactMatch);
		} else {
			const nodeTextLowerCase = nodeText.toLowerCase();
			for (const name of this.#nodeList)
				if (name.toLowerCase() === nodeTextLowerCase) {
					// Exact match (case-insensitive).
					this.#action.newNode(name);
					break;
				}
			this.#action.newNode(nodeText);
		}
		this.#action.delete();
	}

	#deleteOptions() {
		while (this.options.firstChild) {
			const lastChild = this.options.lastChild;
			if (lastChild) this.options.removeChild(lastChild);
		}
	}

	#autocomplete() {
		if (this.#completion) this.input.value = this.#completion
	}

	#nextOption() {
		this.#highlightedOptionIndex = Math.min(this.#highlightedOptionIndex + 1, this.options.childElementCount - 1)
	}

	#previousOption() {
		this.#highlightedOptionIndex =
			this.#highlightedOptionIndex !== -1 ? Math.max(this.#highlightedOptionIndex - 1, 0) : -1
	}

	#highlightOptions() {
		for (let i = 0; i < this.options.childElementCount; i++) {
			const option = this.options.children[i];
			if (this.#highlightedOptionIndex === i)
				option.classList.add(optionHighlightedClass);
			else
				option.classList.remove(optionHighlightedClass);
		}
	}

	#createOptions() {
		this.#deleteOptions();
		for (let i = 0; i < this.#matchingNodes.length; i++) {
			const name = this.#matchingNodes[i]
			const option = createDiv(`${cssClass.prompt}__option`)
			option.textContent = name
			option.onclick = () => {
				this.input.value = name
				this.#createNode()
			}
			option.onpointerenter = () => {
				this.#highlightedOptionIndex = i
				option.classList.add(optionHighlightedClass);
			}
			option.onpointerleave = () => {
				option.classList.remove(optionHighlightedClass);
			}
			this.options.append(option);
		}
	}

	#resetOptions() {
		this.#highlightedOptionIndex = -1;
		this.#deleteOptions();
	}

	#caseInsensitiveMatchingNode() {
		return this.#matchingNodes.find(
			(name) =>
				!name.startsWith(this.input.value) && name.toLowerCase().startsWith(this.input.value.toLowerCase())
		)
	}

	#fixCase() {
		const text = this.#caseInsensitiveMatchingNode()
		if (!text) return
		this.input.value = text.substring(0, this.input.value.length)
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
					this.#completion = this.options.children[this.#highlightedOptionIndex].textContent ?? ''
					break;
				}
				this.#completion = this.input.value

				const shortestMatch = this.#matchingNodes.reduce((shortest, match) =>
					shortest.length < match.length ? shortest : match
				);

				for (let i = this.input.value.length; i < shortestMatch.length; i++) {
					const currentChar = shortestMatch[i]
					if (this.#matchingNodes.every((name) => name.startsWith(this.#completion + currentChar))) {
						this.#completion += currentChar
					}
				}
			}
		}
	}
}
