import { FlowViewNode } from "../../items/node.js";

export class FlowViewEditableNode extends FlowViewNode {
  init(args) {
    super.init(args);

    this._onDblclick = this.onDblclick.bind(this);
    this.element.addEventListener("dblclick", this._onDblclick);
  }

  disposeLabelEditor() {
    if (!this.isEditing) return;
    const { labelDiv } = this;
    labelDiv.removeAttribute("contenteditable");
    if (this._onLabelBlur) {
      labelDiv.removeEventListener("blur", this._onLabelBlur);
      this._onLabelBlur = undefined;
    }
    if (this._onLabelKeydown) {
      labelDiv.removeEventListener("keydown", this._onLabelKeydown);
      this._onLabelKeydown = undefined;
    }
    this.isEditing = false;
  }

  dispose() {
    const { element } = this;
    element.removeEventListener("dblclick", this._onDblclick);
    this.disposeLabelEditor();
    super.dispose();
  }

  onDblclick(event) {
    event.stopPropagation();

    const { labelDiv } = this;

    if (this.isEditing) return;

    labelDiv.setAttribute("contenteditable", true);
    this.isEditing = true;

    // Move cursor to end of text
    const range = document.createRange();
    range.selectNodeContents(labelDiv);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    this._onLabelKeydown = this.onLabelKeydown.bind(this);
    labelDiv.addEventListener("keydown", this._onLabelKeydown);
    this._onLabelBlur = this.onLabelBlur.bind(this);
    labelDiv.addEventListener("blur", this._onLabelBlur);
    labelDiv.focus();
  }

  onLabelBlur(event) {
    event.stopPropagation();
    const { label, labelDiv, view } = this;
    const nextLabel = labelDiv.textContent;

    if (nextLabel && label !== nextLabel) {
      this.label = nextLabel;
      view.host.viewChange({ updatedNode: this.toObject() });
    } else {
      labelDiv.textContent = label;
    }
    this.disposeLabelEditor();
  }

  onLabelKeydown(event) {
    event.stopPropagation();
    const { labelDiv } = this;

    switch (true) {
      case event.code === "Enter": {
        event.preventDefault();
        labelDiv.blur();
        break;
      }

      case event.code === "Escape": {
        this.labelDiv.textContent = this.label;
        this.disposeLabelEditor();
        // labelDiv.blur();
        break;
      }

      default: {
        // console.log(event.code);
      }
    }
  }
}
