import { FlowViewItem } from "./item.js";
import { FlowViewPin } from "./pin.js";

export class FlowViewNode extends FlowViewItem {
  static customElementName = FlowViewItem.elementName.node;

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
        'slot[name="inputs"], slot[name="outputs"]': {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "space-between",
          "min-height": `${FlowViewPin.size}px`,
        },
        '::slotted(span(slot="label"))': {
          "user-select": "none",
          "padding-left": "1em",
        },
      },
      [
        '<slot name="inputs"></slot>',
        '<span name="label"></span>',
        '<div name="content"></div>',
        '<slot name="outputs"></slot>',
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
        const { minSize } = this;

        if (typeof num === "number" && num >= 0) {
          // Use `minSize` if any.
          if (typeof minSize === "number" && minSize > num) {
            this.setAttribute(name, minSize);
          } else {
            this.style[name] = `${num}px`;
          }
        }

        break;
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    const { canvas, minSize } = this;

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

  get canvas() {
    const { parentNode } = this;

    if (
      parentNode &&
      parentNode.tagName === FlowViewItem.elementName.canvas.toUpperCase()
    ) {
      return parentNode;
    } else {
      return null;
    }
  }

  get minSize() {
    return FlowViewPin.size * 4;
  }

  set label(value) {
    this.labelElement.textContent = value;
  }

  get labelElement() {
    return this.shadowRoot.querySelector("span[name='label']");
  }

  get inputsElement() {
    return this.shadowRoot.querySelector("slot[name='inputs']");
  }

  get outputsElement() {
    return this.shadowRoot.querySelector("slot[name='outputs']");
  }

  addInput() {
    const pin = document.createElement(FlowViewItem.elementName.pin);

    this.inputsElement.appendChild(pin);
  }

  addOutput() {
    const pin = document.createElement(FlowViewItem.elementName.pin);

    this.outputsElement.appendChild(pin);
  }
}
