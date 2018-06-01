"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InterfaceComponents = (function () {
    function InterfaceComponents() {
        var _this = this;
        this.addListeners = function () {
            var navLinks = document.querySelectorAll(".bottom-nav .nav-link");
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].addEventListener("click", function (e) {
                    var targ = e.target;
                    var targId = targ.classList;
                    for (var i_1 = 0; i_1 < targId.length; i_1++) {
                        if (targId[i_1] !== "nav-link") {
                            _this.switchPages(targId[i_1]);
                            return;
                        }
                    }
                });
            }
            var iconSettingsNav = document.querySelector("#top-icon-nav-settings");
            iconSettingsNav.addEventListener('click', _this.toggleSettingsNav);
        };
        this.toggleSettingsNav = function () {
            var settingsNav = document.querySelector("nav#options-visualisation");
            var iconSettingsNav = document.querySelector("#top-icon-nav-settings");
            settingsNav.classList.toggle("active");
            iconSettingsNav.classList.toggle("active");
        };
        this.addTag = function (tag, parent, text, elmtClass) {
            var element = document.createElement(tag);
            element.textContent = text;
            if (elmtClass !== undefined) {
                element.classList.add(elmtClass);
            }
            var parentElmt = document.querySelector(parent);
            parentElmt.appendChild(element);
        };
        this.switchPages = function (sectionToDisplay) {
            var idSections = ["writing", "stats", "messages"];
            for (var i = 0; i < idSections.length; i++) {
                var section = document.querySelector("#" + idSections[i]);
                if (idSections[i] === sectionToDisplay) {
                    if (section.classList.contains("hidden")) {
                        section.classList.remove("hidden");
                    }
                }
                else {
                    if (!section.classList.contains("hidden")) {
                        section.classList.add("hidden");
                    }
                }
            }
            _this.switchMenu();
        };
        this.addListeners();
        window.addEventListener('native.keyboardshow', this.hideBottomMenu);
    }
    InterfaceComponents.prototype.hideBottomMenu = function () {
        var bottomMenu = document.querySelector(".bottom-nav");
        bottomMenu.style.display = "none";
    };
    InterfaceComponents.prototype.switchMenu = function () {
    };
    return InterfaceComponents;
}());
exports.InterfaceComponents = InterfaceComponents;
//# sourceMappingURL=interfaceComponents.js.map