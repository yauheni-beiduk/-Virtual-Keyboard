
const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .inputs
        document.querySelectorAll(".inputs").forEach(element => {
            
            function curValue() {
                 Keyboard.open(element.value, currentValue => {
                        element.value = currentValue;
                    });
            }
            element.addEventListener("focus", curValue);
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    function backspaceValue() {
                        Keyboard.properties.value = Keyboard.properties.value.substring(0, Keyboard.properties.value.length - 1);
                        Keyboard._triggerEvent("oninput");
                    }

                    keyElement.addEventListener("click", backspaceValue);

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    function capValue()  {
                        Keyboard._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", Keyboard.properties.capsLock);
                    }

                    keyElement.addEventListener("click", capValue);

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    function enterValue() {
                        Keyboard.properties.value += "\n";
                        Keyboard._triggerEvent("oninput");
                    }
                    keyElement.addEventListener("click", enterValue);

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    function spaceValue() {
                        Keyboard.properties.value += " ";
                        Keyboard._triggerEvent("oninput");
                    }
                    keyElement.addEventListener("click", spaceValue);

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    function doneValue() {
                        Keyboard.close();
                        Keyboard._triggerEvent("onclose");
                    }
                    keyElement.addEventListener("click", doneValue);

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    function defaultValue() {
                        Keyboard.properties.value += Keyboard.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        Keyboard._triggerEvent("oninput");
                    }
                    keyElement.addEventListener("click", defaultValue);

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = null;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

function initAll() {
    Keyboard.init();
}
window.addEventListener("DOMContentLoaded", initAll);

