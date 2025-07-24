/** @param {string} cssName */
export const cssModifierHighlighted = (cssName) => `${cssName}--highlighted`

/** @param {string} cssName */
export const cssModifierHasError = (cssName) => `${cssName}--error`

/** @param {string} prop */
export const cssTransition = (prop) => ({
	transition: `${prop} 117ms ease-in-out`
})

/** @param {Record<string, Record<string, string | number>>} style */
export const generateStyle = (style) => Object.entries(style).reduce(
	(css, [selector, rules]) => [ css,
		`${selector} {`, Object.entries(rules)
		.map(([key, value]) => `  ${key}: ${value};`).join('\n'),
		'}'
	].join('\n'), '');

export const cssClass = {
	edge: 'fv-edge',
	node: 'fv-node',
	pin: 'fv-pin',
	prompt: 'fv-prompt',
}

export const cssEdge = {
	lineWidth: 2,
	zIndex: 0,
};

export const cssPin = {
	halfSize: 5,
	size: 10,
};

export const cssPrompt = {
	padding: 9,
	width: 170,
}

export const cssNode = {
	borderWidth: 1,
	minSize: cssPin.size * 4,
	zIndex: cssEdge.zIndex + 1,
};

/** @param {string} name */
const fvCssDefaultVarName = (name) => `--fv-default-${name}`

/** @param {string} name */
const fvCssVar = (name) => `var(--fv-${name}, var(${fvCssDefaultVarName(name)}))`

const cssVar = {
	backgroundColor: fvCssVar('background-color'),
	borderColorHighlighted: fvCssVar(cssModifierHighlighted('node-border-color')),
	borderRadius: fvCssVar('border-radius'),
	boxShadow: fvCssVar('box-shadow'),
	connectionColor: fvCssVar('connection-color'),
	connectionColorHighlighted: fvCssVar(cssModifierHighlighted('connection-color')),
	errorColor: fvCssVar('error-color'),
	fontFamily: fvCssVar('font-family'),
	fontSize: fvCssVar('font-size'),
	nodeBackgroundColor: fvCssVar('node-background-color'),
	textColor: fvCssVar('text-color')
}

/** @param {Record<string, string>} arg */
const defaultCssProps = (arg) => Object.entries(arg).reduce(
	(obj, [key, value]) => ({...obj, [fvCssDefaultVarName(key)]: value}), {}
);

export const cssTheme = {
	light: defaultCssProps({
		'background-color': '#fefefe',
		'connection-color': '#ccc',
		'box-shadow': '0px 0px 7px 1px rgba(0,0,0,0.1)',
		[`${cssModifierHighlighted('connection-color')}`]: '#717171',
		'error-color': '#ffa600',
		'node-background-color': '#fefefe',
		[`${cssModifierHighlighted('node-border-color')}`]: '#717171',
		'text-color': '#222'
	}),
	dark: defaultCssProps({
		'background-color': '#555',
		'connection-color': '#aaa',
		'box-shadow': '0px 0px 17px 1px rgba(0,0,0,0.34)',
		[`${cssModifierHighlighted('connection-color')}`]: '#ddd',
		'error-color': '#ffb600',
		'node-background-color': '#2b2b2b',
		[`${cssModifierHighlighted('node-border-color')}`]: '#efefef',
		'text-color': '#ccc'
	})
}

export const flowViewStyle = {
	':host([hidden])': { display: 'none' },
	':host': {
		position: 'relative',
		display: 'block',
		overflow: 'hidden',
		border: 0,
		margin: 0,
		outline: 0,
		'background-color': cssVar.backgroundColor,
		'border-radius': cssVar.borderRadius,
		'font-family': cssVar.fontFamily,
		'font-size': cssVar.fontSize,
		color: cssVar.textColor
	}
}

export const edgeStyle = {
	[`.${cssClass.edge}`]: {
		display: 'flex',
		position: 'absolute',
		border: 0,
		'pointer-events': 'none'
	},
	[`.${cssClass.edge} line`]: {
		'pointer-events': 'all',
		stroke: cssVar.connectionColor,
		'stroke-width': cssEdge.lineWidth,
		...cssTransition('stroke')
	},
	[`.${cssModifierHasError(cssClass.edge)} line`]: {
		stroke: cssVar.errorColor
	},
	[`.${cssModifierHighlighted(cssClass.edge)} line`]: {
		stroke: cssVar.connectionColorHighlighted
	}
}

export const nodeStyle = {
	[`.${cssClass.node}`]: {
		position: 'absolute',
		'background-color': cssVar.nodeBackgroundColor,
		'border-radius': cssVar.borderRadius,
		'box-shadow': cssVar.boxShadow,
		display: 'flex',
		'flex-direction': 'column',
		'justify-content': 'space-between',
		border: `${cssNode.borderWidth}px solid transparent`,
		'min-height': `${cssNode.minSize}px`,
		'min-width': `${cssNode.minSize}px`,
		width: 'fit-content',
		'z-index': cssNode.zIndex,
		...cssTransition('border-color')
	},
	[`.${cssModifierHighlighted(cssClass.node)}`]: {
		'border-color': cssVar.borderColorHighlighted
	},
	[`.${cssModifierHasError(cssClass.node)}`]: {
		'border-color': cssVar.errorColor
	},
	[`.${cssClass.node} .content`]: {
		'user-select': 'none',
		'padding-left': '0.5em',
		'padding-right': '0.5em',
		'text-align': 'center'
	},
	[`.${cssClass.node} .pins`]: {
		display: 'flex',
		'flex-direction': 'row',
		gap: `${cssPin.size}px`,
		'justify-content': 'space-between',
		height: `${cssPin.size}px`
	}
}

export const pinStyle = {
	[`.${cssClass.pin}`]: {
		'background-color': cssVar.connectionColor,
		cursor: 'none',
		position: 'relative',
		display: 'block',
		width: `${cssPin.size}px`,
		height: `${cssPin.size}px`,
		...cssTransition('background-color')
	},
	[`.${cssClass.pin} .info`]: {
		visibility: 'hidden',
		position: 'absolute',
		'background-color': cssVar.nodeBackgroundColor
	},
	[`.${cssClass.pin} .info:not(:empty)`]: {
		padding: '2px 5px'
	},
	[`.${cssClass.pin}:hover .info`]: {
		visibility: 'visible'
	},
	[`.${cssModifierHighlighted(cssClass.pin)}`]: {
		'background-color': cssVar.connectionColorHighlighted
	}
}

export const selectorStyle = {
	[`.${cssClass.prompt}`]: {
		position: 'absolute',
		'box-shadow': cssVar.boxShadow,
		'z-index': cssNode.zIndex + 1
	},
	[`.${cssClass.prompt} input`]: {
		border: 0,
		margin: 0,
		outline: 0,
		'border-radius': cssVar.borderRadius,
		'font-family': cssVar.fontFamily,
		'font-size': cssVar.fontSize,
		padding: `${cssPrompt.padding}px`,
		width: `${cssPrompt.width - 2 * cssPrompt.padding}px`
	},
	[`.${cssClass.prompt}__hint`]: {
		position: 'absolute',
		left: '0',
		background: 'transparent',
		'pointer-events': 'none'
	},
	[`.${cssClass.prompt}__hint::placeholder`]: {
		opacity: '0.4'
	},
	[`.${cssClass.prompt}__options`]: {
		'background-color': cssVar.nodeBackgroundColor,
		height: 'fit-content'
	},
	[`.${cssClass.prompt}__option`]: {
		padding: '0.5em',
		border: '1px solid transparent',
		cursor: 'default',
		...cssTransition('border-color')
	},
	[`.${cssClass.prompt}__option--highlighted`]: {
		'border-color': cssVar.borderColorHighlighted
	}
}
