import { FlowViewNode } from "../../items/node.js";

export class FlowViewEditableNode extends FlowViewNode {
	disposeContentEditor() {
		if (!this.isEditing) return;
		const { contentDiv } = this;
		contentDiv.removeAttribute("contenteditable");
		if (this._onContentBlur) {
			contentDiv.removeEventListener("blur", this._onContentBlur);
			this._onContentBlur = undefined;
		}
		if (this._onContentKeydown) {
			contentDiv.removeEventListener("keydown", this._onContentKeydown);
			this._onContentKeydown = undefined;
		}
		this.isEditing = false;
	}

	dispose() {
		const { element } = this;
		element.removeEventListener("dblclick", this._onDblclick);
		this.disposeContentEditor();
		super.dispose();
	}

	onDblclick(event) {
		event.stopPropagation();

		const { contentDiv } = this;

		if (this.isEditing) return;

		contentDiv.setAttribute("contenteditable", true);
		this.isEditing = true;

		// Move cursor to end of text
		const range = document.createRange();
		range.selectNodeContents(contentDiv);
		range.collapse(false);
		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);

		this._onContentKeydown = this.onContentKeydown.bind(this);
		contentDiv.addEventListener("keydown", this._onContentKeydown);
		this._onContentBlur = this.onContentBlur.bind(this);
		contentDiv.addEventListener("blur", this._onContentBlur);
		contentDiv.focus();
	}

	onContentBlur(event) {
		event.stopPropagation();
		const { text, contentDiv, view } = this;
		const nextContent = contentDiv.textContent;

		if (nextContent && text !== nextContent) {
			this.text = nextContent;
			view.host.viewChange({ updatedNode: this.toObject() });
		} else {
			contentDiv.textContent = text;
		}
		this.disposeContentEditor();
	}

	onContentKeydown(event) {
		event.stopPropagation();
		const { contentDiv } = this;

		switch (true) {
			case event.code === "Enter": {
				event.preventDefault();
				contentDiv.blur();
				break;
			}

			case event.code === "Escape": {
				this.contentDiv.textContent = this.text;
				this.disposeContentEditor();
				break;
			}

			default: {
				// console.log(event.code);
			}
		}
	}
}
