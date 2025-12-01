import type { FlowViewNode } from './flow-view.d.ts';

export type Dimensions = {
	width: number;
	height: number;
};

export type Pin = {
	readonly center: Vector;
	readonly node: FlowViewNode;
}

export type Rectangle = {
	dimensions: Dimensions;
	position: Vector;
};

export type Vector = {
	x: number;
	y: number;
};

export type VectorOperator = (a: Vector, b: Vector) => Vector;

