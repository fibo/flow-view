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
	link: 'fv-link',
	node: 'fv-node',
	nodeContent: 'fv-node__content',
	pin: 'fv-pin',
	prompt: 'fv-prompt',
	group: 'fv-group'
}

export const csslink = {
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
	zIndex: csslink.zIndex + 1,
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
	semiTransparent: fvCssVar('semi-transparent'),
	textColor: fvCssVar('text-color')
}

/** @param {Record<string, string>} arg */
const defaultCssProps = (arg) => Object.entries(arg).reduce(
	(obj, [key, value]) => ({...obj, [fvCssDefaultVarName(key)]: value}), {}
);

const commonCssTheme = {
	'border-radius': '2px',
	'font-family': 'sans-serif',
	'font-size': '15px',
}

export const cssTheme = {
	light: defaultCssProps({
		'background-color': '#fefefe',
		'connection-color': '#ccc',
		'box-shadow': '0px 0px 7px 1px rgba(0,0,0,0.1)',
		[`${cssModifierHighlighted('connection-color')}`]: '#717171',
		'error-color': '#ffa600',
		'node-background-color': '#fefefe',
		[`${cssModifierHighlighted('node-border-color')}`]: '#717171',
		'text-color': '#222',
		'semi-transparent': 'rgba(0, 0, 0, 0.017)',
		...commonCssTheme
	}),
	dark: defaultCssProps({
		'background-color': '#555',
		'connection-color': '#aaa',
		'box-shadow': '0px 0px 17px 1px rgba(0,0,0,0.34)',
		[`${cssModifierHighlighted('connection-color')}`]: '#ddd',
		'error-color': '#ffb600',
		'node-background-color': '#2b2b2b',
		[`${cssModifierHighlighted('node-border-color')}`]: '#efefef',
		'text-color': '#ccc',
		'semi-transparent': 'rgba(255, 255, 255, 0.071)',
		...commonCssTheme
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

export const linkStyle = {
	[`.${cssClass.link}`]: {
		display: 'flex',
		position: 'absolute',
		border: 0,
		'pointer-events': 'none'
	},
	[`.${cssClass.link} line`]: {
		'pointer-events': 'all',
		stroke: cssVar.connectionColor,
		'stroke-width': csslink.lineWidth,
		...cssTransition('stroke')
	},
	[`.${cssModifierHasError(cssClass.link)} line`]: {
		stroke: cssVar.errorColor
	},
	[`.${cssModifierHighlighted(cssClass.link)} line`]: {
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
	[`.${cssClass.node} .${cssClass.nodeContent}`]: {
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
		'border-radius': `${cssVar.borderRadius}`,
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
	[`.${cssClass.pin}:hover`]: {
		'background-color': cssVar.connectionColorHighlighted
	},
	[`.${cssClass.pin}:hover .info`]: {
		visibility: 'visible'
	},
	[`.${cssModifierHighlighted(cssClass.pin)}`]: {
		'background-color': cssVar.connectionColorHighlighted
	}
}

export const promptStyle = {
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

export const groupStyle = {
	[`.${cssClass.group}`]: {
		position: 'absolute',
		display: 'block',
		border: `1px solid ${cssVar.borderColorHighlighted}`,
		'border-radius': cssVar.borderRadius,
		'background-color': cssVar.semiTransparent,
		'z-index': cssNode.zIndex + 1,
	}
}
