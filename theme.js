export const cssModifierHighlighted = (cssName) => (`${cssName}--highlighted`);

export const cssTransition = (prop) => ({
  transition: `${prop} 117ms ease-in-out`,
});

const fvCssDefaultVarName = (name) => (`--fv-default-${name}`);
const fvCssVar = (
  name,
) => (`var(--fv-${name},var(${fvCssDefaultVarName(name)}))`);

export const cssVar = {
  backgroundColor: fvCssVar("background-color"),
  borderRadius: fvCssVar("border-radius"),
  boxShadow: fvCssVar("box-shadow"),
  connectionColor: fvCssVar("connection-color"),
  connectionColorHighlighted: fvCssVar(
    cssModifierHighlighted("connection-color"),
  ),
  fontFamily: fvCssVar("font-family"),
  fontSize: fvCssVar("font-size"),
  nodeBackgroundColor: fvCssVar("node-background-color"),
  nodeBorderColorHighlighted: fvCssVar(
    cssModifierHighlighted("node-border-color"),
  ),
  textColor: fvCssVar("text-color"),
};

const cssBase = {
  "border-radius": "2px",
  "font-family": "sans-serif",
  "font-size": "16px",
};

export const cssDefault = {
  light: {
    ...cssBase,
    "background-color": "#fefefe",
    "connection-color": "#ccc",
    "box-shadow": "0px 0px 7px 1px rgba(0,0,0,0.1)",
    [cssModifierHighlighted("connection-color")]: "#717171",
    "node-background-color": "#fefefe",
    [cssModifierHighlighted("node-border-color")]: "#717171",
    "text-color": "#111",
  },
  dark: {
    ...cssBase,
    "background-color": "#555",
    "connection-color": "#aaa",
    "box-shadow": "0px 0px 7px 1px rgba(117,117,117,0.7)",
    [cssModifierHighlighted("connection-color")]: "#ddd",
    "node-background-color": "#212121",
    [cssModifierHighlighted("node-border-color")]: "#efefef",
    "text-color": "#bbb",
  },
};

export const cssTheme = (colorScheme) =>
  Object.entries(cssDefault[colorScheme]).reduce(
    (theme, [key, value]) => ({ ...theme, [fvCssDefaultVarName(key)]: value }),
    {},
  );
