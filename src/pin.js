import { cssModifierHighlighted, cssTransition, cssVar } from "./theme.js"
import { FlowViewBase } from "./base.js"
import {FlowViewNode} from "../flow-view.js"

export class FlowViewPin extends FlowViewBase {
  static cssClassName = "fv-pin"
  static size = 10
  static style = {
    [`.${FlowViewPin.cssClassName}`]: {
      "background-color": cssVar.connectionColor,
      cursor: "none",
      position: "relative",
      display: "block",
      width: `${FlowViewPin.size}px`,
      height: `${FlowViewPin.size}px`,
      ...cssTransition("background-color")
    },
    [`.${FlowViewPin.cssClassName} .info`]: {
      visibility: "hidden",
      position: "absolute",
      "background-color": cssVar.nodeBackgroundColor
    },
    [`.${FlowViewPin.cssClassName} .info:not(:empty)`]: {
      padding: "2px 5px"
    },
    [`.${FlowViewPin.cssClassName}:hover .info`]: {
      visibility: "visible"
    },
    [`.${cssModifierHighlighted(FlowViewPin.cssClassName)}`]: {
      "background-color": cssVar.connectionColorHighlighted
    }
  }

	/** 
	 * @typedef {object} PinInitArg
	 * @prop {string} name
	 * @prop {FlowViewNode} node
	 *
	 * @param {PinInitArg} arg
	 */
  init({ name = "", node }) {
    this.info = this.createElement("pre", "info")

    this.name = name
    this.text = name

    this.node = node

    this.element.addEventListener("pointerdown", this)
    this.element.addEventListener("pointerenter", this)
    this.element.addEventListener("pointerleave", this)
    this.element.addEventListener("pointerup", this)
  }

  /** @param {any} event */
  handleEvent(event) {
    if (event.type === "pointerenter") {
      this.highlight = true
    }
    if (event.type === "pointerleave") {
      this.highlight = false
    }
  }

  get offsetX() {
	  // @ts-ignore
    return this.bounds.x - this.node.bounds.x
  }

  /** @param {string} value */
  set text(value) {
	  // @ts-ignore
    this.info.textContent = value === "" ? this.name : value
  }

  dispose() {
    this.element.removeEventListener("pointerdown", this)
    this.element.removeEventListener("pointerenter", this)
    this.element.removeEventListener("pointerleave", this)
    this.element.removeEventListener("pointerup", this)
  }

  toObject() {
    const obj = {}
    if (!this.name) obj.name = this.name
    return {
      ...super.toObject(),
      ...obj
    }
  }
}

export const halfPinSize = Math.round(FlowViewPin.size / 2)
