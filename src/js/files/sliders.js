/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper, { Pagination, Lazy, Navigation } from 'swiper';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';

// Инициализация слайдеров
function initSliders() {
	// Перечень слайдеров
	// Проверяем, есть ли слайдер на стронице
	if (document.querySelector('.cases__slider')) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		let casesSlider = new Swiper('.cases__slider', { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Pagination, Lazy, Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 60,
			autoHeight: false,
			speed: 800,
			watchOverflow: true,

			/* 			effect: 'fade',
						fadeEffect: {
						  crossFade: true
						}, */

			//touchRatio: 0,
			//simulateTouch: false,
			// loop: true,

			// lazy
			preloadImages: true,
			lazy: {
				loanOnTransitionStart: true,
				loadPrevNext: true,
			},

			// Пагинация
			/* 			pagination: {
							el: '.swiper-pagination',
							type: 'bullets',
						}, */

			// Эффекты
			/*
			effect: 'fade',
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			*/

			// Скроллбар
			/*
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			*/

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.cases__slider .swiper__button_prev',
				nextEl: '.cases__slider .swiper__button_next',
			},
			/* 			// Брейкпоинты
						breakpoints: {
							320: {
								slidesPerView: 1,
								spaceBetween: 0,
								autoHeight: true,
							},
							768: {
								slidesPerView: 2,
								spaceBetween: 20,
							},
							992: {
								slidesPerView: 3,
								spaceBetween: 20,
							},
							1268: {
								slidesPerView: 4,
								spaceBetween: 30,
							},
						}, */
			// События
			on: {
				slideChange: function () {
					document.querySelector('.cases__slider').classList.add('_slide-change');
				}
			}
		});

		let mediaQueryMd4 = window.matchMedia('(max-width: 574.98px)')
		function handleMd4Change(e) {
			if (e.matches) {
				casesSlider.destroy();

				const caseImage = document.querySelectorAll('.single-case__image');
				caseImage.forEach(element => {
					const elementImage = element.querySelector('.single-case__main-image');
					const elementImageSrc = elementImage.dataset.src;
					elementImage.src = elementImageSrc;
				});
			}
		}
		mediaQueryMd4.addEventListener('change', handleMd4Change);
		handleMd4Change(mediaQueryMd4);
	}
}
// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	// Добавление классов слайдера
	// при необходимости отключить
	bildSliders();

	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initSliders();
	// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});

