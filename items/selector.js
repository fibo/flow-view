import { cssVar } from "../theme.js";
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
			cursor: "default",
		},
	};

	init({ nodeLabels, position }) {
		this.element.setAttribute("tabindex", 0);

		this.hint = this.createElement("input", `${FlowViewSelector.cssClassName}__hint`);

		const input = (this.input = this.createElement("input"));

		this.options = this.createElement("div", [`${FlowViewSelector.cssClassName}__options`]);

		this.nodeLabels = nodeLabels;
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

	get matchingNodeLabels() {
		const value = this.input.value;
		if (value.length === 0) return [];
		return this.nodeLabels.filter(
			(label) =>
				// input value fits into node label...
				label.startsWith(value) &&
				// ...but they are not the same yet.
				// Otherwise if a label starts with another label,
				// some completions could be missed.
				label !== value,
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
		this.view.newNode({ x: this.position.x, y: this.position.y, label: this.input.value });
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
				const { completion, input } = this;
				if (completion && input.value.length === event.target.selectionStart) this.input.value = completion;
				break;
			case event.code === "Tab":
				event.preventDefault();
				if (this.completion) this.input.value = completion;
				break;
			default: // console.log(event.code);
		}
	}

	onKeyup(event) {
		event.stopPropagation();

		const { input, options, matchingNodeLabels } = this;

		// Delete previous options.
		while (options.firstChild) {
			options.removeChild(options.lastChild);
		}
		// Create new options.
		for (let i = 0; i < matchingNodeLabels.length; i++) {
			const label = matchingNodeLabels[i];
			const option = document.createElement("div");
			option.classList.add(`${FlowViewSelector.cssClassName}__option`);
			option.textContent = label;
			option.onclick = () => {
				this.input.value = label;
				this.createNode();
			};
			options.append(option);
		}

		switch (matchingNodeLabels.length) {
			case 0:
				this.completion = "";
				break;
			case 1:
				this.completion = matchingNodeLabels[0];
				break;
			default:
				let completion = input.value;

				const shortestMatch = matchingNodeLabels.reduce((shortest, match) =>
					shortest.length < match.length ? shortest : match
				);

				for (let i = input.value.length; i < shortestMatch.length; i++) {
					const currentChar = shortestMatch[i];
					if (matchingNodeLabels.every((label) => label.startsWith(completion + currentChar))) {
						completion += currentChar;
					}
				}

				this.completion = completion;
		}
	}

	onPointerdown(event) {
		event.stopPropagation();
	}
}
