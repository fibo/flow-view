import { createDiv } from './common.js';
import { cssClass, cssPrompt } from './style.js';

const optionHighlightedClass = `${cssClass.prompt}__option--highlighted`;

/**
 * @typedef {import('./types').Vector} Vector
 */

export class Prompt {
	highlightedOptionIndex = -1;

	/** @type {string[]} */
	nodeList = [];

	element = createDiv(cssClass.prompt);

	input = document.createElement('input');
	hint = document.createElement('input');
	options = createDiv(`${cssClass.prompt}__options`);

	/**
	 * @param {Vector} position
	 * @param {{ origin: Vector, width: number, height: number }} view
	 * @param {{ delete: () => void, newNode: (text: string) => void }} action
	 */
	constructor({ x, y }, view, action) {
		this.delete = action.delete;
		this.newNode = action.newNode;

		// Avoid overflow, using some heuristic values.
		const overflowY = y - view.origin.y + 40 >= view.height
		const overflowX = x - view.origin.x + cssPrompt.width >= view.width
		this.x = overflowX ? view.width + view.origin.x - cssPrompt.width - 10 : x
		this.y = overflowY ? view.height + view.origin.y - 50 : y

		this.element.style.top = `${this.y - view.origin.y}px`
		this.element.style.left = `${this.x - view.origin.x}px`

		this.hint.classList.add(`${cssClass.prompt}__hint`);
		this.element.append(this.input, this.hint, this.options);

		this._onDblclick = this.onDblclick.bind(this)
		this.element.addEventListener('dblclick', this._onDblclick)
		this._onPointerdown = this.onPointerdown.bind(this)
		this.element.addEventListener('pointerdown', this._onPointerdown)
		this._onPointerleave = this.onPointerleave.bind(this)
		this.element.addEventListener('pointerleave', this._onPointerleave)

		this._onKeydown = this.onKeydown.bind(this)
		this.input.addEventListener('keydown', this._onKeydown)
		this._onKeyup = this.onKeyup.bind(this)
		this.input.addEventListener('keyup', this._onKeyup)
	}

	dispose() {
		const { element, input } = this
		element.removeEventListener('dblclick', this._onDblclick)
		element.removeEventListener('pointerdown', this._onPointerdown)
		element.removeEventListener('pointerleave', this._onPointerdown)
		input.removeEventListener('keydown', this._onKeydown)
		input.removeEventListener('keyup', this._onKeyup)
		element.remove();
	}

	get #completion() { return this.hint.getAttribute('placeholder') ?? '' }

	set #completion(text) { this.hint.setAttribute('placeholder', text) }

	get #matchingNodes() {
		const search = this.input.value.toLowerCase()
		if (search.length === 0) return []
		return this.nodeList.filter(
			(name) =>
				// input value fits into node name...
				name.toLowerCase().startsWith(search) &&
				// ...but they are not the same yet.
				// Otherwise if a text starts with another text, some completions could be missed.
				name.toLowerCase() !== search
		)
	}

	#createNode() {
		const nodeText = this.options?.children?.[this.highlightedOptionIndex]?.textContent ?? this.input.value
		const matchingNodeText = this.nodeList.find(([name]) => name.toLowerCase() === nodeText.toLowerCase())
		this.newNode(matchingNodeText ?? nodeText)
		this.delete()
	}

	/** @param {MouseEvent} event */
	onDblclick(event) {
		event.stopPropagation()
	}

	/** @param {KeyboardEvent} event */
	onKeyup(event) {
		event.stopPropagation()
		switch (event.code) {
			case 'Enter':
				this.#createNode()
				break
			case 'Escape':
				if (this.input.value === '')
					this.delete();
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
				break
			case 'ArrowRight':
			// @ts-ignore
				if (this.input.value.length === event.target.selectionStart) {
					this.#autocomplete()
					this.#resetOptions()
				}
				break
			case 'Backspace':
				this.highlightedOptionIndex = -1
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
					if (0 === this.highlightedOptionIndex)
						this.highlightedOptionIndex = this.options.childElementCount - 1;
					else this.#previousOption();
				} else {
					if (this.options.childElementCount - 1 === this.highlightedOptionIndex)
						this.highlightedOptionIndex = 0;
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

	/** @param {KeyboardEvent} event */
	onKeydown(event) {
		event.stopPropagation()
		if (['ArrowUp', 'Tab'].includes(event.code)) event.preventDefault()
	}

	/** @param {MouseEvent} event */
	onPointerdown(event) {
		event.stopPropagation()
	}

	onPointerleave() {
		this.highlightedOptionIndex = -1
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
		this.highlightedOptionIndex = Math.min(this.highlightedOptionIndex + 1, this.options.childElementCount - 1)
	}

	#previousOption() {
		this.highlightedOptionIndex =
			this.highlightedOptionIndex !== -1 ? Math.max(this.highlightedOptionIndex - 1, 0) : -1
	}

	#highlightOptions() {
		for (let i = 0; i < this.options.childElementCount; i++) {
			const option = this.options.children[i];
			if (this.highlightedOptionIndex === i)
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
				this.highlightedOptionIndex = i
				option.classList.add(optionHighlightedClass);
			}
			option.onpointerleave = () => {
				option.classList.remove(optionHighlightedClass);
			}
			this.options.append(option);
		}
	}

	#resetOptions() {
		this.highlightedOptionIndex = -1;
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
				this.highlightedOptionIndex = -1;
				break;
			case 1: {
				const name = this.#matchingNodes[0];
				if (name.includes(this.input.value))
					this.#completion = name;
				break;
			}
			default: {
				if (this.highlightedOptionIndex !== -1) {
					this.#completion = this.options.children[this.highlightedOptionIndex].textContent ?? ''
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
