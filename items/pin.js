import { cssModifierHighlighted, cssTransition, cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";

export class FlowViewPin extends FlowViewBase {
	static cssClassName = "fv-pin";
	static size = 10;

	static style = {
		[`.${FlowViewPin.cssClassName}`]: {
			"background-color": cssVar.connectionColor,
			cursor: "none",
			position: "relative",
			display: "block",
			width: `${FlowViewPin.size}px`,
			height: `${FlowViewPin.size}px`,
			...cssTransition("background-color"),
		},
		[`.${FlowViewPin.cssClassName} .info`]: {
			visibility: "hidden",
			position: "absolute",
			"font-family": "monospace",
			"user-select": "none",
		},
		[`.${FlowViewPin.cssClassName}:hover .info`]: {
			visibility: "visible",
		},
		[`.${cssModifierHighlighted(FlowViewPin.cssClassName)}`]: {
			"background-color": cssVar.connectionColorHighlighted,
		},
	};

	init({ name, node }) {
		this.name = name;
		this.node = node;

		this.info = this.createElement("div", "info");
		this.text = name || "";

		this._onPointerdown = this.onPointerdown.bind(this);
		this.element.addEventListener("pointerdown", this._onPointerdown);
		this._onPointerenter = this.onPointerenter.bind(this);
		this.element.addEventListener("pointerenter", this._onPointerenter);
		this._onPointerleave = this.onPointerleave.bind(this);
		this.element.addEventListener("pointerleave", this._onPointerleave);
		this._onPointerup = this.onPointerup.bind(this);
		this.element.addEventListener("pointerup", this._onPointerup);
	}

	get offsetX() {
		return this.bounds.x - this.node.bounds.x;
	}

	set text(value) {
		this.info.innerHTML = value;
	}

	get halfPinSize() {
		return Math.round(FlowViewPin.size / 2);
	}

	dispose() {
		this.element.removeEventListener("pointerdown", this._onPointerdown);
		this.element.removeEventListener("pointerenter", this._onPointerenter);
		this.element.removeEventListener("pointerleave", this._onPointerleave);
		this.element.removeEventListener("pointerup", this._onPointerup);
	}

	onPointerenter(event) {
		event.stopPropagation();
		if (this.view.isDraggingEdge) return;
		if (this.node.isSelected) return;
		this.highlight = true;
	}

	onPointerleave(event) {
		event.stopPropagation();
		if (this.node.isSelected) return;
		this.highlight = false;
	}

	toObject() {
		const obj = {};
		if (!this.name) obj.name = this.name;
		return {
			...super.toObject(),
			...obj,
		};
	}
}
