import { cssTransition, cssVar } from "./theme.js"
import { FlowViewBase } from "./base.js"
import { FlowViewNode } from "./node.js"

/**
 * @typedef {import('./types').Vector} Vector
 */

export class FlowViewSelector extends FlowViewBase {
	static cssClassName = "fv-selector"
	static zIndex = FlowViewNode.zIndex + 1
	static width = 170
	static padding = 9
	static style = {
		[`.${FlowViewSelector.cssClassName}`]: {
			position: "absolute",
			"box-shadow": cssVar.boxShadow,
			"z-index": FlowViewSelector.zIndex
		},
		[`.${FlowViewSelector.cssClassName} input`]: {
			border: 0,
			margin: 0,
			outline: 0,
			"border-radius": cssVar.borderRadius,
			"font-family": cssVar.fontFamily,
			"font-size": cssVar.fontSize,
			padding: `${FlowViewSelector.padding}px`,
			width: `${FlowViewSelector.width - 2 * FlowViewSelector.padding}px`
		},
		[`.${FlowViewSelector.cssClassName}__hint`]: {
			position: "absolute",
			left: "0",
			background: "transparent",
			"pointer-events": "none"
		},
		[`.${FlowViewSelector.cssClassName}__hint::placeholder`]: {
			opacity: "0.4"
		},
		[`.${FlowViewSelector.cssClassName}__options`]: {
			"background-color": cssVar.nodeBackgroundColor,
			height: "fit-content"
		},
		[`.${FlowViewSelector.cssClassName}__option`]: {
			padding: "0.5em",
			border: "1px solid transparent",
			cursor: "default",
			...cssTransition("border-color")
		},
		[`.${FlowViewSelector.cssClassName}__option--highlighted`]: {
			"border-color": cssVar.borderColorHighlighted
		}
	}

	// @ts-ignore
	init({ nodeList, position }) {
		const { element } = this
		element.setAttribute("tabindex", '0')

		this.hint = this.createElement("input", `${FlowViewSelector.cssClassName}__hint`)

		const input = (this.input = this.createElement("input"))
	// @ts-ignore

		this.options = this.createElement("div", [`${FlowViewSelector.cssClassName}__options`])

		this.nodeList = nodeList
		this.position = position
		this.highlightedOptionIndex = -1

		this._onDblclick = this.onDblclick.bind(this)
		element.addEventListener("dblclick", this._onDblclick)
		this._onPointerdown = this.onPointerdown.bind(this)
		element.addEventListener("pointerdown", this._onPointerdown)
		this._onPointerleave = this.onPointerleave.bind(this)
		element.addEventListener("pointerleave", this._onPointerleave)

		this._onKeydown = this.onKeydown.bind(this)
		input.addEventListener("keydown", this._onKeydown)
		this._onKeyup = this.onKeyup.bind(this)
		input.addEventListener("keyup", this._onKeyup)
	}

	dispose() {
		const { element, input } = this
		// @ts-ignore
		element.removeEventListener("dblclick", this._onDblclick)
		// @ts-ignore
		element.removeEventListener("pointerdown", this._onPointerdown)
		// @ts-ignore
		element.removeEventListener("pointerleave", this._onPointerdown)
		// @ts-ignore
		input.removeEventListener("keydown", this._onKeydown)
		// @ts-ignore
		input.removeEventListener("keyup", this._onKeyup)
	}

	focus() {
		// @ts-ignore
		this.input.focus()
	}

	get completion() {
		// @ts-ignore
		return this.hint.getAttribute("placeholder")
	}

	set completion(text) {
		// @ts-ignore
		this.hint.setAttribute("placeholder", text)
	}

	get matchingNodes() {
		// @ts-ignore
		const search = this.input.value.toLowerCase()
		if (search.length === 0) return []
		return this.nodeList.filter(
		// @ts-ignore
			(name) =>
				// input value fits into node name...
				name.toLowerCase().startsWith(search) &&
				// ...but they are not the same yet.
				// Otherwise if a text starts with another text, some completions could be missed.
				name.toLowerCase() !== search
		)
	}

	/** @param {Vector} position */
	set position({ x, y }) {
		const { element, view } = this

		// Avoid overflow, using some heuristic values.
		const overflowY = y - view.origin.y + 40 >= view.height
		const overflowX = x - view.origin.x + FlowViewSelector.width >= view.width
		const _x = overflowX ? view.width + view.origin.x - FlowViewSelector.width - 10 : x
		const _y = overflowY ? view.height + view.origin.y - 50 : y

		element.style.top = `${_y - view.origin.y}px`
		element.style.left = `${_x - view.origin.x}px`

		this.x = _x
		this.y = _y
	}

	get position() {
		// @ts-ignore
		return { x: this.x, y: this.y }
	}

	createNode() {
		// @ts-ignore
		const nodeText = this.options?.children?.[this.highlightedOptionIndex]?.textContent ?? this.input.value
		// @ts-ignore
		const matchingNodeText = this.nodeList.find(([name]) => name.toLowerCase() === nodeText.toLowerCase())
		this.view.newNode({
			x: this.position.x,
			y: this.position.y,
			text: matchingNodeText ?? nodeText
		}, {})
		this.view.removeSelector()
	}

	/** @param {MouseEvent} event */
	onDblclick(event) {
		event.stopPropagation()
	}

	/** @param {KeyboardEvent} event */
	onKeyup(event) {
		event.stopPropagation()
		const highlightedClassName = `${FlowViewSelector.cssClassName}__option--highlighted`
		const highlightOptions = () => {
			// @ts-ignore
			for (let i = 0; i < this.options.childElementCount; i++) {
			// @ts-ignore
				const option = this.options.children[i]
				if (this.highlightedOptionIndex === i) option.classList.add(highlightedClassName)
				else option.classList.remove(highlightedClassName)
			}
		}
		const nextOption = () => {
			// @ts-ignore
			this.highlightedOptionIndex = Math.min(this.highlightedOptionIndex + 1, this.options.childElementCount - 1)
		}
		const previousOption = () => {
			this.highlightedOptionIndex =
				this.highlightedOptionIndex !== -1 ? Math.max(this.highlightedOptionIndex - 1, 0) : -1
		}
		const deleteOptions = () => {
			// @ts-ignore
			while (this.options.firstChild) this.options.removeChild(this.options.lastChild)
		}
		const resetOptions = () => {
			this.highlightedOptionIndex = -1
			deleteOptions()
		}
		const createOptions = () => {
			deleteOptions()
			for (let i = 0; i < this.matchingNodes.length; i++) {
				const name = this.matchingNodes[i]
				const option = document.createElement("div")
				option.classList.add(`${FlowViewSelector.cssClassName}__option`)
				option.textContent = name
				option.onclick = () => {
			// @ts-ignore
					this.input.value = name
					this.createNode()
				}
				option.onpointerenter = () => {
					this.highlightedOptionIndex = i
					option.classList.add(highlightedClassName)
				}
				option.onpointerleave = () => {
					option.classList.remove(highlightedClassName)
				}
			// @ts-ignore
				this.options.append(option)
			}
		}
		const setCompletion = () => {
			switch (this.matchingNodes.length) {
				case 0:
					this.completion = ""
					this.highlightedOptionIndex = -1
					break
				case 1: {
					const name = this.matchingNodes[0]
			// @ts-ignore
					if (name.includes(this.input.value)) this.completion = name
					break
				}
				default:
					if (this.highlightedOptionIndex === -1) {
			// @ts-ignore
						this.completion = this.input.value

			// @ts-ignore
						const shortestMatch = this.matchingNodes.reduce((shortest, match) =>
							shortest.length < match.length ? shortest : match
						)

			// @ts-ignore
						for (let i = this.input.value.length; i < shortestMatch.length; i++) {
							const currentChar = shortestMatch[i]
			// @ts-ignore
							if (this.matchingNodes.every((name) => name.startsWith(this.completion + currentChar))) {
								this.completion += currentChar
							}
						}
					} else {
			// @ts-ignore
						this.completion = this.options.children[this.highlightedOptionIndex].textContent
					}
			}
		}
		const autocomplete = () => {
			// @ts-ignore
			if (this.completion) this.input.value = this.completion
		}
		const caseInsensitiveMatchingNode = () =>
			this.matchingNodes.find(
			// @ts-ignore
				(name) =>
			// @ts-ignore
					!name.startsWith(this.input.value) && name.toLowerCase().startsWith(this.input.value.toLowerCase())
			)
		const fixCase = () => {
			const text = caseInsensitiveMatchingNode()
			if (!text) return
			// @ts-ignore
			this.input.value = text.substring(0, this.input.value.length)
			setCompletion()
		}

		switch (event.code) {
			case "Enter":
				this.createNode()
				break
			case "Escape":
			// @ts-ignore
				if (this.input.value === "") this.view.removeSelector()
				else {
					this.completion = ""
			// @ts-ignore
					this.input.value = ""
					resetOptions()
				}
				break
			case "ArrowLeft":
			case "ShiftLeft":
			case "ShiftRight":
				break
			case "ArrowDown":
				fixCase()
				nextOption()
				highlightOptions()
				setCompletion()
				break
			case "ArrowUp":
				event.preventDefault()
				fixCase()
				previousOption()
				highlightOptions()
				setCompletion()
				break
			case "ArrowRight":
			// @ts-ignore
				if (this.input.value.length === event.target.selectionStart) {
					autocomplete()
					resetOptions()
				}
				break
			case "Backspace":
				this.highlightedOptionIndex = -1
				createOptions()
				setCompletion()
				break
			case "Tab": {
				event.preventDefault()
				// Fix case with Tab.
				fixCase()
				// Exact match.
				if (this.matchingNodes.length === 1) {
					setCompletion()
					autocomplete()
					resetOptions()
					break
				}
				// Use Tab or Shift-Tab to highlight options ciclically.
				if (event.shiftKey) {
					if (0 === this.highlightedOptionIndex) {
			// @ts-ignore
						this.highlightedOptionIndex = this.options.childElementCount - 1
					} else {
						previousOption()
					}
				} else {
			// @ts-ignore
					if (this.options.childElementCount - 1 === this.highlightedOptionIndex) {
						this.highlightedOptionIndex = 0
					} else {
						nextOption()
					}
				}
				createOptions()
				setCompletion()
				highlightOptions()
				break
			}
			default:
				createOptions()
				setCompletion()
		}
	}

	/** @param {KeyboardEvent} event */
	onKeydown(event) {
		event.stopPropagation()
		if (["ArrowUp", "Tab"].includes(event.code)) event.preventDefault()
	}

	/** @param {MouseEvent} event */
	onPointerdown(event) {
		event.stopPropagation()
	}

	onPointerleave() {
		this.highlightedOptionIndex = -1
	}
}
