import { flowViewElements } from "./elements-list.js";

export function flowViewInit(elementDefinitions = flowViewElements) {
  elementDefinitions.forEach((customElementClass) => {
    const { customElementName } = customElementClass;

    if (!customElements.get(customElementName)) {
      customElements.define(customElementName, customElementClass);
    }
  });
}
