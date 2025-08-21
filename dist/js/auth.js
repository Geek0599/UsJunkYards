(() => {
    "use strict";
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            bodyLockStatus = false;
            if (delay) setTimeout((function() {
                bodyLockStatus = true;
                document.documentElement.style.removeProperty("--scrollbar-compensate");
                document.documentElement.classList.remove("lock");
            }), delay); else {
                bodyLockStatus = true;
                document.documentElement.style.removeProperty("--scrollbar-compensate");
                document.documentElement.classList.remove("lock");
            }
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const scrollbarCompensate = window.innerWidth - document.querySelector(".wrapper").offsetWidth;
            if (scrollbarCompensate > 0) document.documentElement.style.setProperty("--scrollbar-compensate", scrollbarCompensate + "px");
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            if (delay) setTimeout((function() {
                bodyLockStatus = true;
            }), delay); else bodyLockStatus = true;
        }
    };
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function scrollToPositionByDuration({container, targetTop, duration = 500, transitionTimingFunction = false}) {
        const startTop = container.scrollTop;
        const distance = targetTop - startTop;
        const startTime = performance.now();
        function scroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = transitionTimingFunction ? transitionTimingFunction : .5 - Math.cos(progress * Math.PI) / 2;
            container.scrollTop = startTop + distance * ease;
            if (progress < 1) requestAnimationFrame(scroll);
        }
        requestAnimationFrame(scroll);
    }
    function initRatings() {
        const ratings = document.querySelectorAll(".rating:not(.rating_initialized)");
        if (ratings.length > 0) ratings.forEach((rating => {
            initRating(rating);
            rating.classList.add("rating_initialized");
        }));
        function initRating(rating) {
            let ratingActive = rating.querySelector(".rating__active");
            let ratingValue = rating.dataset.rating || rating.querySelector(".rating__value");
            function setRatingActiveWidth(index = rating.dataset.rating || ratingValue.innerHTML) {
                const ratingActiveWidth = index / .05;
                ratingActive.style.width = `${ratingActiveWidth}%`;
            }
            setRatingActiveWidth();
            if (rating.classList.contains("rating_set")) {
                const ratingItems = rating.querySelectorAll(".rating__item");
                ratingItems.forEach((item => {
                    item.addEventListener("mouseenter", (() => {
                        setRatingActiveWidth(item.value);
                    }));
                    item.addEventListener("mouseleave", (() => {
                        setRatingActiveWidth();
                    }));
                    item.addEventListener("click", (async () => {
                        if (rating.dataset.ajax) await setRatingValue(item.value, rating); else {
                            rating.dataset.rating ? rating.dataset.rating = item.value : ratingValue.innerHTML = item.value;
                            setRatingActiveWidth();
                        }
                    }));
                }));
            }
        }
        async function setRatingValue(value, rating) {
            if (!rating.classList.contains("rating_sending")) {
                rating.classList.add("rating_sending");
                try {
                    let response = await fetch("rating.json", {
                        method: "GET"
                    });
                    if (response.ok) {
                        const result = await response.json();
                        rating.dataset.rating ? rating.dataset.rating = result.newRating : ratingValue.innerHTML = result.newRating;
                        setRatingActiveWidth();
                    } else console.log("Error");
                } catch (error) {
                    console.log("Error:", error);
                } finally {
                    rating.classList.remove("rating_sending");
                }
            }
        }
    }
    window.initRatings = initRatings;
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerClose.classList.remove("_spoller-active");
                    _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                }));
            }));
        }
    }
    function DynamicAdapt(type) {
        this.type = type;
        this.resizeTimeout;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.originalNextSibling = node.nextElementSibling;
            оbject.isMoved = false;
            this.оbjects.push(оbject);
        }
        window.addEventListener("resize", (function() {
            clearTimeout(_this.resizeTimeout);
            _this.resizeTimeout = setTimeout((function() {
                _this.mediaHandler();
            }), 0);
        }));
        this.mediaHandler();
    };
    DynamicAdapt.prototype.mediaHandler = function() {
        for (let i = 0; i < this.оbjects.length; i++) {
            const оbject = this.оbjects[i];
            const matchMedia = window.matchMedia("(max-width: " + оbject.breakpoint + "px)");
            if (matchMedia.matches) {
                if (!оbject.isMoved) {
                    this.delayedMoveTo(оbject.place, оbject.element, оbject.destination);
                    оbject.isMoved = true;
                }
            } else if (оbject.isMoved) {
                this.delayedMoveBack(оbject.parent, оbject.element, оbject.originalNextSibling);
                оbject.isMoved = false;
            }
        }
    };
    DynamicAdapt.prototype.delayedMoveTo = function(place, element, destination) {
        setTimeout((() => {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) destination.appendChild(element); else if (place === "first") destination.insertBefore(element, destination.firstElementChild); else destination.insertBefore(element, destination.children[place]);
        }), 0);
    };
    DynamicAdapt.prototype.delayedMoveBack = function(parent, element, originalNextSibling) {
        setTimeout((() => {
            element.classList.remove(this.daClassname);
            if (originalNextSibling) parent.insertBefore(element, originalNextSibling); else parent.appendChild(element);
        }), 0);
    };
    const da = new DynamicAdapt("max");
    da.init();
    isWebp();
    addLoadedClass();
    initRatings();
    spollers();
    headerMenu();
    pasteExampleIntoInput();
    headerScroll();
    loadedFontsClass();
    hoverTooltipOnStatesMap();
    copyMapFromHeaderToSectionMap();
    function headerMenu() {
        const html = document.documentElement;
        const header = document.querySelector("header.header");
        const btnMenuIcon = document.querySelector(".icon-menu");
        const btnMenuFind = document.querySelector(".menu__link--sub-menu-find");
        const mainMenu = document.querySelector(".menu-icon__menu");
        const findMenu = document.querySelector(".header__sub-menu-find");
        const btnSpoller = document.querySelector(".content-menu-find__title-spoller");
        const DELAY = 300;
        const overlayClass = "overlay-bg";
        const showSubMenuClass = "_show";
        const menuOpenClass = "menu-open";
        const btnLinkActiveClass = "_active";
        let animating = false;
        let isSpollerOpening = false;
        function lockBody() {
            animating = true;
            bodyLock(DELAY);
            html.classList.add(overlayClass);
            setTimeout((() => animating = false), DELAY);
        }
        function unlockBody() {
            animating = true;
            bodyUnlock(DELAY);
            html.classList.remove(overlayClass);
            setTimeout((() => animating = false), DELAY);
        }
        window.addEventListener("click", (e => {
            if (animating || !mainMenu) return;
            const target = e.target;
            const isMenuOpen = html.classList.contains(menuOpenClass);
            const isFindMenuOpen = findMenu?.classList.contains(showSubMenuClass);
            if (btnMenuFind?.contains(target) && findMenu) {
                e.preventDefault();
                html.classList.remove(menuOpenClass);
                findMenu?.classList.toggle(showSubMenuClass, !isFindMenuOpen);
                btnMenuFind.classList.toggle(btnLinkActiveClass, !isFindMenuOpen);
            } else if (target.closest(".icon-menu")) {
                if (isFindMenuOpen) {
                    findMenu.classList.remove(showSubMenuClass);
                    btnMenuFind.classList.remove(btnLinkActiveClass);
                }
                html.classList.toggle(menuOpenClass);
                if (html.classList.contains(menuOpenClass) && btnMenuIcon.contains(target) && window.innerWidth <= 480 && window.scrollY <= header.offsetHeight) window.scrollTo({
                    top: 0
                });
            } else if (isFindMenuOpen && !findMenu?.contains(target) && !btnMenuFind?.contains(target)) {
                findMenu.classList.remove(showSubMenuClass);
                btnMenuFind.classList.remove(btnLinkActiveClass);
            } else if (isMenuOpen && !mainMenu.contains(target)) html.classList.remove(menuOpenClass);
            const newMenuOpen = html.classList.contains(menuOpenClass);
            const newFindMenuOpen = findMenu?.classList.contains(showSubMenuClass);
            if (!isMenuOpen && !isFindMenuOpen && (newMenuOpen || newFindMenuOpen)) lockBody(); else if ((isMenuOpen || isFindMenuOpen) && !newMenuOpen && !newFindMenuOpen) unlockBody();
            if (btnSpoller && btnSpoller.contains(target) && !isSpollerOpening) {
                const delay = 530;
                setTimeout((() => {
                    if (btnSpoller.classList.contains("_spoller-active")) {
                        isSpollerOpening = true;
                        setTimeout((() => isSpollerOpening = false), delay);
                        const rect = btnSpoller.getBoundingClientRect();
                        const offsetTop = rect.top + mainMenu.scrollTop;
                        scrollToPositionByDuration({
                            container: mainMenu,
                            targetTop: offsetTop - (window.innerWidth <= 480 ? 18 : 29),
                            duration: delay
                        });
                    }
                }), 0);
            }
        }));
    }
    function pasteExampleIntoInput() {
        const buttons = document.querySelectorAll("[data-paste-btn]");
        if (buttons) buttons.forEach((btn => {
            btn.addEventListener("click", (e => {
                const input = btn.closest("[data-paste]")?.querySelector("[data-paste-input]");
                input ? input.value = btn.textContent : null;
            }));
        }));
    }
    function headerScroll() {
        const header = document.querySelector("header");
        const headerWrapper = header.querySelector(".header__wrapper");
        const mainSection = document.querySelector(".main");
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        const pcScroll = "_header-pc-scroll";
        const fullScrolled = "_header-full-scroll";
        const offset = 20;
        let headerOffset = headerWrapper.offsetHeight;
        document.addEventListener("scroll", (function(e) {
            const scrollTop = window.scrollY;
            if (window.innerWidth >= 479.98) if (scrollTop >= startPoint && scrollTop > mainSection.offsetHeight + offset) !header.classList.contains(pcScroll) ? header.classList.add(pcScroll) : null; else header.classList.contains(pcScroll) ? header.classList.remove(pcScroll) : null;
            if (scrollTop >= startPoint && scrollTop >= headerOffset + offset) !header.classList.contains(fullScrolled) ? header.classList.add(fullScrolled) : null; else {
                header.classList.contains(fullScrolled) ? header.classList.remove(fullScrolled) : null;
                headerOffset = headerWrapper.offsetHeight;
            }
        }));
    }
    async function loadedFontsClass() {
        await document.fonts.ready;
        document.documentElement.classList.add("loaded-fonts");
    }
    function hoverTooltipOnStatesMap() {
        const activeAttr = "data-show";
        const offset = 20;
        const tooltip = document.createElement("div");
        tooltip.setAttribute("data-tooltip", "");
        tooltip.setAttribute("role", "tooltip");
        document.body.appendChild(tooltip);
        function positionTooltip(e, target) {
            const name = target.dataset.stateName;
            if (tooltip.innerText !== name) tooltip.innerText = name;
            const x = e.clientX;
            const y = e.clientY;
            tooltip.style.top = window.scrollY + (y - 29) + "px";
            const tooltipWidth = tooltip.offsetWidth + offset;
            if (document.documentElement.clientWidth - x - tooltipWidth <= 0) tooltip.style.left = x - tooltipWidth + offset / 2 + "px"; else tooltip.style.left = x + offset + "px";
        }
        document.addEventListener("mousemove", (e => {
            const target = e.target.closest("[data-state-name]");
            if (target) positionTooltip(e, target);
        }));
        document.addEventListener("mouseover", (e => {
            const target = e.target.closest("[data-state-name]");
            if (target && !tooltip.hasAttribute(activeAttr)) tooltip.setAttribute(activeAttr, "");
        }));
        document.addEventListener("mouseout", (e => {
            const leaveFrom = e.target.closest("[data-state-name]");
            const enterTo = e.relatedTarget && e.relatedTarget.closest("[data-state-name]");
            if (leaveFrom && leaveFrom !== enterTo) tooltip.removeAttribute(activeAttr);
        }));
        document.addEventListener("focusin", (e => {
            const target = e.target.closest("[data-state-name]");
            if (target) {
                const rect = target.getBoundingClientRect();
                tooltip.innerText = target.dataset.stateName;
                tooltip.setAttribute(activeAttr, "");
                tooltip.style.top = window.scrollY + rect.top + "px";
                if (rect.left > document.documentElement.clientWidth - tooltip.offsetWidth) tooltip.style.left = rect.left - tooltip.offsetWidth + "px"; else tooltip.style.left = rect.left + "px";
            }
        }));
        document.addEventListener("focusout", (e => {
            if (e.target.closest("[data-state-name]")) tooltip.removeAttribute(activeAttr);
        }));
    }
    function copyMapFromHeaderToSectionMap() {
        const svgOriginal = document.querySelector("[data-state-map]");
        const sectionMap = document.querySelector(".states-map__map");
        if (!svgOriginal || !sectionMap) return;
        const svgClone = svgOriginal.cloneNode(true);
        const prefix = "-copy-";
        const idMap = new Map;
        svgClone.querySelectorAll("[id]").forEach((el => {
            const oldId = el.id;
            const newId = oldId + prefix;
            idMap.set(oldId, newId);
            el.id = newId;
        }));
        svgClone.querySelectorAll("*").forEach((el => {
            for (let i = 0; i < el.attributes.length; i++) {
                const attr = el.attributes[i];
                let val = attr.value;
                if (val.includes("#")) {
                    idMap.forEach(((newId, oldId) => {
                        val = val.replaceAll(`url(#${oldId})`, `url(#${newId})`);
                        val = val.replaceAll(`"#${oldId}"`, `"#${newId}"`);
                        val = val.replaceAll(`#${oldId}`, `#${newId}`);
                    }));
                    attr.value = val;
                }
            }
        }));
        sectionMap.insertAdjacentElement("afterbegin", svgClone);
    }
    function setOnFocusPlaceholder() {
        const inputs = document.querySelectorAll("[data-focus-placeholder]");
        inputs.forEach((input => {
            const focusPlaceholder = input.getAttribute("data-focus-placeholder");
            const initialPlaceholder = input.placeholder;
            input.addEventListener("focus", (e => {
                input.setAttribute("placeholder", focusPlaceholder);
            }));
            input.addEventListener("blur", (e => {
                input.setAttribute("placeholder", initialPlaceholder);
            }));
        }));
    }
    function formValidate() {
        const validateForms = document.querySelectorAll("[data-validate]");
        if (validateForms.length) validateForms.forEach((form => {
            const btnSubmit = form.querySelector('button[type="submit"]');
            const inputs = Array.from(form.querySelectorAll("input:not([data-no-required]), select, textarea"));
            const groupRadios = findRadioCheckboxGroup(form, "radio");
            const groupCheckbox = findRadioCheckboxGroup(form, "checkbox");
            [ groupRadios, groupCheckbox ].forEach((groupType => {
                (groupType || []).forEach((group => inputs.push(group)));
            }));
            if (inputs.length > 0) {
                form.addEventListener("submit", (e => {
                    checkInputs({
                        inputs,
                        form,
                        event: e
                    });
                }));
                form.addEventListener("update-validation", (e => {
                    checkInputs({
                        inputs,
                        form,
                        event: e
                    });
                }));
                btnSubmit && btnSubmit.addEventListener("click", (e => {
                    checkInputs({
                        inputs,
                        form,
                        event: e
                    });
                }));
                inputs.forEach((input => {
                    if (!Array.isArray(input)) {
                        input.addEventListener("input", (e => formatInput(input)));
                        input.addEventListener("change", (() => setTimeout((() => {
                            checkInput({
                                input
                            });
                        }), 0)));
                        input.addEventListener("blur", (() => {
                            setTimeout((() => {
                                if (input.value !== "") checkInput({
                                    input
                                });
                            }), 0);
                        }));
                    }
                }));
                form.addEventListener("reset", (e => {
                    inputs.forEach((input => removeStatus({
                        input
                    })));
                }));
            }
        }));
        async function checkInputs({inputs, form, event, onSuccessFormValidateCallback, onErrorFormValidateCallback}) {
            if (event) event.preventDefault();
            const isShowNotice = form?.hasAttribute("data-validate-notice");
            !isShowNotice ? form.reportValidity() : null;
            form.setAttribute("novalidate", true);
            let errors = 0;
            let firstErrorFound = false;
            form.dispatchEvent(new CustomEvent("start-validation"));
            for (const input of inputs) if (checkInput({
                input
            })) {
                errors++;
                if (!firstErrorFound) {
                    scrollToInput({
                        input
                    });
                    firstErrorFound = true;
                }
            }
            form.dispatchEvent(new CustomEvent("end-validation"));
            if (!errors) {
                const successEvent = new Event("form-validation-success");
                form.dispatchEvent(successEvent);
                if (onSuccessFormValidateCallback) onSuccessFormValidateCallback();
            } else {
                const errorEvent = new Event("form-validation-error");
                form.dispatchEvent(errorEvent);
                if (onErrorFormValidateCallback) onErrorFormValidateCallback();
            }
        }
        function checkInput({input, isTextNotice = false}) {
            let isError = false;
            if (!Array.isArray(input) && input.hasAttribute("data-skip-validation")) return isError = false;
            if (Array.isArray(input)) {
                const isRequired = input.every((radioOrCheckbox => radioOrCheckbox.required === true));
                let isGroupFilled = input.some((radioOrCheckbox => radioOrCheckbox.checked === true));
                if (isRequired && !isGroupFilled) {
                    showTextNotice({
                        input,
                        text: "Choose value",
                        isTextNotice
                    });
                    return isError = true;
                }
                return isError = false;
            }
            const value = input.value.trim();
            if (input.required || input.hasAttribute("data-required") || value !== "") {
                if (value === "") {
                    showTextNotice({
                        input,
                        text: "This field is required",
                        isTextNotice
                    });
                    return isError = true;
                }
                if (input.hasAttribute("data-math-field")) {
                    const forMathField = input.getAttribute("data-math-field");
                    const forMatchInput = input.form.querySelector("input[data-for-math]");
                    if (forMathField && forMatchInput && forMathField === forMatchInput.getAttribute("data-for-math")) if (input.value !== forMatchInput.value) {
                        showTextNotice({
                            input,
                            text: `This field must match ${forMathField} field`,
                            isTextNotice
                        });
                        return isError = true;
                    }
                }
                if (input.hasAttribute("data-number-format")) {
                    const isValidDecimal = /^(\d+([.,]\d+)?)?$/.test(value);
                    if (!isValidDecimal) {
                        showTextNotice({
                            input,
                            text: "Only numbers are allowed",
                            isTextNotice
                        });
                        return isError = true;
                    }
                }
                if (input.hasAttribute("data-number-float-format")) {
                    const value = input.value;
                    const isValidDecimal = /^(\d+[.,]?\d*|\d*[.,]?\d+)$/g.test(value);
                    if (!isValidDecimal) {
                        showTextNotice({
                            input,
                            text: "Only valid numbers are allowed",
                            isTextNotice
                        });
                        return isError = true;
                    }
                }
                if (input.hasAttribute("data-text-format")) if (!/^[a-zA-Z\s]+$/.test(value)) {
                    showTextNotice({
                        input,
                        text: `Only ${/[а-яА-Я]/.test(value) ? "Latin" : ""} letters are allowed`,
                        isTextNotice
                    });
                    return isError = true;
                }
                if (input.type === "email") if (value !== "" && !isEmailValid(input)) {
                    showTextNotice({
                        input,
                        text: "Your email address must be in the format of name@domain.com",
                        isTextNotice
                    });
                    return isError = true;
                }
                const minLength = input.hasAttribute("data-minlength") ? Number(input.dataset.minlength) : null;
                const maxLength = input.hasAttribute("data-maxlength") ? Number(input.dataset.maxlength) : null;
                if (minLength !== null && value.length < minLength) {
                    if (input.id == "year") showTextNotice({
                        input,
                        text: "Please enter the correct year",
                        isTextNotice
                    }); else showTextNotice({
                        input,
                        text: `Please enter at least ${minLength} characters`,
                        isTextNotice
                    });
                    return isError = true;
                }
                if (maxLength !== null && value.length > maxLength) {
                    showTextNotice({
                        input,
                        text: `Please enter less than ${minLength} characters`,
                        isTextNotice
                    });
                    return isError = true;
                }
                const minValue = input.hasAttribute("data-min-value") ? Number(input.dataset.minValue) : null;
                const maxValue = input.hasAttribute("data-max-value") ? Number(input.dataset.maxValue) : null;
                if (minValue !== null && Number(value) < minValue) {
                    showTextNotice({
                        input,
                        text: `Please enter a value greater than or equal to ${minValue}`,
                        isTextNotice
                    });
                    return isError = true;
                }
                if (maxValue !== null && Number(value) > maxValue) {
                    showTextNotice({
                        input,
                        text: `Please enter a value less than or equal to ${maxValue}`,
                        isTextNotice
                    });
                    return isError = true;
                }
                if (input.inputmask) {
                    const status = !input.inputmask.isComplete();
                    if (status && value !== "") {
                        showTextNotice({
                            input,
                            text: "Please enter full phone number",
                            isTextNotice
                        });
                        return isError = true;
                    }
                }
                if (input.required || input.hasAttribute("data-required") || value !== "") if (isError) addError({
                    input
                }); else if (input) removeError({
                    input
                });
            } else if (value === "") removeStatus({
                input
            }); else removeError({
                input
            });
            return isError;
        }
        function formatInput(input) {
            if (input.hasAttribute("data-maxlength")) {
                const maxLength = input.getAttribute("data-maxlength");
                if (input.value.length > maxLength) input.value = input.value.slice(0, maxLength);
            }
            if (input.hasAttribute("data-number-format")) input.value = input.value.replace(/\D/g, "");
            if (input.hasAttribute("data-number-float-format")) {
                input.type = "text";
                const start = input.selectionStart;
                const end = input.selectionEnd;
                let value = input.value;
                value = value.replace(/[^0-9.,]/g, "");
                const parts = value.split(/[.,]/);
                if (parts.length > 2) value = parts[0] + (value.includes(".") ? "." : ",") + parts[1];
                input.value = value;
                input.setSelectionRange(start, end);
            }
        }
        function addError({input}) {
            input.classList.remove("_validated");
            input.classList.add("_no-validated");
            input.setAttribute("aria-invalid", "true");
            if (!input.wasError) {
                input.addEventListener("input", (() => setTimeout((() => {
                    checkInput({
                        input
                    });
                }), 0)));
                input.wasError = true;
            }
        }
        function removeError({input}) {
            input.classList.remove("_no-validated");
            input.classList.add("_validated");
            input.setAttribute("aria-invalid", "false");
            removeTextNotice({
                input
            });
        }
        function removeStatus({input}) {
            input.classList.remove("_no-validated", "_validated");
            input.removeAttribute("aria-invalid");
            removeTextNotice({
                input
            });
        }
        function isEmailValid(input) {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(input.value);
        }
        function showTextNotice({input, text, isTextNotice = false}) {
            input = Array.isArray(input) ? input[0] : input;
            const isShowNotice = isTextNotice || input.closest("[data-validate]")?.hasAttribute("data-validate-notice");
            let notice = input.parentElement.parentElement.querySelector(".form-item__notice");
            const textNotice = input.hasAttribute("data-error-notice") ? input.getAttribute("data-error-notice") : text;
            if (isShowNotice) if (notice && notice.textContent !== textNotice) notice.textContent = textNotice; else if (!notice) {
                notice = document.createElement("label");
                notice.classList.add("form-item__notice");
                input.id ? notice.setAttribute("for", input.id) : null;
                notice.textContent = textNotice;
                if ([ "radio", "checkbox" ].includes(input.type)) input.parentElement.parentElement.insertAdjacentElement("beforeend", notice); else input.parentElement.insertAdjacentElement("afterend", notice);
            }
            addError({
                input
            });
        }
        function removeTextNotice({input}) {
            const notice = input.parentElement.parentElement.querySelector(".form-item__notice");
            notice && notice.remove();
        }
        function scrollToInput({input}) {
            const inputWithError = Array.isArray(input) ? input[0] : input;
            const errorNotice = input.parentElement.parentElement.querySelector(".form-item__notice");
            (errorNotice && inputWithError.offsetWidth === 0 ? errorNotice : inputWithError).scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
        function findRadioCheckboxGroup(parentSelector, type) {
            const groups = new Map;
            parentSelector.querySelectorAll(`input[type="${type}"]`).forEach((radioCheckbox => {
                const name = radioCheckbox.getAttribute("name");
                if (!groups.has(name)) groups.set(name, []);
                groups.get(name).push(radioCheckbox);
            }));
            return groups;
        }
        window.formValidate = {
            showTextNotice,
            removeTextNotice,
            removeError,
            removeStatus,
            addError,
            checkInputs,
            checkInput,
            scrollToInput
        };
        return {
            showTextNotice,
            removeTextNotice,
            removeError,
            removeStatus,
            addError,
            checkInputs,
            checkInput,
            scrollToInput
        };
    }
    setOnFocusPlaceholder();
    const {removeTextNotice, showTextNotice, scrollToInput} = formValidate();
    function authFormSignUp() {
        const form = document.querySelector('[data-auth="sign-up"]');
        if (!form) return;
        const searchWrapper = form.querySelector(".auth-form__search");
        const searchBtn = searchWrapper.querySelector(".search__btn");
        const searchInput = searchWrapper.querySelector(".search__input");
        const searchResults = form.querySelector(".search-results");
        const selectedCompanyBtn = form.querySelector(".auth-form__btn-selected");
        const selectedCompanyInput = selectedCompanyBtn.querySelector("input");
        const selectedCompanyText = selectedCompanyBtn.querySelector("span");
        const hideSearchResults = () => searchResults.classList.add("_hide");
        const showSearchResults = () => searchResults.classList.remove("_hide");
        const selectCompany = companyName => {
            selectedCompanyText.textContent = companyName;
            selectedCompanyInput.value = companyName;
            showSearchResults();
            searchWrapper.classList.add("hidden");
            selectedCompanyBtn.classList.remove("hidden");
            removeTextNotice({
                input: selectedCompanyInput
            });
        };
        const resetCompanySelection = () => {
            selectedCompanyBtn.classList.add("hidden");
            searchWrapper.classList.remove("hidden");
            selectedCompanyInput.value = "";
        };
        searchBtn.addEventListener("click", (() => searchInput.focus()));
        searchInput.addEventListener("focus", showSearchResults);
        document.addEventListener("click", (e => {
            const target = e.target;
            if (!target.closest(".auth-form__search") && !target.closest(".search-results")) hideSearchResults();
            if (target.closest(".search-results__btn")) {
                const item = target.closest(".search-results__item");
                const name = item.querySelector(".search-results__name").textContent.trim();
                selectCompany(name);
            }
        }));
        selectedCompanyBtn.addEventListener("click", resetCompanySelection);
        selectedCompanyBtn.addEventListener("keydown", (e => {
            if (e.key === "Enter") resetCompanySelection();
        }));
        form.addEventListener("form-validation-success", (() => form.submit()));
    }
    authFormSignUp();
    function authFormSignIn() {
        const form = document.querySelector('[data-auth="sign-in"]');
        if (form) form.addEventListener("form-validation-success", (e => {
            form.submit();
        }));
    }
    authFormSignIn();
    function authFormPasswordReset() {
        const form = document.querySelector('[data-auth="password-reset"]');
        if (form) form.addEventListener("form-validation-success", (e => {
            form.submit();
        }));
    }
    authFormPasswordReset();
    function authFormNewPassword() {
        const form = document.querySelector('[data-auth="new-password"]');
        if (form) form.addEventListener("form-validation-success", (e => {
            form.submit();
        }));
    }
    authFormNewPassword();
    function toggleShowPasswordIcon() {
        const btns = document.querySelectorAll("[data-show-hide-password]");
        btns.forEach((btn => {
            btn.addEventListener("click", (() => {
                const input = btn.parentElement.querySelector("input");
                btn.classList.toggle("_active");
                input.type = input.type === "password" ? "text" : "password";
            }));
        }));
    }
    toggleShowPasswordIcon();
})();