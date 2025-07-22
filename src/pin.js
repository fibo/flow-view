import { cssPin } from './theme.js'
import { FlowViewBase } from "./base.js"

/**
 * @typedef {import('./types').FlowViewPinInitArg} FlowViewPinInitArg
 */

export class FlowViewPin extends FlowViewBase {
	/** @param {FlowViewPinInitArg} arg */
	init({ name = "", node }) {
		this.info = this.createElement("pre", "info")

		this.name = name
		this.text = name

		this.node = node

		// @ts-ignore
		this._onPointerdown = this.onPointerdown.bind(this)
		this.element.addEventListener("pointerdown", this._onPointerdown)
		this._onPointerenter = this.onPointerenter.bind(this)
		this.element.addEventListener("pointerenter", this._onPointerenter)
		this._onPointerleave = this.onPointerleave.bind(this)
		this.element.addEventListener("pointerleave", this._onPointerleave)
		// @ts-ignore
		this._onPointerup = this.onPointerup.bind(this)
		this.element.addEventListener("pointerup", this._onPointerup)
	}

	/** @param {string} value */
	set text(value) {
		// @ts-ignore
		this.info.textContent = value === "" ? this.name : value
	}

	get halfPinSize() {
		return Math.round(cssPin.size / 2)
	}

	dispose() {
		// @ts-ignore
		this.element.removeEventListener("pointerdown", this._onPointerdown)
		// @ts-ignore
		this.element.removeEventListener("pointerenter", this._onPointerenter)
		// @ts-ignore
		this.element.removeEventListener("pointerleave", this._onPointerleave)
		// @ts-ignore
		this.element.removeEventListener("pointerup", this._onPointerup)
	}

	onPointerenter() {
		this.highlight = true
	}

	onPointerleave() {
		this.highlight = false
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
