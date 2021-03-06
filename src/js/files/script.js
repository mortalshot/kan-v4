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
    el: document.querySelector("main.page"),
    smooth: true,
    lerp: 0.015,
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

let mediaQueryMmd2 = window.matchMedia('(min-width: 991.98px)');
let mediaQueryMmd3 = window.matchMedia('(min-width: 743.98px)');
let mediaQueryMd3 = window.matchMedia('(max-width: 743.98px)');

ScrollTrigger.scrollerProxy("main.page", {
    scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("main.page").style.transform ? "transform" : "fixed"
});

// !Главная страница
// Анимация home preview
if (document.querySelector('.preview')) {
    const previewTimeLine = gsap.timeline({
        scrollTrigger: {
            trigger: ".preview",
            scroller: "main.page",
            start: "top bottom",
            end: "bottom top",
        }
    })

    if (document.querySelector('.preview__title')) {
        previewTimeLine.to(".preview__title", {
            onComplete: function () {
                document.querySelector('.preview__title').classList.add('_active');
            },
        });
    }
    if (document.querySelector('.preview__subtitle')) {
        previewTimeLine.to(".preview__subtitle", {
            onComplete: function () {
                document.querySelector('.preview__subtitle').classList.add('_active');
            },
        });
    }
    if (document.querySelector('.preview__subtitle .link-circle')) {
        previewTimeLine.from(".preview__subtitle .link-circle", { opacity: 0, rotate: -180, scale: 0.5, delay: 0.5 });
    }
    if (document.querySelector('.preview__social')) {
        previewTimeLine.fromTo(".preview__social", { opacity: 0, x: "200%", y: "-50%", }, { opacity: 1, y: "-50%", x: 0 });
    }
    if (document.querySelector('.preview__scroll a')) {
        previewTimeLine.from(".preview__scroll a", { opacity: 0 });
    }
}

// Анимация секции about
if (document.querySelector('.about')) {
    function handleMmd2Change(e) {
        if (e.matches) {
           /*  ScrollTrigger.create({
                trigger: ".about",
                scroller: "main.page",
                start: "top top",
                end: "+=100%",
                // markers: true,
                pin: true,
            })

            const aboutTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: ".about",
                    scroller: "main.page",
                    start: "50% bottom",
                    end: "bottom top",
                    scrub: 1,
                    // markers: true,
                }
            })

            if (document.querySelector('.about__body')) {
                aboutTimeLine.from(".about__body", { y: "-100%", duration: 0.6 })
            }
            if (document.querySelector('.about__image._image-left')) {
                aboutTimeLine.from(".about__image._image-left", { opacity: 0, y: "-10%" }, "-=0.4")
            }
            if (document.querySelector('.about__image._image-right')) {
                aboutTimeLine.from(".about__image._image-right", { opacity: 0, y: "70%" }, "-=0.5")
            } */


            const aboutTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: ".about",
                    scroller: "main.page",
                    start: "50% bottom",
                    end: "bottom top",
                    scrub: 1,
                    // markers: true,
                }
            })
            if (document.querySelector('.about__image._image-left')) {
                aboutTimeLine.from(".about__image._image-left", { opacity: 0, y: "-10%" }, "-=0.4")
            }
            if (document.querySelector('.about__image._image-right')) {
                aboutTimeLine.from(".about__image._image-right", { opacity: 0, y: "70%" }, "-=0.5")
            }

        }
        else {
            const aboutTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: ".about",
                    scroller: "main.page",
                    start: "20% bottom",
                    end: "bottom top",
                    // markers: true,
                }
            })

            if (document.querySelector('.about__image._image-left')) {
                aboutTimeLine.from(".about__image._image-left", { opacity: 0, x: "-50%" })
            }
            if (document.querySelector('.about__image._image-right')) {
                aboutTimeLine.from(".about__image._image-right", { opacity: 0, x: "100%" })
            }
        }
    }
    mediaQueryMmd2.addEventListener('change', handleMmd2Change);
    handleMmd2Change(mediaQueryMmd2);
}

// Печатаем текст категорий при скролле только один раз на десктопе
const categoriesItems = document.querySelectorAll('.categories__item');
if (categoriesItems.length > 0) {
    function handleMmd3Change(e) {
        if (e.matches) {
            categoriesItems.forEach(element => {
                const elementText = element.innerHTML;
                const isRolling = Symbol(elementText);

                function getPositions(length) {
                    return Array.from(new Array(length), () => [
                        (length * Math.random() | 0) % length,
                        (length * Math.random() | 0) % length,
                    ]);
                }

                async function rollText(item) {
                    if (item[isRolling]) return;
                    item[isRolling] = true;
                    const word = [...item.textContent];
                    const ps = getPositions(word.length);
                    const computedWords = [word.join("")];
                    for (const [p1, p2] of ps) {
                        [word[p1], word[p2]] = [word[p2], word[p1]];
                        computedWords.push(item.textContent = word.join(""));
                        await delay(100);
                    }

                    while (computedWords.length) {
                        const word = computedWords.pop();
                        item.textContent = word;
                        await delay(100);
                    }

                    item[isRolling] = false;
                }

                function delay(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                ScrollTrigger.create({
                    trigger: element,
                    scroller: "main.page",
                    start: "top bottom",
                    end: "bottom top",
                    once: true,

                    onEnter: function () {
                        rollText(element);
                    },
                })
            });
        } else {
            categoriesItems.forEach(element => {
                ScrollTrigger.create({
                    trigger: element,
                    scroller: "main.page",
                    start: "bottom bottom",
                    end: "bottom top",
                    onEnter: function () {
                        element.style.transform = "translateX(0)";
                    }
                })
            });
        }
    }
    mediaQueryMmd3.addEventListener('change', handleMmd3Change);
    handleMmd3Change(mediaQueryMmd3);
}

// Анимация секции cases
const cases = document.querySelector('.cases');
if (cases) {
    setTimeout(() => {
        const caseTitles = document.querySelectorAll('.single-case__title');
        caseTitles.forEach(title => {
            ScrollTrigger.create({
                trigger: title,
                scroller: "main.page",
                start: "top 80%",
                end: "bottom top",
                onEnter: function () {
                    title.classList.add('_active')
                }
            });
        });

        const caseLeftJobs = document.querySelectorAll('._anim-left .single-case__link');
        caseLeftJobs.forEach(leftJob => {
            let caseLeftJobsTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: leftJob,
                    scroller: "main.page",
                    start: "top 80%",
                    end: "bottom top",
                }
            })
            caseLeftJobsTimeLine.from(leftJob.querySelector('.single-case__image'), { opacity: 0, x: "-100%" });
            caseLeftJobsTimeLine.from(leftJob.querySelector('.single-case__caption'), { opacity: 0, x: "-100%" });
        });

        const caseRightJobs = document.querySelectorAll('._anim-right .single-case__link');
        caseRightJobs.forEach(rightJob => {
            const rightJobImage = rightJob.querySelector('.single-case__image');
            const rightJobCaption = rightJob.querySelector('.single-case__caption');

            let caseRightJobsTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: rightJob,
                    scroller: "main.page",
                    start: "top 80%",
                    end: "bottom top",
                    // markers: true,
                }
            })
            caseRightJobsTimeLine.from(rightJobImage, { opacity: 0, y: "100%" })
            caseRightJobsTimeLine.from(rightJobCaption, { opacity: 0, x: "100%" });
        });

        const caseTopJobs = document.querySelectorAll('._anim-top .single-case__link');
        caseTopJobs.forEach(topJob => {
            let caseTopJobsTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: topJob,
                    scroller: "main.page",
                    start: "top 80%",
                    end: "bottom top",
                }
            })

            caseTopJobsTimeLine.from(topJob.querySelector('.single-case__image'), { opacity: 0, y: "100%" });
            caseTopJobsTimeLine.from(topJob.querySelector('.single-case__caption'), { opacity: 0, y: "100%" });
        });

        const caseMore = document.querySelectorAll('.single-case__more');
        caseMore.forEach(more => {
            let moreTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: more,
                    scroller: "main.page",
                    start: "top 80%",
                    end: "bottom top",
                }
            })
            moreTimeLine.from(more, { scale: 0, rotate: "-180" });
        });
    }, 300);
}

// Запуск анимации секции marquee
const marquee = document.querySelector('.marquee');
if (marquee) {
    ScrollTrigger.create({
        trigger: marquee,
        scroller: "main.page",
        start: "top bottom",
        end: "bottom top",
        onToggle: function () {
            marquee.classList.toggle('_active');
        }
    })
}

// Анимация секции features
const features = document.querySelector('.features');
if (features) {
    function handleMmd2Change(e) {
        if (e.matches) {
            // Анимация для body
            ScrollTrigger.create({
                trigger: ".features__body",
                scroller: "main.page",
                start: "top top",
                end: "+=50%",
                // markers: true,
                // pin: true,
            })

            const featuresBodyTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: ".features__body",
                    scroller: "main.page",
                    start: "top 50%",
                    end: "bottom top",
                    scrub: 1,
                    // markers: true,
                }
            })

            if (document.querySelector('.features__title')) {
                featuresBodyTimeLine.add(function () {
                    document.querySelector('.features__title').classList.add('_active');
                });

                featuresBodyTimeLine.from(".features__title", { y: "30%" });
            }
            if (document.querySelector('.features__text')) {
                featuresBodyTimeLine.fromTo(".features__text", { y: "50%" }, { y: "-50%", }, "-=0.5");
                featuresBodyTimeLine.to(".features__text", { y: "0", duration: 0.5 });
            }

            // Анимация для row
/*             ScrollTrigger.create({
                trigger: ".features__row",
                scroller: "main.page",
                start: "-700px -600px",
                end: "+=30%",
                // markers: true,
                pin: true,
            }) */

            const featuresRowTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: ".features__row",
                    scroller: "main.page",
                    start: "top bottom",
                    end: "top center",
                    // start: "top bottom",
                    // end: "bottom top",
                    scrub: 1,
                    // markers: true,
                }
            })

            featuresRowTimeLine.from('.feature-item__text', { y: "-200%" });
            featuresRowTimeLine.from('.feature-item__icon', { y: "-100%", opacity: 0 });
        } else {
            gsap.to(".features__title", {
                scrollTrigger: {
                    trigger: ".features__title",
                    start: "top 70%",
                    end: "bottom top",
                    onToggle: function () {
                        document.querySelector('.features__title').classList.add('_active');
                    }
                }
            })
        }
    }
    mediaQueryMmd2.addEventListener('change', handleMmd2Change);
    handleMmd2Change(mediaQueryMmd2);
}

const featuresLocated = document.querySelector('.features__located');
if (featuresLocated) {
    // Анимация для features__located
    const featuresLocatedTimeLine = gsap.timeline({
        scrollTrigger: {
            trigger: featuresLocated,
            scroller: "main.page",
            // start: "top center",
            // end: "bottom top",
            start: "top 75%",
            end: "bottom top",
            // markers: true,
        }
    })

    featuresLocatedTimeLine.add(function () {
        featuresLocated.classList.add('_active');
    });
    featuresLocatedTimeLine.from(".features__located .link-circle", { opacity: 0, rotate: -180, scale: 0.5, delay: 0.5 });
}

// Текст по кругу кнопки more
const featuresMore = document.querySelector('.features__more-bg');
if (featuresMore) {
    ScrollTrigger.create({
        trigger: ".features",
        scroller: "main.page",
        start: "top bottom",
        end: "bottom top",

        onToggle: function () {
            featuresMore.classList.toggle('_action');
        },
    })
}

// Смена цветовой темы при достижении секции #features__located
const bgColorChangeTarget = document.querySelector('.home .features__located');
if (bgColorChangeTarget) {
    ScrollTrigger.create({
        trigger: ".home .features__located",
        scroller: "main.page",
        start: "top center",
        end: "top top",
        // markers: true,
        onEnter: function () {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            // document.querySelector('.features__located').classList.add('_active');
        },
        onLeaveBack: function () {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        },
    });
}

// !Архивная страница
// Анимация для категорий
const taxonomyCategories = document.querySelectorAll('.portfolio-archive__categories ul');
if (taxonomyCategories.length > 0) {
    taxonomyCategories.forEach(category => {
        ScrollTrigger.create({
            trigger: category,
            scroller: "main.page",
            start: "-90px bottom",
            end: "bottom top",
            // markers: true,

            onEnter: function () {
                category.classList.add('_show');
            },
        });
    });
}

const archivePortfolioItems = document.querySelectorAll('.portfolio-archive__item');
if (archivePortfolioItems.length > 0) {
    let j = 0;
    archivePortfolioItems.forEach(element => {
        if (j % 2 == 0) {
            let elementRightTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: element,
                    scroller: "main.page",
                    start: "-90px 60%",
                    end: "bottom top",
                    // markers: true,
                }
            });
            elementRightTimeLine.from(element.querySelector('.single-case__image'), { opacity: 0, x: "100%" });
            elementRightTimeLine.from(element.querySelector('.single-case__caption'), { opacity: 0, x: "100%" });
        }
        else {
            let elementLeftTimeLine = gsap.timeline({
                scrollTrigger: {
                    trigger: element,
                    scroller: "main.page",
                    start: "-90px 60%",
                    end: "bottom top",
                    // markers: true,
                }
            });
            elementLeftTimeLine.from(element.querySelector('.single-case__image'), { opacity: 0, x: "-100%" });
            elementLeftTimeLine.from(element.querySelector('.single-case__caption'), { opacity: 0, x: "-100%" });
        }
        j++;
    });
}

// !Страница услуг
const services = document.querySelector('.services');
if (services) {
    let servicesTimeLine = gsap.timeline({
        scrollTrigger: {
            trigger: ".services",
            scroller: "main.page",
            start: "-90px bottom",
            end: "bottom top",
            // markers: true,
        }
    })

    servicesTimeLine.to(".services__title", {
        onComplete: function () {
            document.querySelector('.services__title').classList.add('_active');
        },
    });

    const servicesItems = document.querySelectorAll('.spollers__item');
    servicesItems.forEach(element => {
        servicesTimeLine.to(element, {
            onComplete: function () {
                element.classList.add('_active');
            },
        });
    });
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
    if (values.length > 1) {
        const transform = values[1].split(/,\s?/g).map(parseInt);

        return {
            x: transform[0],
            y: transform[1],
            z: transform[2]
        };
    }
    else {
        return {
            x: 0,
            y: 0,
            z: 0
        };
    }
}

// Анимация наведения у слайдера с кейсами
const slider = document.querySelector('.cases__slider');
if (slider && !isMobile.any()) {
    const buttonPrev = document.querySelector('.cases__slider .swiper__button_prev');
    const buttonNext = document.querySelector('.cases__slider .swiper__button_next');
    const sliderWrapper = document.querySelector('.cases__wrapper');

    buttonPrev.addEventListener('mouseover', function () {
        slider.classList.remove('_slide-change');
        moveLeftSliderWrapper(sliderWrapper);
    })
    buttonPrev.addEventListener('mouseout', function () {
        if (!slider.classList.contains('_slide-change')) {
            moveRightSliderWrapper(sliderWrapper);
        }
    })
    buttonNext.addEventListener('mouseover', function () {
        slider.classList.remove('_slide-change');
        moveRightSliderWrapper(sliderWrapper);
    })
    buttonNext.addEventListener('mouseout', function () {
        if (!slider.classList.contains('_slide-change')) {
            moveLeftSliderWrapper(sliderWrapper);
        }
    })

    function moveLeftSliderWrapper(slider) {
        let translateX = getMatrix(slider).x;
        slider.style.transform = `translate3d(${translateX + 300}px, 0, 0)`;
    }
    function moveRightSliderWrapper(slider) {
        let translateX = getMatrix(slider).x;
        slider.style.transform = `translate3d(${translateX - 300}px, 0, 0)`;
    }
}

// Навигация по странице
gsap.utils.toArray(".anchor-link a").forEach(function (a) {
    a.addEventListener("click", function (e) {
        e.preventDefault();
        locoScroll.scrollTo(e.target.getAttribute("href"))
    });
});

// Анимация перехода по страницам
const transitionElement = document.querySelector('.transition-thumb');
const links = document.querySelectorAll('.menu__body a, a[data-page-link]');

if (transitionElement) {
    setTimeout(() => {
        transitionElement.classList.remove('_active');
    }, 500);
}

if (links.length > 0) {
    links.forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            let target = e.target.href;

            if (window.location.href != target) {
                if (transitionElement) {
                    transitionElement.classList.add('_active');
                }

                setTimeout(() => {
                    window.location.href = target;
                }, 500);
            }
        })
    });
}

// Обновляем высоту страницы при клике на спойлер
const spollersTitles = document.querySelectorAll('.spollers__title');
if (spollersTitles.length > 0) {
    spollersTitles.forEach(element => {
        element.addEventListener('click', function () {
            locoScroll.update();
            ScrollTrigger.update;
        })
    });
}