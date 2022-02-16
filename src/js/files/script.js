// Подключение функционала
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";


import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
gsap.registerPlugin(ScrollTrigger);




import LocomotiveScroll from 'locomotive-scroll';
import "../../scss/libs/locomotive-scroll.scss";

const locoScroll = new LocomotiveScroll({
    el: document.querySelector(".page"),
    smooth: true,
    lerp: 0.02,
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".page" element since Locomotive Scroll is hijacking things
// !scroller: ".page",
ScrollTrigger.scrollerProxy(".page", {
    scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector(".page").style.transform ? "transform" : "fixed"
});

// Смена цветовой темы при достижении секции #features__located
const featuresLocated = document.querySelector('.features__located');
if (featuresLocated) {
    ScrollTrigger.create({
        trigger: ".features__located",
        scroller: ".page",
        start: "top bottom",
        end: "bottom top",
        // markers: true,
        onToggle: function () {
            document.documentElement.classList.toggle('dark');
            document.documentElement.classList.toggle('light');
        },
        /*             onEnter: function () {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.classList.add('light');
                    },
                    onLeaveBack: function () {
                        document.documentElement.classList.add('dark');
                        document.documentElement.classList.remove('light');
                    }, */
    });
}

// Печатаем текст категорий при скролле только один раз на десктопе
const categoriesItems = document.querySelectorAll('.categories__item');
if (categoriesItems.length > 0) {

    let mediaQueryMmd3 = window.matchMedia('(min-width: 743.98px)')
    function handleMmd3Change(e) {
        if (e.matches) {
            categoriesItems.forEach(element => {
                const elementText = element.innerHTML;

                const elementStyleHeight = element.getBoundingClientRect().height;
                element.style.height = elementStyleHeight + "px";
                element.innerHTML = "";

                ScrollTrigger.create({
                    trigger: element,
                    scroller: ".page",
                    start: "top bottom",
                    end: "bottom top",
                    once: true,

                    onEnter: function () {
                        let line = 0;
                        let count = 0;
                        let result = '';

                        function typeLine() {
                            let interval = setTimeout(
                                () => {
                                    result += elementText[line]
                                    element.innerHTML = result + '|';


                                    count++;
                                    if (count >= elementText[line].length) {
                                        count = 0;
                                        line++;
                                        if (line == elementText.length) {
                                            clearTimeout(interval);
                                            element.innerHTML = result;
                                            return true;
                                        }
                                    }
                                    typeLine();
                                }, 150)
                        }

                        typeLine();
                    },
                })

            });
        }
    }
    mediaQueryMmd3.addEventListener('change', handleMmd3Change);
    handleMmd3Change(mediaQueryMmd3);

    // Выезд текста категорий на мобилах
    let mediaQueryMd3 = window.matchMedia('(max-width: 743.98px)')
    function handleMd3Change(e) {
        if (e.matches) {
            categoriesItems.forEach(element => {
                ScrollTrigger.create({
                    trigger: element,
                    scroller: ".page",
                    start: "bottom bottom",
                    end: "bottom top",
                    onEnter: function () {
                        element.style.transform = "translateX(0)";
                    }
                })
            });
        }
    }
    mediaQueryMd3.addEventListener('change', handleMd3Change);
    handleMd3Change(mediaQueryMd3);
}

// Появление сверху
const animShowTop = document.querySelectorAll('.anim-show-top');
if (animShowTop.length > 0) {
    animShowTop.forEach(element => {
        ScrollTrigger.create({
            trigger: element,
            scroller: ".page",
            start: "top 90%",
            end: "bottom top",

            onToggle: function () {
                element.classList.toggle('_active');
            }
        })
    });
}

// Появление снизу
const animShowBottom = document.querySelectorAll('.anim-show-bottom');
if (animShowBottom.length > 0) {
    animShowBottom.forEach(element => {
        ScrollTrigger.create({
            trigger: element,
            scroller: ".page",
            start: "top 90%",
            end: "bottom top",

            onToggle: function () {
                element.classList.toggle('_active');
            }
        })
    });
}

// Появление c поворотом
const animShowRotate = document.querySelectorAll('.anim-show-rotate');
if (animShowRotate.length > 0) {
    animShowRotate.forEach(element => {
        ScrollTrigger.create({
            trigger: element,
            scroller: ".page",
            start: "top 90%",
            end: "bottom top",

            onToggle: function () {
                element.classList.toggle('_active');
            }
        })
    });
}

// Текст по кругу кнопки more
const featuresMore = document.querySelector('.features__more-bg');
if (featuresMore) {
    ScrollTrigger.create({
        trigger: ".features",
        scroller: ".page",
        start: "top bottom",
        end: "bottom top",

        onToggle: function () {
            featuresMore.classList.toggle('_action');
        },
    })
}

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

// Анимация фокусного состояния инпута
let input = document.querySelectorAll('.input');
if (input.length > 0) {
    input.forEach(item => {
        const itemParent = item.closest('.form__item-wrapper');
        if (item.value.length > 0) {
            itemParent.classList.add('_focus');
        }

        item.addEventListener("focus", function () {
            const itemParent = item.closest('.form__item-wrapper');
            itemParent.classList.add('_focus');
        });
        item.addEventListener("blur", function () {
            const itemParent = item.closest('.form__item-wrapper');
            if (!item.value.length > 0) {
                itemParent.classList.remove('_focus');
            }
        });
    });
}


// Получение значение стиля transform
function getMatrix(element) {
    const values = element.style.transform.split(/\w+\(|\);?/);
    const transform = values[1].split(/,\s?/g).map(parseInt);

    return {
        x: transform[0],
        y: transform[1],
        z: transform[2]
    };
}

// Анимация наведения у слайдера с кейсами
const slider = document.querySelector('.cases__slider');
if (slider && !isMobile.any()) {
    const buttonPrev = document.querySelector('.cases__slider .swiper__button_prev')
    const buttonNext = document.querySelector('.cases__slider .swiper__button_next')
    const sliderWrapper = document.querySelector('.cases__wrapper')

    buttonPrev.addEventListener('mouseover', function () {
        slider.classList.remove('_slide-change');
        moveLeftSliderWrapper();
    })
    buttonPrev.addEventListener('mouseout', function () {
        if (!slider.classList.contains('_slide-change')) {
            moveRightSliderWrapper();
        }
    })
    buttonNext.addEventListener('mouseover', function () {
        slider.classList.remove('_slide-change');
        moveRightSliderWrapper();
    })
    buttonNext.addEventListener('mouseout', function () {
        if (!slider.classList.contains('_slide-change')) {
            moveLeftSliderWrapper();
        }
    })

    function moveLeftSliderWrapper() {
        let translateX = getMatrix(sliderWrapper).x;
        sliderWrapper.style.transform = `translate3d(${translateX + 300}px, 0, 0)`;
    }
    function moveRightSliderWrapper() {
        let translateX = getMatrix(sliderWrapper).x;
        sliderWrapper.style.transform = `translate3d(${translateX - 300}px, 0, 0)`;
    }
}

