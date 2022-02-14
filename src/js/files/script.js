// Подключение функционала
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";


/* import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
gsap.registerPlugin(ScrollTrigger);


import LocomotiveScroll from 'locomotive-scroll';
import "../../scss/libs/locomotive-scroll.scss";

const locoScroll = new LocomotiveScroll({
    el: document.querySelector(".page"),
    smooth: true,
    lerp: 0.01,
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

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh(); */

// Анимация фокусного состояния инпута
let input = document.querySelectorAll('.input');
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
if (document.querySelector('.cases__slider') && !isMobile.any()) {
    const buttonPrev = document.querySelector('.cases__slider .swiper__button_prev')
    const buttonNext = document.querySelector('.cases__slider .swiper__button_next')
    const sliderWrapper = document.querySelector('.cases__wrapper')

    buttonPrev.addEventListener('mouseover', function () {
        moveLeftSliderWrapper();
    })
    buttonPrev.addEventListener('mouseout', function () {
        moveRightSliderWrapper();
    })
    buttonNext.addEventListener('mouseover', function () {
        moveRightSliderWrapper();
    })
    buttonNext.addEventListener('mouseout', function () {
        moveLeftSliderWrapper();
    })

    function moveLeftSliderWrapper() {
        let translateX = getMatrix(sliderWrapper).x;
        sliderWrapper.style.transform = `translate3d(${translateX + 200}px, 0, 0)`;
    }
    function moveRightSliderWrapper() {
        let translateX = getMatrix(sliderWrapper).x;
        sliderWrapper.style.transform = `translate3d(${translateX - 200}px, 0, 0)`;
    }
}