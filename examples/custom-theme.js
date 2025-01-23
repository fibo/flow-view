function indent(code) {
    const rows = code.split('\n').filter((row) => row != row.trim());

    const firstRow = rows[0];
    let indentationLenght = 0;

    for (let i = 0; i < firstRow.length; i++)
        if (firstRow[i] === ' ') indentationLenght++;
        else break;

    return rows.map((row) => row.substring(indentationLenght)).join('\n');
}

// TODO put `indent` in some shared place
// it could be inside a x-code web component

const customTheme = document.querySelector('style#custom-theme').innerHTML;

document.querySelector('code').innerHTML = indent(customTheme);
