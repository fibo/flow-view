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
			"border-color": cssVar.nodeBorderColorHighlighted,
		},
		[`.${FlowViewNode.cssClassName} .label`]: {
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

	_createContent({ label }) {
		const labelDiv = this.createElement("div", "label");
		labelDiv.textContent = label;
		this.labelDiv = labelDiv;
		this.label = label;
	}

	init(node) {
		const { type, inputs = [], outputs = [], x, y } = node;

		if (type) {
			this.type = type;
		}

		const { element } = this;

		this.borderWidth = FlowViewNode.borderWidth;

		this._inputs = new Map();
		this.inputListDiv = this.createElement("div", "pins");
		for (const pin of inputs) {
			this.newInput(pin);
		}

		this._createContent(node);

		this._outputs = new Map();
		this.outputListDiv = this.createElement("div", "pins");

		for (const pin of outputs) this.newOutput(pin);

		this.position = { x, y };

		this._onDblclick = this.onDblclick.bind(this);
		element.addEventListener("dblclick", this._onDblclick);
		this._onPointerdown = this.onPointerdown.bind(this);
		element.addEventListener("pointerdown", this._onPointerdown);
	}

	dispose() {
		const { element } = this;
		element.removeEventListener("dblclick", this._onDblclick);
		element.removeEventListener("pointerdown", this._onPointerdown);
	}

	get inputs() {
		return Array.from(this._inputs.values());
	}

	get outputs() {
		return Array.from(this._outputs.values());
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
		const input = this._inputs.get(id);
		input.remove();
		this._inputs.delete(id);
	}

	deleteOutput(id) {
		const output = this._outputs.get(id);
		output.remove();
		this._outputs.delete(id);
	}

	input(id) {
		if (!this._inputs.has(id)) throw new FlowViewErrorItemNotFound({ kind: "input", id });
		return this._inputs.get(id);
	}

	output(id) {
		if (!this._outputs.has(id)) throw new FlowViewErrorItemNotFound({ kind: "output", id });
		return this._outputs.get(id);
	}

	newInput({ id, name }) {
		const pin = new FlowViewInput({
			id,
			name,
			node: this,
			view: this.view,
			cssClassName: FlowViewPin.cssClassName,
		});
		this._inputs.set(pin.id, pin);
		this.inputListDiv.appendChild(pin.element);
	}

	newOutput({ id, name }) {
		const pin = new FlowViewOutput({
			id,
			name,
			node: this,
			view: this.view,
			cssClassName: FlowViewPin.cssClassName,
		});
		this._outputs.set(pin.id, pin);
		this.outputListDiv.appendChild(pin.element);
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
		const { label, type, inputs, outputs, x, y } = this;
		return {
			...super.toObject(),
			...(type ? { type } : {}),
			...(label ? { label } : {}),
			...(inputs.length > 0
				? {
					inputs: inputs.map((pin) => pin.toObject()),
				}
				: {}),
			...(outputs.length > 0
				? {
					outputs: outputs.map((pin) => pin.toObject()),
				}
				: {}),
			x,
			y,
		};
	}
}
