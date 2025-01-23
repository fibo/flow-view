const contentMap = new Map();
const scriptMap = new Map();
const anchorSelector = '.navigation a';
const selectedClass = 'selected';
const contentElement = document.querySelector('main.content');

const updateNavigation = (anchor) => {
    document
        .querySelector(`${anchorSelector}.${selectedClass}`)
        ?.classList.remove(selectedClass);
    anchor.classList.add(selectedClass);
};

const updateContent = async (url) => {
    try {
        if (contentMap.has(url)) {
            contentElement.innerHTML = contentMap.get(url);
        } else {
            const response = await fetch(url);
            const text = await response.text();
            contentMap.set(url, text);
            contentElement.innerHTML = text;
        }
    } catch (error) {
        console.error(error);
    }
};

const updateScript = async (url) => {
    try {
        const scriptId = 'example-script';
        const previousScriptElement = document.querySelector(
            `script#${scriptId}`
        );
        previousScriptElement?.remove();
        if (!url) return;
        const scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.type = 'module';
        if (scriptMap.has(url)) {
            scriptElement.innerHTML = scriptMap.get(url);
        } else {
            const response = await fetch(url);
            const text = await response.text();
            scriptMap.set(url, text);
            scriptElement.innerHTML = text;
        }
        contentElement.appendChild(scriptElement);
    } catch (error) {
        console.error(error);
    }
};

const updateDOM = (anchor) => {
    updateNavigation(anchor);
    updateContent(anchor.href);
    updateScript(anchor.dataset.script);
};

addEventListener('load', () => {
    for (const anchor of document.querySelectorAll(anchorSelector))
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            if (event.target.classList.contains(selectedClass)) return;
            if (!document.startViewTransition) return updateDOM(anchor);
            document.startViewTransition(() => {
                updateDOM(anchor);
            });
        });

    document.querySelector(anchorSelector).click();
});
