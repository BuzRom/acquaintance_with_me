'use strict'

//mobile or pc
// const isMobile = {
//    Android: () => {
//       return navigator.userAgent.match(/Android/i);
//    },
//    BlackBerry: () => {
//       return navigator.userAgent.match(/BlackBerry/i);
//    },
//    iOS: () => {
//       return navigator.userAgent.match(/iPhone|iPad|iPod/i);
//    },
//    Opera: () => {
//       return navigator.userAgent.match(/Opera Mini/i);
//    },
//    Windows: () => {
//       return navigator.userAgent.match(/IEMobile/i);
//    },
//    any: () => {
//       return (
//          isMobile.Android() ||
//          isMobile.BlackBerry() ||
//          isMobile.iOS() ||
//          isMobile.Opera() ||
//          isMobile.Windows()
//       );
//    }
// };
// if (isMobile.any()) {
//    document.body.classList.add('_touch');
// }
// else {
//    document.body.classList.add('_pc');
// };


//cursor
let clientX = -100;
let clientY = -100;
const innerCursor = document.querySelector(".cursor--small");

const initCursor = () => {
   document.addEventListener("mousemove", e => {
      clientX = e.clientX;
      clientY = e.clientY;
   });

   const render = () => {
      innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
      requestAnimationFrame(render);
   };
   requestAnimationFrame(render);
};
initCursor();

let lastX = 0;
let lastY = 0;
let isStuck = false;
let showCursor = false;
let group, stuckX, stuckY, fillOuterCursor;

const initCanvas = () => {
   const canvas = document.querySelector(".cursor--canvas");
   const shapeBounds = {
      width: 75,
      height: 75
   };
   paper.setup(canvas);
   const strokeColor = "transparent";
   const strokeWidth = 2;
   const segments = 8;
   const radius = 25;

   const noiseScale = 150; // speed
   const noiseRange = 4; // range of distortion
   let isNoisy = false; // state

   const polygon = new paper.Path.RegularPolygon(
      new paper.Point(0, 0),
      segments,
      radius
   );
   polygon.strokeColor = strokeColor;
   polygon.strokeWidth = strokeWidth;
   polygon.smooth();
   group = new paper.Group([polygon]);
   group.applyMatrix = false;

   const noiseObjects = polygon.segments.map(() => new SimplexNoise());
   let bigCoordinates = [];

   const lerp = (a, b, n) => {
      return (1 - n) * a + n * b;
   };

   const map = (value, in_min, in_max, out_min, out_max) => {
      return (
         ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
      );
   };

   paper.view.onFrame = event => {
      lastX = lerp(lastX, clientX, 0.2);
      lastY = lerp(lastY, clientY, 0.2);
      group.position = new paper.Point(lastX, lastY);
   }
   paper.view.onFrame = event => {
      if (!isStuck) {
         lastX = lerp(lastX, clientX, 0.2);
         lastY = lerp(lastY, clientY, 0.2);
         group.position = new paper.Point(lastX, lastY);
      } else if (isStuck) {
         lastX = lerp(lastX, stuckX, 0.2);
         lastY = lerp(lastY, stuckY, 0.2);
         group.position = new paper.Point(lastX, lastY);
      }

      if (isStuck && polygon.bounds.width < shapeBounds.width) {
         polygon.scale(1.08);
      } else if (!isStuck && polygon.bounds.width > 50) {
         if (isNoisy) {
            polygon.segments.forEach((segment, i) => {
               segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1]);
            });
            isNoisy = false;
            bigCoordinates = [];
         }
         const scaleDown = 0.92;
         polygon.scale(scaleDown);
      }

      if (isStuck && polygon.bounds.width >= shapeBounds.width) {
         isNoisy = true;
         if (bigCoordinates.length === 0) {
            polygon.segments.forEach((segment, i) => {
               bigCoordinates[i] = [segment.point.x, segment.point.y];
            });
         }

         polygon.segments.forEach((segment, i) => {
            const noiseX = noiseObjects[i].noise2D(event.count / noiseScale, 0);
            const noiseY = noiseObjects[i].noise2D(event.count / noiseScale, 1);
            const distortionX = map(noiseX, -1, 1, -noiseRange, noiseRange);
            const distortionY = map(noiseY, -1, 1, -noiseRange, noiseRange);
            const newX = bigCoordinates[i][0] + distortionX;
            const newY = bigCoordinates[i][1] + distortionY;
            segment.point.set(newX, newY);
         });
      }
      if (fillOuterCursor && polygon.fillColor !== strokeColor) {
         polygon.fillColor = strokeColor;
         polygon.strokeColor = "transparent";
      } else if (!fillOuterCursor && polygon.fillColor !== "transparent") {
         polygon.strokeColor = "rgba(255, 255, 255, 0.5)";
         polygon.fillColor = "transparent";
      }
      polygon.smooth();
   };
}
initCanvas();

const initHovers = () => {
   const handleMouseEnter = e => {
      const navItem = e.currentTarget;
      const navItemBox = navItem.getBoundingClientRect();
      stuckX = Math.round(navItemBox.left + navItemBox.width / 2);
      stuckY = Math.round(navItemBox.top + navItemBox.height / 2);
      isStuck = true;
   };

   const handleMouseLeave = () => {
      isStuck = false;
   };

   const linkHeader = document.querySelectorAll(".header__item");
   linkHeader.forEach(item => {
      item.addEventListener("mouseenter", handleMouseEnter);
      item.addEventListener("mouseleave", handleMouseLeave);
   });

   const mainNavItemMouseEnter = () => {
      fillOuterCursor = true;
      innerCursor.style.transition = 0.5;
      innerCursor.style.opacity = 0;
   };
   const mainNavItemMouseLeave = () => {
      fillOuterCursor = false;
      innerCursor.style.transition = 0.5;
      innerCursor.style.opacity = 1;
   };

   const demoLink = document.querySelectorAll(".demo-link");
   demoLink.forEach(item => {
      item.addEventListener("mouseenter", mainNavItemMouseEnter);
      item.addEventListener("mouseleave", mainNavItemMouseLeave);
   });

   const heroText = document.querySelectorAll(".hero__text");
   heroText.forEach(item => {
      item.addEventListener("mouseenter", mainNavItemMouseEnter);
      item.addEventListener("mouseleave", mainNavItemMouseLeave);
   });

   const linkFooter = document.querySelectorAll(".footer__icon");
   linkFooter.forEach(item => {
      item.addEventListener("mouseenter", mainNavItemMouseEnter);
      item.addEventListener("mouseleave", mainNavItemMouseLeave);
   });

   const textareaBorder = document.querySelector(".textarea-border");
   textareaBorder.addEventListener("mouseenter", mainNavItemMouseEnter);
   textareaBorder.addEventListener("mouseleave", mainNavItemMouseLeave);

   const footerButton = document.querySelector(".footer__button");
   footerButton.addEventListener("mouseenter", mainNavItemMouseEnter);
   footerButton.addEventListener("mouseleave", mainNavItemMouseLeave);
};
initHovers();



//menu burger
const btnMenu = document.querySelector('.btn_menu');
const menuBody = document.querySelector('.menu__body');
if (btnMenu) {
   btnMenu.addEventListener('click', () => {
      document.body.classList.toggle('_lock');
      menuBody.classList.toggle('_active');
      btnMenu.classList.toggle('_active');
   });
};


//scroll onclick
const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
   menuLinks.forEach(menuLink => {
      menuLink.addEventListener("click", onMenuLinkClick);
   });
   function onMenuLinkClick(e) {
      const menuLink = e.target;
      if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
         const gotoBlock = document.querySelector(menuLink.dataset.goto);
         const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;
         if (btnMenu.classList.contains('_active')) {
            document.body.classList.remove('_lock');
            menuBody.classList.remove('_active');
            btnMenu.classList.remove('_active');
         }
         window.scrollTo({
            top: gotoBlockValue,
            behavior: 'smooth'
         });
         e.preventDefault();
      }
   }
   const sections = document.querySelectorAll('section');

   onscroll = function () {
      let scrollPosition = document.documentElement.scrollTop;

      sections.forEach((section) => {
         if (scrollPosition >= section.offsetTop - section.offsetHeight * 0.25 &&
            scrollPosition < section.offsetTop + section.offsetHeight - section.offsetHeight * 0.25) {
            const currentId = section.attributes.id.value;
            menuLinks.forEach(menuLink => {
               menuLink.classList.remove('nav_activ');
            });
            addActiveClass(currentId);
         }
      });
   }
};
function addActiveClass(id) {
   let selector = `a[data-goto=".${id}__nav"]`;
   document.querySelector(selector).classList.add('nav_activ');
}


//language
const btnUa = document.querySelectorAll('.lng-btn-ua');
const btnEng = document.querySelectorAll('.lng-btn-eng');

function lngDefault() {
   let hash = window.location.hash;
   if (hash === '#eng') {
      btnUa.forEach(a => a.classList.remove('lng_activ'));
      btnEng.forEach(a => a.classList.add('lng_activ'));
   }
   else if (hash === '#ua') {
      btnEng.forEach(a => a.classList.remove('lng_activ'));
      btnUa.forEach(a => a.classList.add('lng_activ'));
   }
   else {
      location.href = window.location.pathname + '#eng';
   }
}
lngDefault();

btnUa.forEach(a => a.addEventListener('click', () => {
   location.href = window.location.pathname + '#ua';
   location.reload();
}));

btnEng.forEach(a => a.addEventListener('click', () => {
   location.href = window.location.pathname + '#eng';
   location.reload();
}));

function changeLanguage() {
   let hash = window.location.hash;
   hash = hash.substr(1);
   for (let key in lngArr) {
      let elem = document.querySelector('.lng-' + key);
      if (elem) {
         elem.innerHTML = lngArr[key][hash];
      }
   }
}
changeLanguage();


//slider Swiper
const swiper1 = new Swiper('.swiper-skills', {
   pagination: {
      el: ".swiper-pagination",
      clickable: true,
   },
   breakpoints: {
      200: {
         spaceBetween: 150,
         slidesPerView: 1,
         slidesPerGroup: 1,
      },
      400: {
         spaceBetween: 220,
         slidesPerView: 1,
         slidesPerGroup: 1,
      },
      750: {
         spaceBetween: 130,
         slidesPerView: 2,
         slidesPerGroup: 1,
      },
      800: {
         spaceBetween: 130,
         slidesPerView: 2,
         slidesPerGroup: 1,
      },
      850: {
         slidesPerView: 2,
         spaceBetween: 170,
         slidesPerGroup: 1,
      },
      950: {
         slidesPerView: 2,
         spaceBetween: 240,
         slidesPerGroup: 1,
      },
      1050: {
         slidesPerView: 3,
         spaceBetween: 90,
         slidesPerGroup: 2,
      },
      1100: {
         slidesPerView: 3,
         spaceBetween: 100,
         slidesPerGroup: 2,
      },
      1150: {
         slidesPerView: 3,
         spaceBetween: 110,
         slidesPerGroup: 2,
      },
      1250: {
         slidesPerView: 3,
         spaceBetween: 140,
         slidesPerGroup: 2,
      },
   },
   scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
   },
   slideToClickedSlide: false,
});

const swiper2 = new Swiper('.swiper-container', {
   // navigation: {
   //    nextEl: '.swiper-button-next',
   //    prevEl: '.swiper-button-prev'
   // },
   autoplay: {
      delay: 4000,
      disableOnInteraction: false,
   },
   pagination: {
      el: '.swiper-pagination',
      clickable: true,
   },
   loop: true,
   autoHeight: true,
   spaceBetween: 30,
   slidesPerView: 1,
});


//message
const form = document.querySelector('.form');

form.addEventListener('submit', e => {
   e.preventDefault();
   const token = '1707669875:AAEYfPGGficX6EpsPQQwCiORtQIg3blh3Ao';
   let url = 'https://api.telegram.org/bot' + token + '/sendMessage?chat_id=504248892&text=';
   let xhttp = new XMLHttpRequest();
   xhttp.open("GET", url + form.message.value, true);
   xhttp.send();
   form.message.value = '';
});


// flash-light
const about = document.documentElement;

about.addEventListener('mousemove', e => {
   about.style.setProperty('--x', e.clientX + 'px')
   about.style.setProperty('--y', e.clientY - 150 + 'px')
})


//hover text
class HoverButton {
   constructor(el) {
      this.el = el;
      this.hover = false;
      this.calculatePosition();
      this.attachEventsListener();
   }

   attachEventsListener() {
      window.addEventListener('mousemove', e => this.onMouseMove(e));
      window.addEventListener('resize', e => this.calculatePosition(e));
   }

   calculatePosition() {
      gsap.set(this.el, {
         x: 0,
         y: 0,
         scale: 1
      });
      const box = this.el.getBoundingClientRect();
      this.x = box.left + (box.width * 0.5);
      this.y = box.top + (box.height * 0.5);
      this.width = box.width;
      this.height = box.height;
   }

   onMouseMove(e) {
      let hover = false;
      let hoverArea = (this.hover ? 0.7 : 0.5);
      let x = e.clientX - this.x;
      let y = e.clientY - this.y;
      let distance = Math.sqrt(x * x + y * y);
      if (distance < (this.width * hoverArea)) {
         hover = true;
         if (!this.hover) {
            this.hover = true;
         }
         this.onHover(e.clientX, e.clientY);
      }

      if (!hover && this.hover) {
         this.onLeave();
         this.hover = false;
      }
   }

   onHover(x, y) {
      gsap.to(this.el, {
         x: (x - this.x) * 0.4,
         y: (y - this.y) * 0.4,
         scale: 1.15,
         ease: 'power2.out',
         duration: 0.4
      });
      this.el.style.zIndex = 10;
   }
   onLeave() {
      gsap.to(this.el, {
         x: 0,
         y: 0,
         scale: 1,
         ease: 'elastic.out(1.2, 0.4)',
         duration: 0.7
      });
      this.el.style.zIndex = 1;
   }
}

window.onresize = function () {
   (window.innerWidth > 812) ? new HoverButton(document.querySelector('.hero__text')) : null
}
window.onresize()