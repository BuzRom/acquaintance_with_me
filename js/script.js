'use strict'


//mobile or pc
const isMobile = {
   Android: () => {
      return navigator.userAgent.match(/Android/i);
   },
   BlackBerry: () => {
      return navigator.userAgent.match(/BlackBerry/i);
   },
   iOS: () => {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
   },
   Opera: () => {
      return navigator.userAgent.match(/Opera Mini/i);
   },
   Windows: () => {
      return navigator.userAgent.match(/IEMobile/i);
   },
   any: () => {
      return (
         isMobile.Android() ||
         isMobile.BlackBerry() ||
         isMobile.iOS() ||
         isMobile.Opera() ||
         isMobile.Windows()
      );
   }
};
if (isMobile.any()) {
   document.body.classList.add('_touch');
}
else {
   document.body.classList.add('_pc');
};

//menu burger
const btnMenu = document.querySelector('.btn_menu');
const menuBody = document.querySelector('.menu__body');
if (btnMenu) {
   btnMenu.addEventListener('click', function (e) {
      document.body.classList.toggle('_lock');
      menuBody.classList.toggle('_active');
      btnMenu.classList.toggle('_active');
   });
}


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
};

//language
const btnUa = document.querySelector('.lng-btn-ua');
const btnEng = document.querySelector('.lng-btn-eng');
const btnUaMob = document.querySelector('.lng-btn-mob-ua');
const btnEngMob = document.querySelector('.lng-btn-mob-eng');

if (btnUa) {
   btnUa.addEventListener('click', function () {
      location.href = window.location.pathname + '#ua';
      location.reload();
   });
};
if (btnEng) {
   btnEng.addEventListener('click', function () {
      location.href = window.location.pathname + '#eng';
      location.reload();
   });
};

if (btnUaMob) {
   btnUaMob.addEventListener('click', function () {
      location.href = window.location.pathname + '#ua';
      location.reload();
   });
};
if (btnEngMob) {
   btnEngMob.addEventListener('click', function () {
      location.href = window.location.pathname + '#eng';
      location.reload();
   });
};

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

//slider
new Swiper('.image-slider', {
   navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
   },
   pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
      renderBullet: function (index, className) {
         return '<span class="' + className + '">' + (index + 1) + '</span>';
      },
   },
   scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
   },
   autoHeight: true,
   spaceBetween: 30,
   loop: true,
   slidesPerView: 1,
   breakpoints: {
      650: {
         slidesPerView: 2,
      },
      900: {
         slidesPerView: 3,
      },
   },
});
