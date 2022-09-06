import { cssTransition, cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";
import { FlowViewNode } from "./node.js";

export class FlowViewSelector extends FlowViewBase {
	static cssClassName = "fv-selector";
	static zIndex = FlowViewNode.zIndex + 1;
	static width = 216;
	static padding = 9;
	static style = {
		[`.${FlowViewSelector.cssClassName}`]: {
			position: "absolute",
			"box-shadow": cssVar.boxShadow,
			"z-index": FlowViewSelector.zIndex,
		},
		[`.${FlowViewSelector.cssClassName} input`]: {
			border: 0,
			margin: 0,
			outline: 0,
			"border-radius": cssVar.borderRadius,
			"font-family": cssVar.fontFamily,
			"font-size": cssVar.fontSize,
			padding: `${FlowViewSelector.padding}px`,
			width: `${FlowViewSelector.width - 2 * FlowViewSelector.padding}px`,
		},
		[`.${FlowViewSelector.cssClassName}__hint`]: {
			position: "absolute",
			left: "0",
			background: "transparent",
			"pointer-events": "none",
		},
		[`.${FlowViewSelector.cssClassName}__hint::placeholder`]: {
			opacity: "0.4",
		},
		[`.${FlowViewSelector.cssClassName}__options`]: {
			"background-color": cssVar.nodeBackgroundColor,
			height: "fit-content",
		},
		[`.${FlowViewSelector.cssClassName}__option`]: {
			padding: "0.5em",
			border: "1px solid transparent",
			cursor: "default",
			...cssTransition("border-color"),
		},
		[`.${FlowViewSelector.cssClassName}__option--highlighted`]: {
			"border-color": cssVar.borderColorHighlighted,
		},
	};

	init({ nodeNameTypeMap, position }) {
		const { element } = this;
		element.setAttribute("tabindex", 0);

		this.hint = this.createElement("input", `${FlowViewSelector.cssClassName}__hint`);

		const input = (this.input = this.createElement("input"));

		this.options = this.createElement("div", [`${FlowViewSelector.cssClassName}__options`]);

		this.nodeNameTypeMap = nodeNameTypeMap;
		this.position = position;
		this.highlightedOptionIndex = -1;

		this._onDblclick = this.onDblclick.bind(this);
		element.addEventListener("dblclick", this._onDblclick);
		this._onPointerdown = this.onPointerdown.bind(this);
		element.addEventListener("pointerdown", this._onPointerdown);
		this._onPointerleave = this.onPointerleave.bind(this);
		element.addEventListener("pointerleave", this._onPointerleave);

		this._onKeydown = this.onKeydown.bind(this);
		input.addEventListener("keydown", this._onKeydown);
		this._onKeyup = this.onKeyup.bind(this);
		input.addEventListener("keyup", this._onKeyup);
	}

	dispose() {
		const { element, input } = this;
		element.removeEventListener("dblclick", this._onDblclick);
		element.removeEventListener("pointerdown", this._onPointerdown);
		element.removeEventListener("pointerleave", this._onPointerdown);
		input.removeEventListener("keydown", this._onKeydown);
		input.removeEventListener("keyup", this._onKeyup);
	}

	focus() {
		this.input.focus();
	}

	get completion() {
		return this.hint.getAttribute("placeholder");
	}

	set completion(text) {
		this.hint.setAttribute("placeholder", text);
	}

	get matchingNodes() {
		const search = this.input.value.toLowerCase();
		if (search.length === 0) return [];
		return [...this.nodeNameTypeMap.keys()].filter(
			(name) =>
				// input value fits into node name...
				name.toLowerCase().startsWith(search) &&
				// ...but they are not the same yet.
				// Otherwise if a text starts with another text, some completions could be missed.
				name.toLowerCase() !== search
		);
	}

	set position({ x, y }) {
		const { element, view } = this;

		// Avoid overflow, using some heuristic values.
		const overflowY = y - view.origin.y + 40 >= view.height;
		const overflowX = x - view.origin.x + FlowViewSelector.width >= view.width;
		const _x = overflowX ? view.width + view.origin.x - FlowViewSelector.width - 10 : x;
		const _y = overflowY ? view.height + view.origin.y - 50 : y;

		element.style.top = `${_y - view.origin.y}px`;
		element.style.left = `${_x - view.origin.x}px`;

		this.x = _x;
		this.y = _y;
	}

	get position() {
		return { x: this.x, y: this.y };
	}

	createNode() {
		const nodeText =
			this.highlightedOptionIndex !== -1
				? this.options.children[this.highlightedOptionIndex].textContent
				: this.input.value;
		const [matchingNodeText, matchingNodeType] = [...this.nodeNameTypeMap.entries()].find(
			([name]) => name.toLowerCase() === nodeText.toLowerCase()
		) ?? [undefined, undefined];
		this.view.newNode({
			x: this.position.x,
			y: this.position.y,
			text: matchingNodeText ?? nodeText,
			type: matchingNodeType,
		});
		this.view.removeSelector();
	}

	onDblclick(event) {
		event.stopPropagation();
	}

	onKeydown(event) {
		const highlightNextOption = () => {
			this.highlightedOptionIndex = Math.min(this.highlightedOptionIndex + 1, this.options.childElementCount - 1);
		};
		const highlightPreviousOption = () => {
			this.highlightedOptionIndex =
				this.highlightedOptionIndex !== -1 ? Math.max(this.highlightedOptionIndex - 1, 0) : -1;
		};
		event.stopPropagation();
		switch (event.code) {
			case "Enter":
				this.createNode();
				break;
			case "Escape":
				if (this.highlightedOptionIndex !== -1) this.highlightedOptionIndex = -1;
				else if (this.input.value === "") this.view.removeSelector();
				else this.input.value = "";
				break;
			case "ArrowDown":
				highlightNextOption();
				break;
			case "ArrowUp":
				event.preventDefault();
				highlightPreviousOption();
				break;
			case "ArrowLeft":
				this.highlightedOptionIndex = -1;
				break;
			case "ArrowRight":
				this.highlightedOptionIndex = -1;
				if (this.completion && this.input.value.length === event.target.selectionStart)
					this.input.value = this.completion;
				break;
			case "Tab":
				event.preventDefault();
				if (this.completion) this.input.value = this.completion;
				const {
					input: { value },
					matchingNodes,
				} = this;
				// Fix case with Tab.
				const caseInsensitiveMatchingNode = matchingNodes.find((name) =>
					name.toLowerCase().startsWith(value.toLowerCase())
				);
				if (caseInsensitiveMatchingNode) this.input.value = caseInsensitiveMatchingNode.substring(0, value.length);
				// Use Tab and Shift-Tab to highlight options.
				if (this.matchingNodes.every((name) => name.startsWith(value))) {
					if (event.shiftKey) {
						highlightPreviousOption();
					} else {
						highlightNextOption();
					}
				}
				break;
			default:
				break;
		}
	}

	onKeyup(event) {
		event.stopPropagation();
		const highlightedClassName = `${FlowViewSelector.cssClassName}__option--highlighted`;
		console.log(this.highlightedOptionIndex);

		// Highlight options.
		if (["ArrowDown", "ArrowUp", "Tab"].includes(event.code)) {
			for (let i = 0; i < this.options.childElementCount; i++) {
				const option = this.options.children[i];
				if (this.highlightedOptionIndex === i) option.classList.add(highlightedClassName);
				else option.classList.remove(highlightedClassName);
			}
			return;
		}

		// Delete previous options.
		while (this.options.firstChild) this.options.removeChild(this.options.lastChild);
		// Create new options.
		for (let i = 0; i < this.matchingNodes.length; i++) {
			const name = this.matchingNodes[i];
			const option = document.createElement("div");
			option.classList.add(`${FlowViewSelector.cssClassName}__option`);
			option.textContent = name;
			option.onclick = () => {
				this.input.value = name;
				this.createNode();
			};
			option.onpointerenter = () => {
				this.highlightedOptionIndex = i;
				option.classList.add(highlightedClassName);
			};
			option.onpointerleave = () => {
				option.classList.remove(highlightedClassName);
			};
			this.options.append(option);
		}

		switch (this.matchingNodes.length) {
			case 0:
				this.completion = "";
				this.highlightedOptionIndex = -1;
				break;
			case 1: {
				const name = this.matchingNodes[0];
				if (name.includes(this.input.value)) this.completion = name;
				break;
			}
			default:
				this.completion = this.input.value;

				const shortestMatch = this.matchingNodes.reduce((shortest, match) =>
					shortest.length < match.length ? shortest : match
				);

				for (let i = this.input.value.length; i < shortestMatch.length; i++) {
					const currentChar = shortestMatch[i];
					if (this.matchingNodes.every((name) => name.startsWith(this.completion + currentChar))) {
						this.completion += currentChar;
					}
				}
		}
	}

	onPointerdown(event) {
		event.stopPropagation();
	}

	onPointerleave() {
		this.highlightedOptionIndex = -1;
	}
}
