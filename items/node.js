import { FlowViewErrorItemNotFound } from "../errors.js";
import { cssModifierHighlighted, cssTransition, cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";
import { FlowViewInput } from "./input.js";
import { FlowViewOutput } from "./output.js";
import { FlowViewEdge } from "./edge.js";
import { FlowViewPin } from "./pin.js";

export class FlowViewNode extends FlowViewBase {
	static cssClassName = "fv-node";
	static borderWidth = 1;
	static minSize = FlowViewPin.size * 4;
	static zIndex = FlowViewEdge.zIndex + 1;
	static style = {
		[`.${FlowViewNode.cssClassName}`]: {
			position: "absolute",
			"background-color": cssVar.nodeBackgroundColor,
			"border-radius": cssVar.borderRadius,
			"box-shadow": cssVar.boxShadow,
			display: "flex",
			"flex-direction": "column",
			"justify-content": "space-between",
			border: `${FlowViewNode.borderWidth}px solid transparent`,
			"min-height": `${FlowViewNode.minSize}px`,
			"min-width": `${FlowViewNode.minSize}px`,
			width: "fit-content",
			"z-index": FlowViewNode.zIndex,
			...cssTransition("border-color"),
		},
		[`.${cssModifierHighlighted(FlowViewNode.cssClassName)}`]: {
			"border-color": cssVar.borderColorHighlighted,
		},
		[`.${FlowViewNode.cssClassName} .content`]: {
			"user-select": "none",
			"padding-left": "0.5em",
			"padding-right": "0.5em",
			"text-align": "center",
		},
		[`.${FlowViewNode.cssClassName} .pins`]: {
			display: "flex",
			"flex-direction": "row",
			gap: `${FlowViewPin.size}px`,
			"justify-content": "space-between",
			height: `${FlowViewPin.size}px`,
		},
	};

	init(node) {
		const { text, type, inputs = [], outputs = [], x, y } = node;

		this.text = text;
		this.type = type;

		this.borderWidth = FlowViewNode.borderWidth;

		this.inputsMap = new Map();
		this.inputsDiv = this.createElement("div", "pins");
		for (const pin of inputs) this.newInput(pin);

		this.initContent(node);

		this.outputsMap = new Map();
		this.outputsDiv = this.createElement("div", "pins");
		for (const pin of outputs) this.newOutput(pin);

		this.position = { x, y };

		this._onDblclick = this.onDblclick.bind(this);
		this.element.addEventListener("dblclick", this._onDblclick);
		this._onPointerdown = this.onPointerdown.bind(this);
		this.element.addEventListener("pointerdown", this._onPointerdown);
	}

	initContent(node) {
		const div = this.createElement("div", "content");
		div.textContent = node.text;
		this.contentDiv = div;
	}

	dispose() {
		this.element.removeEventListener("dblclick", this._onDblclick);
		this.element.removeEventListener("pointerdown", this._onPointerdown);
	}

	get inputs() {
		return [...this.inputsMap.values()];
	}

	get outputs() {
		return [...this.outputsMap.values()];
	}

	get position() {
		return { x: this.x, y: this.y };
	}

	set position({ x = 0, y = 0 } = {}) {
		const { element, view } = this;

		this.x = x;
		this.y = y;
		element.style.top = `${y - view.origin.y}px`;
		element.style.left = `${x - view.origin.x}px`;
	}

	deleteInput(id) {
		const input = this.inputsMap.get(id);
		input.remove();
		this.inputsMap.delete(id);
	}

	deleteOutput(id) {
		const output = this.outputsMap.get(id);
		output.remove();
		this.outputsMap.delete(id);
	}

	input(id) {
		if (!this.inputsMap.has(id)) throw new FlowViewErrorItemNotFound({ kind: "input", id });
		return this.inputsMap.get(id);
	}

	output(id) {
		if (!this.outputsMap.has(id)) throw new FlowViewErrorItemNotFound({ kind: "output", id });
		return this.outputsMap.get(id);
	}

	newInput({ id, name }) {
		const pin = new FlowViewInput({
			id,
			name,
			node: this,
			view: this.view,
			cssClassName: FlowViewPin.cssClassName,
		});
		this.inputsMap.set(pin.id, pin);
		this.inputsDiv.appendChild(pin.element);
	}

	newOutput({ id, name }) {
		const pin = new FlowViewOutput({
			id,
			name,
			node: this,
			view: this.view,
			cssClassName: FlowViewPin.cssClassName,
		});
		this.outputsMap.set(pin.id, pin);
		this.outputsDiv.appendChild(pin.element);
	}

	onDblclick(event) {
		event.stopPropagation();
	}

	onPointerdown(event) {
		if (event.isBubblingFromPin) return;
		event.isBubblingFromNode = true;
		const isMultiSelection = event.shiftKey || (this.view.hasSelectedNodes && this.isSelected);
		if (!isMultiSelection) this.view.clearSelection();
		this.view.selectNode(this);
	}

	toObject() {
		const { text, type, inputs, outputs, x, y } = this;
		return {
			...super.toObject(),
			text,
			...(type ? { type } : {}),
			...(inputs.length > 0
				? {
					ins: inputs.map((pin) => pin.toObject()),
				}
				: {}),
			...(outputs.length > 0
				? {
					outs: outputs.map((pin) => pin.toObject()),
				}
				: {}),
			x,
			y,
		};
	}
}
