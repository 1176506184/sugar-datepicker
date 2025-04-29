import createElement from "./core.js";

function datePicker(el, callback) {
    const app = createElement(el, callback);
    el.setAttribute('autocomplete', 'off');
    el.addEventListener('click', () => {
        typeof el.blur === 'function' && el.blur();
        app.open();
    })
    return app;
}

(function (global) {
    global.datePicker = datePicker;
}(window));