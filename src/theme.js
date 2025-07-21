/** @param {string} cssName */
export const cssModifierHighlighted = (cssName) => `${cssName}--highlighted`

/** @param {string} cssName */
export const cssModifierHasError = (cssName) => `${cssName}--error`

/** @param {string} prop */
export const cssTransition = (prop) => ({
	transition: `${prop} 117ms ease-in-out`
})

export const cssClass = {
	edge: 'fv-edge',
	node: 'fv-node',
	pin: 'fv-pin',
	selector: 'fv-selector',
}

export const cssEdge = {
	lineWidth: 2,
	zIndex: 0,
};

export const cssPin = {
	size: 10,
};

export const cssSelector = {
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
const fvCssVar = (name) => `var(--fv-${name},var(${fvCssDefaultVarName(name)}))`
export const cssVar = {
	backgroundColor: fvCssVar("background-color"),
	borderColorHighlighted: fvCssVar(cssModifierHighlighted("node-border-color")),
	borderRadius: fvCssVar("border-radius"),
	boxShadow: fvCssVar("box-shadow"),
	connectionColor: fvCssVar("connection-color"),
	connectionColorHighlighted: fvCssVar(cssModifierHighlighted("connection-color")),
	errorColor: fvCssVar("error-color"),
	fontFamily: fvCssVar("font-family"),
	fontSize: fvCssVar("font-size"),
	nodeBackgroundColor: fvCssVar("node-background-color"),
	textColor: fvCssVar("text-color")
}

const cssBase = {
	"border-radius": "2px",
	"font-family": "system-ui sans-serif",
	"font-size": "16px"
}

export const cssDefault = {
	light: {
		...cssBase,
		"background-color": "#fefefe",
		"connection-color": "#ccc",
		"box-shadow": "0px 0px 7px 1px rgba(0,0,0,0.1)",
		[cssModifierHighlighted("connection-color")]: "#717171",
		"error-color": "#ffa600",
		"node-background-color": "#fefefe",
		[cssModifierHighlighted("node-border-color")]: "#717171",
		"text-color": "#222"
	},
	dark: {
		...cssBase,
		"background-color": "#555",
		"connection-color": "#aaa",
		"box-shadow": "0px 0px 17px 1px rgba(0,0,0,0.34)",
		[cssModifierHighlighted("connection-color")]: "#ddd",
		"error-color": "#ffb600",
		"node-background-color": "#2b2b2b",
		[cssModifierHighlighted("node-border-color")]: "#efefef",
		"text-color": "#ccc"
	}
}

/** @param {"light" | "dark"} colorScheme */
export const cssTheme = (colorScheme) =>
	Object.entries(cssDefault[colorScheme]).reduce(
		(theme, [key, value]) => ({
			...theme,
			[fvCssDefaultVarName(key)]: value
		}),
		{}
	)
