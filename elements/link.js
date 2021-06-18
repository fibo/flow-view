export function isInput(pin) {
  const { parentNode } = pin;

  if (parentNode && parentNode.tagName === "DIV") {
    return parentNode.slot === "inputs";
  }

  return false;
}

export function isOutput(pin) {
  const { parentNode } = pin;

  if (parentNode && parentNode.tagName === "DIV") {
    return parentNode.slot === "outputs";
  }

  return false;
}

export function centerOfPin(pin) {
  const node = nodeOfPin(pin);

  const halfPinSize = Math.round(pinSize / 2);

  if (node) {
    const x = Number(node.getAttribute("x"));
    const y = Number(node.getAttribute("y"));

    const nodeBorderWidth = 1;

    if (isInput(pin)) {
      return {
        x: x + halfPinSize,
        y: y + halfPinSize,
      };
    }

    if (isOutput(pin)) {
      const height = Number(node.getAttribute("height"));

      return {
        y: y + height - halfPinSize - nodeBorderWidth,
        x: x + halfPinSize + nodeBorderWidth,
      };
    }
  }
}

export class FlowViewLink extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: absolute;
          border: 1px solid transparent;
        }

        :host(:hover) {
          border-color: var(--fv-shadow-color);
        }
      </style>
      <slot></slot>
    `;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );
  }

  static get observedAttributes() {
    return [
      "id",
      "from",
      "to",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      // The `id` attribute cannot be changed.
      case "id": {
        if (oldValue !== null && newValue !== this._id) {
          this.setAttribute("id", this._id);
        }
        break;
      }

      case "from":
      case "to": {
        const sourcePin = document.getElementById(
          name === "from" ? newValue : this.getAttribute("from"),
        );
        const targetPin = document.getElementById(
          name === "to" ? newValue : this.getAttribute("to"),
        );

        const dimension = this.computeDimensions({ sourcePin, targetPin });

        if (dimension) {
          this.style.width = `${dimension.width}px`;
          this.style.height = `${dimension.height}px`;
        }

        const position = this.computePosition({ sourcePin });

        if (position) {
          this.style.top = `${position.y}px`;
          this.style.left = `${position.x}px`;
        }

        break;
      }
    }
  }

  connectedCallback() {
    const { canvas } = this;

    if (canvas) {
      // Set a readonly id.
      const id = this.id || canvas.generateId();
      Object.defineProperty(this, "_id", { value: id, writable: false });
      this.setAttribute("id", id);
    }
  }

  get canvas() {
    const { parentNode } = this;

    if (parentNode && parentNode.tagName === "FV-CANVAS") {
      return parentNode;
    } else {
      return null;
    }
  }

  computeDimensions({ sourcePin, targetPin }) {
    const sourcePosition = centerOfPin(sourcePin);
    const targetPosition = centerOfPin(targetPin);

    if (sourcePosition && targetPosition) {
      return {
        width: targetPosition.x - sourcePosition.x,
        height: targetPosition.y - sourcePosition.y,
      };
    }
  }

  computePosition({ sourcePin }) {
    return centerOfPin(sourcePin);
  }
}
