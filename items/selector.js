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
		[`.${FlowViewSelector.cssClassName}__option:hover`]: {
			"border-color": cssVar.borderColorHighlighted,
		},
	};

	init({ nodeNameTypeMap, position }) {
		this.element.setAttribute("tabindex", 0);

		this.hint = this.createElement("input", `${FlowViewSelector.cssClassName}__hint`);

		const input = (this.input = this.createElement("input"));

		this.options = this.createElement("div", [`${FlowViewSelector.cssClassName}__options`]);

		this.nodeNameTypeMap = nodeNameTypeMap;
		this.position = position;

		this._onDblclick = this.onDblclick.bind(this);
		this.element.addEventListener("dblclick", this._onDblclick);
		this._onPointerdown = this.onPointerdown.bind(this);
		this.element.addEventListener("pointerdown", this._onPointerdown);

		this._onKeydown = this.onKeydown.bind(this);
		input.addEventListener("keydown", this._onKeydown);
		this._onKeyup = this.onKeyup.bind(this);
		input.addEventListener("keyup", this._onKeyup);
	}

	dispose() {
		this.element.removeEventListener("dblclick", this._onDblclick);
		this.element.removeEventListener("pointerdown", this._onPointerdown);
		this.input.removeEventListener("keydown", this._onKeydown);
		this.input.removeEventListener("keyup", this._onKeyup);
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
		return [...this.nodeNameTypeMap.entries()].filter(
			([name, type = ""]) =>
				// input value fits into node name...
				(name.toLowerCase().startsWith(search) &&
					// ...but they are not the same yet.
					// Otherwise if a text starts with another text, some completions could be missed.
					name.toLowerCase() !== search) ||
				search === type,
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
		const text = this.input.value;
		const matchingNode = [...this.nodeNameTypeMap.entries()].find(
			([name]) => name.toLowerCase() === text.toLowerCase(),
		) ?? [null, null];
		this.view.newNode({ x: this.position.x, y: this.position.y, text: matchingNode[0] ?? text, type: matchingNode[1] });
		this.view.removeSelector();
	}

	onDblclick(event) {
		event.stopPropagation();
	}

	onKeydown(event) {
		event.stopPropagation();
		switch (true) {
			case event.code === "Enter":
				this.createNode();
				break;
			case event.code === "Escape":
				if (this.input.value === "") this.view.removeSelector();
				else this.input.value = "";
				break;
			case event.code === "ArrowRight":
				if (this.completion && this.input.value.length === event.target.selectionStart) {
					this.input.value = this.completion;
				}
				break;
			case event.code === "Tab":
				event.preventDefault();
				if (this.completion) this.input.value = this.completion;
				break;
			default:
				break;
		}
	}

	onKeyup(event) {
		event.stopPropagation();

		// Delete previous options.
		while (this.options.firstChild) this.options.removeChild(this.options.lastChild);
		// Create new options.
		for (let i = 0; i < this.matchingNodes.length; i++) {
			const [name] = this.matchingNodes[i];
			const option = document.createElement("div");
			option.classList.add(`${FlowViewSelector.cssClassName}__option`);
			option.textContent = name;
			option.onclick = () => {
				this.input.value = name;
				this.createNode();
			};
			this.options.append(option);
		}

		switch (this.matchingNodes.length) {
			case 0:
				this.completion = "";
				break;
			case 1: {
				const [name] = this.matchingNodes[0];
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
					if (this.matchingNodes.every(([name]) => name.startsWith(this.completion + currentChar))) {
						this.completion += currentChar;
					}
				}
		}
	}

	onPointerdown(event) {
		event.stopPropagation();
	}
}
