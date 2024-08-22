'use strict';
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click-', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect);

  console.log('Current Scroll (X/Y)', window.pageXOffset, pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // Old School way
  // window.scrollTo({
  //   left:s1coords.left + window.pageXOffset,
  //   top:s1coords.top + window.pageYOffset,
  //   behavior:'smooth'
  // })

  // New Way
  section1.scrollIntoView({ behavior: 'smooth' }); // Modern browsers Support it
});
///////////////////////////////////////
// Page navigation

// This Way not good in Performance
// document.querySelectorAll('.nav__link').forEach(e =>
//   e.addEventListener('click', el => {
//     el.preventDefault();
//     const id = el.target.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' })

//   })
// );

// Better Way For Performance
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  console.log(e.target);

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

////////////////////
// tabs.forEach(t =>////////////////////
//   t.addEventListener('click', () => {   // Not a Good way for performance at all :(
//     console.log('TAB'); ////////////////////
//   })////////////////////
// );////////////////////
////////////////////
// Event Delegation
tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Old Guard clause
  // if(clicked){
  //   clicked.classList.add('operations__tab--active');
  // }

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
///////////////////////////////////////
///////////////////////////////////////
// Menu Fade animation
const handelHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// Old Way
// nav.addEventListener('mouseover', e=> {
//   handelHover(e, 0.5);
// });

// nav.addEventListener('mouseout', function (e) {
//   handelHover(e, 1);
// });

// New Way//
nav.addEventListener('mouseover', handelHover.bind(0.5));
nav.addEventListener('mouseout', handelHover.bind(1));
// New Way//

///////////////////////////////////////
// Sticky navigation
// const intialCoords = section1.getBoundingClientRect();
// console.log(intialCoords);

// window.addEventListener('scroll', () => {
//   console.log(window.scrollY);

//   if (window.scrollY > intialCoords.top) nav.classList.add('sticky')
//     else nav.classList.remove('sticky');
// });
///////////////////////////////////////
///////////////////////////////////////
// Sticky navigation : Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log('=>>', navHeight);

const stickyNav = function (entires) {
  const [entry] = entires;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const StickyObsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-90px`,
};
const headerObserver = new IntersectionObserver(stickyNav, StickyObsOptions);
headerObserver.observe(header);
//////////////////////////
//////////////////////////
// Reveal Sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entires, observer) {
  const [entry] = entires;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // Stops the unNeeded Observation for Better Performance
};
const RevealObsOptions = {
  root: null,
  threshold: 0.15,
};
const sectionObserver = new IntersectionObserver(
  revealSection,
  RevealObsOptions
);

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});
///////////////////////////////////////
// Lazy Loading images
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entires, observer) {
  const [entry] = entires;

  if (!entry.isIntersecting) return;

  // Replace src with data-src

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target); // Stops the unNeeded Observation for Better Performance
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTarget.forEach(img => imgObserver.observe(img));
///////////////////////////////////////
///////////////////////////////////////
// Slider
const slider = () => {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');
  // curSlide = 1; -100% , 0% , 100% , 200%

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  const init = function () {
    goToSlide(0);
    activateDot(0);
  };

  // Functions
  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide ="${i}"></button>`
      );
    });
  };
  createDots(curSlide);
  const activateDot = slide => {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  activateDot(curSlide);
  const goToSlide = slide => {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = () => {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  init();

  const prevSlide = () => {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // Better If condition :)
  });

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////
///////////////////////////////////////
// Creating and inserting elements
// .insertAdjacentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookie for improved functionality and analytics.';
message.innerHTML =
  'We use cookie for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);// will add it into header but will be the first element
// header.append(message.cloneNode(true)); // gonna add a clone of it
header.append(message); // will add it into header but will be the last element
// header.before(message); // will add it before header div
// header.after(message); // will add it after header div

// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove(); // New Way
  // message.parentElement.removeChild(message); // Old Way
});

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '104.1%';
console.log(message.style.height); // will not appear cuz it has no value or has a value but in css classes
console.log(message.style.backgroundColor); // will apear in console cuz it has a inline styling not css styling

console.log(getComputedStyle(message).color); // ComputedStyle means it's the real style and it appears on the page
console.log(getComputedStyle(message).height); // ComputedStyle means it's the real style and it appears on the page

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered'); // it's for changing variables colors inside root element is css

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.className);
console.log(logo.alt);

logo.alt = 'Beautiful minimalist logo';
console.log(logo.alt);
// Non-standerd
console.log(logo.designer); // not gonna work === undefined
console.log(logo.getAttribute('desinger'));
logo.setAttribute('company', 'Bankist');
console.log(logo.src); // will give you the absolute version (http://127.0.0.1:5500/img/logo.png)
console.log(logo.getAttribute('src')); // will give you the reletive version (img/logo.png)

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // will console (http://127.0.0.1:5500/index.html#)
console.log(link.getAttribute('href')); // will console (#)

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes
// Don't use this cuz it will overite all elements
// logo.className = 'yosef';

// const h1 = document.querySelector('h1');

// const alertsH1 = e => {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

// h1.addEventListener('mouseenter', alertsH1);
// setTimeout(() => h1.removeEventListener('mouseenter', alertsH1), 3000);

// h1.onmouseenter = (e) => {
//   alert('onmouseenter: Great! You are reading the heading :D')
// }
 