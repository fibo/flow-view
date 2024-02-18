import { cssTransition, cssVar } from "./theme.js"
import { FlowViewBase } from "./base.js"
import { FlowViewNode } from "./node.js"

/**
 * @typedef {import("./types").Vector} Vector
 */

export class FlowViewSelector extends FlowViewBase {
	x = 0
	y = 0

	/** @type {HTMLElement|undefined} */
	options = undefined

	/** @type {string[]} */
	nodeNames = []

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

  /**
   * @typedef {object} FlowViewSelectorInitArg
   * @prop {string[]} nodeNames
   * @prop {Vector} position
   *
   * @param {FlowViewSelectorInitArg} arg
   */
  init({ nodeNames, position }) {
    const { element } = this
    element.setAttribute("tabindex", "0")

    this.hint = this.createElement("input", `${FlowViewSelector.cssClassName}__hint`)

    const input = (this.input = this.createElement("input"))
    this.options = this.createElement("div", `${FlowViewSelector.cssClassName}__options`)

    this.nodeNames = nodeNames
    this.position = position
    this.highlightedOptionIndex = -1

    element.addEventListener("dblclick", this)
    element.addEventListener("pointerdown", this)
    element.addEventListener("pointerleave", this)

    input.addEventListener("keydown", this)
    input.addEventListener("keyup", this)
  }

  /** @param {any} event */
  handleEvent(event) {
    if (event.type === "dblclick") {
      event.stopPropagation()
    }
    if (event.type === "pointerdown") {
      event.stopPropagation()
    }
    if (event.type === "pointerleave") {
      this.highlightedOptionIndex = -1
    }
    if (event.type === "keydown") {
      event.stopPropagation()
      if (["ArrowUp", "Tab"].includes(event.code)) event.preventDefault()
    }
    if (event.type === "keyup") {
      event.stopPropagation()
      const highlightedClassName = `${FlowViewSelector.cssClassName}__option--highlighted`

      const highlightOptions = () => {
	      const options = this.options
	      if (!options) return
        for (let i = 0; i < options.childElementCount; i++) {
          const option = options.children[i]
          if (this.highlightedOptionIndex === i) {
            option.classList.add(highlightedClassName)
          } else option.classList.remove(highlightedClassName)
        }
      }
      const nextOption = () => {
	      const options = this.options
	      if (!options) return
        this.highlightedOptionIndex = Math.min(this.highlightedOptionIndex + 1, options.childElementCount - 1)
      }
      const previousOption = () => {
        this.highlightedOptionIndex =
          this.highlightedOptionIndex !== -1 ? Math.max(this.highlightedOptionIndex - 1, 0) : -1
      }
      const deleteOptions = () => {
	      const options = this.options
	      if (!options) return
        while (options.firstChild) {
		// @ts-ignore
          options.removeChild(options.lastChild)
        }
      }
      const resetOptions = () => {
        this.highlightedOptionIndex = -1
        deleteOptions()
      }
      const createOptions = () => {
        deleteOptions()
	      const options = this.options
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
		if (options) options.append(option)
        }
      }
      const setCompletion = () => {
	      const options = this.options
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

              const shortestMatch = this.matchingNodes.reduce((shortest, match) =>
                shortest.length < match.length ? shortest : match
              )

	      // @ts-ignore
              for (let i = this.input.value.length; i < shortestMatch.length; i++) {
                const currentChar = shortestMatch[i]
                if (this.matchingNodes.every((name) => name.startsWith(this.completion + currentChar))) {
                  this.completion += currentChar
                }
              }
            } else {
		    if (options)
              this.completion = options.children[this.highlightedOptionIndex].textContent
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
          (name) => !name.startsWith(this.input.value) && name.toLowerCase().startsWith(this.input.value.toLowerCase())
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
  }

  dispose() {
    const { element, input } = this
    element.removeEventListener("dblclick", this)
    element.removeEventListener("pointerdown", this)
    element.removeEventListener("pointerleave", this)
	      // @ts-ignore
    input.removeEventListener("keydown", this)
	      // @ts-ignore
    input.removeEventListener("keyup", this)
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
    return this.nodeNames.filter(
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
    return { x: this.x, y: this.y }
  }

  createNode() {
    const nodeText = this.options?.children?.[this.highlightedOptionIndex]?.textContent ?? this.input.value
    const matchingNodeText = this.nodeNames.find(([name]) => name.toLowerCase() === nodeText.toLowerCase())
    this.view.newNode({
      x: this.position.x,
      y: this.position.y,
      text: matchingNodeText ?? nodeText
    })
    this.view.removeSelector()
  }
}
