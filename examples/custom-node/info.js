import { FlowViewNode } from "../../items/node.js";

export class FlowViewNodeInfo extends FlowViewNode {
	static minNumCols = 5;
	static minNumRows = 1;

	setNumCols() {
		const numCols = this.textarea.value.split("\n").reduce((max, line) => Math.max(max, line.length), 0);
		this.textarea.cols = Math.max(FlowViewNodeInfo.minNumCols, numCols);
	}

	setNumRows() {
		const numRows = this.textarea.value.split("\n").length;
		this.textarea.rows = Math.max(FlowViewNodeInfo.minNumRows, numRows);
	}

	initContent() {
		const textarea = this.createElement("textarea");
		textarea.value = this.text;
		this.textarea = textarea;

		this.setNumRows();
		this.setNumCols();

		textarea.style.border = 0;
		textarea.style.fontSize = "16px";
		textarea.style.outline = "none";
		textarea.style.overflow = "hidden";
		textarea.style.padding = "4px 10px";
		textarea.style.resize = "none";

		textarea.onpointerdown = (event) => {
			this.view.selectNode(this);
			event.stopPropagation();
		};

		textarea.onkeydown = (event) => {
			event.stopPropagation();
		};

		textarea.onkeyup = (event) => {
			event.stopPropagation();
			this.setNumRows();
			this.setNumCols();
		};
	}
}
