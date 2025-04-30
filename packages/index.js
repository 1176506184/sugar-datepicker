import createElement from "./core.js";

function datePicker(el, callback) {
    const app = createElement(el, callback, el.getAttribute('fixed'));
    el.setAttribute('autocomplete', 'off');
    el.addEventListener('click', (e) => {
        typeof el.blur === 'function' && el.blur();
        app.open();
        e.preventDefault();
        e.stopPropagation();
    })
    return app;
}

(function (global) {
    global.datePicker = datePicker;
}(window));