import { FlowViewItem } from "./item.js";
import { FlowViewPin } from "./pin.js";

export class FlowViewNode extends FlowViewItem {
  static customElementName = FlowViewItem.elementName.node;
  static minSize = FlowViewPin.size * 4;

  constructor() {
    super(
      {
        ":host": {
          "box-sizing": "border-box",
          "background-color": "var(--fv-node-background-color, #fefefe)",
          "position": "absolute",
          "box-shadow": "1px 1px 7px 1px var(--fv-shadow-color)",
          "display": "flex",
          "flex-direction": "column",
          "justify-content": "space-between",
          "border": "1px solid transparent",
        },
        ".pin-list": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "space-between",
          "min-height": `${FlowViewPin.size}px`,
        },
        ".label": {
          "cursor": "default",
          "user-select": "none",
          "padding-left": ".5em",
        },
      },
      [
        '<slot name="inputs"><div class="inputs pin-list"></div></slot>',
        '<slot name="label"><span class="label"></span></slot>',
        "<slot></slot>",
        '<slot name="outputs"><div class="outputs pin-list"></div></slot>',
      ].join(""),
    );
  }

  static get observedAttributes() {
    return FlowViewItem.observedAttributes.concat([
      "label",
      // position
      "x",
      "y",
      // dimension
      "width",
      "height",
    ]);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    super.attributeChangedCallback(name, oldValue, newValue);

    switch (name) {
      case "label": {
        this.label = newValue;
        break;
      }

      case "y":
      case "x": {
        const num = Math.round(newValue);

        if (typeof num === "number") {
          if (name === "y") this.style.top = `${num}px`;
          if (name === "x") this.style.left = `${num}px`;
        }

        break;
      }

      case "width":
      case "height": {
        const num = Math.round(newValue);
        const { minSize } = FlowViewNode;
        if (minSize > num) {
          this.setAttribute(name, minSize);
        } else {
          this.style[name] = `${num}px`;
        }
        break;
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    const { canvas } = this;
    const { minSize } = FlowViewNode.minSize;

    if (canvas) {
      this.addEventListener("pointerdown", this.onpointerdown);
    }

    // Make sure dimensions are defined.
    if (!this.getAttribute("width")) {
      this.setAttribute("width", minSize);
    }
    if (!this.getAttribute("height")) {
      this.setAttribute("height", minSize);
    }

    // Make sure position is defined.
    if (!this.getAttribute("x")) {
      this.setAttribute("x", 0);
    }
    if (!this.getAttribute("y")) {
      this.setAttribute("y", 0);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const { canvas } = this;

    if (canvas) {
      this.removeEventListener("pointerdown", this.onpointerdown);
    }
  }

  onpointerdown(event) {
    const { clientX, clientY } = event;

    const { canvas } = this;

    const { left, top } = this.getBoundingClientRect();

    const shiftX = clientX - left;
    const shiftY = clientY - top;

    const canvasOnpointermove = (event) => {
      const { pageX, pageY } = event;

      this.setAttribute("x", Math.round(pageX - shiftX));
      this.setAttribute("y", Math.round(pageY - shiftY));
    };

    const removeListeners = () => {
      canvas.removeEventListener("pointermove", canvasOnpointermove);
      canvas.removeEventListener("pointerleave", removeListeners);
      canvas.removeEventListener("pointerup", removeListeners);
    };

    canvas.addEventListener("pointermove", canvasOnpointermove);
    canvas.addEventListener("pointerleave", removeListeners);
    canvas.addEventListener("pointerup", removeListeners);
  }

  set label(value) {
    this.labelElement.textContent = value;
  }

  get labelElement() {
    return this.shadowRoot.querySelector("span.label");
  }

  get inputsElement() {
    return this.shadowRoot.querySelector(".inputs");
  }

  get outputsElement() {
    return this.shadowRoot.querySelector(".outputs");
  }

  addInput() {
    const pin = document.createElement(FlowViewItem.elementName.pin);

    this.inputsElement.appendChild(pin);
  }

  addOutput() {
    const pin = document.createElement(FlowViewItem.elementName.pin);

    this.outputsElement.appendChild(pin);
  }

  input(position = 0) {
    return this.inputsElement.children[position];
  }

  output(position = 0) {
    return this.outputsElement.children[position];
  }

  getInputById(id) {
    for (const pin of this.inputsElement.children) {
      if (pin.id === id) {
        return pin;
      }
    }
  }

  getOutputById(id) {
    for (const pin of this.outputsElement.children) {
      if (pin.id === id) {
        return pin;
      }
    }
  }
}
