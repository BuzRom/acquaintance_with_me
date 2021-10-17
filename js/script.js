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
   spaceBetween: 90,
   slidesPerGroup: 2,
   slidesPerView: 1,
   breakpoints: {
      450: {
         slidesPerView: 2,
      },
      750: {
         slidesPerView: 3,
      },
      950: {
         slidesPerView: 4,
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
   pagination: {
      el: '.swiper-pagination',
      clickable: true,
      // renderBullet: function (index, className) {
      //    return '<span class="' + className + '">' + (index + 1) + '</span>';
      // },
   },
   // scrollbar: {
   //    el: '.swiper-scrollbar',
   //    draggable: true,
   // },
   loop: true,
   autoHeight: true,
   spaceBetween: 30,
   slidesPerView: 1,
   breakpoints: {
      650: {
         slidesPerView: 2,
      },
      900: {
         slidesPerView: 3,
      },
   },
   slideToClickedSlide: false,
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
