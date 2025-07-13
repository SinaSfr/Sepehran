document.addEventListener('DOMContentLoaded', function () {
  const isDesktop = window.innerWidth > 1024;
  const requiredFiles = isDesktop ? ['gardeshgaran.ui.min.css'] : ['gardeshgaran-mob.ui.min.css'];

  function checkAllResourcesLoaded() {
    const resources = performance.getEntriesByType('resource');
    const loadedFiles = resources
      .map((res) => res.name.split('/').pop())
      .filter((name) => requiredFiles.includes(name));

    return requiredFiles.every((file) => loadedFiles.includes(file));
  }

  if (document.getElementById('search-box')) {
    function fetchEngine() {
      try {
        const xhrobj = new XMLHttpRequest();
        xhrobj.open('GET', 'search-engine.bc');
        xhrobj.send();

        xhrobj.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            const container = document.getElementById('search-box');
            container.innerHTML = xhrobj.responseText;

            ['.Basis_Date.end_date', '.Basis_Date.start_date'].forEach((selector) => {
              const dateInputs = document.querySelectorAll(selector);
              dateInputs.forEach((input) => {
                input.placeholder = '';
              });
            });
            const scripts = container.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
              const scriptTag = document.createElement('script');
              if (scripts[i].src) {
                scriptTag.src = scripts[i].src;
                scriptTag.async = false;
              } else {
                scriptTag.text = scripts[i].textContent;
              }
              document.head.appendChild(scriptTag).parentNode.removeChild(scriptTag);
            }

            //active flighttype-items search-engine
            const items = document.querySelectorAll('.flighttype-items li');

            if (items.length > 0) {
              items[0].classList.add('active');

              items.forEach((item) => {
                item.addEventListener('click', () => {
                  items.forEach((li) => li.classList.remove('active'));
                  item.classList.add('active');
                });
              });
            }

            // rotate chevron-icon
            const selectors = [
              '.click-content',
              '.reserve-field.departure-date > div:first-child',
              '.reserve-field.return-date > div:first-child',
            ];

            let allElements = [];

            selectors.forEach((selector) => {
              const elements = document.querySelectorAll(selector);
              if (elements.length > 0) {
                elements.forEach((element) => {
                  allElements.push(element);

                  element.addEventListener('click', function (e) {
                    e.stopPropagation();

                    // اول حذف rotate از همه
                    allElements.forEach((el) => el.classList.remove('rotate'));

                    // بعد اضافه کردن به همینی که کلیک شده
                    this.classList.add('rotate');
                  });
                });
              }
            });

            document.addEventListener('click', function (e) {
              const isInsideTarget = allElements.some((el) => el.contains(e.target));
              const isInsideCalendar = e.target.closest('.Basis_Calendar_Box') !== null;

              if (!isInsideTarget && !isInsideCalendar) {
                allElements.forEach((el) => el.classList.remove('rotate'));
              }
            });

            const inputExteraHoteldate = document.querySelectorAll('.Basis_Date_ExteraHoteldate');
            if (inputExteraHoteldate.length > 0) {
              inputExteraHoteldate.forEach((input) => {
                input.placeholder = '';
              });
            }
          }
        };
      } catch (error) {
        console.error('مشکلی پیش آمده است. لطفا صبور باشید', error);
      }
    }

    function waitForFiles() {
      if (checkAllResourcesLoaded()) {
        fetchEngine();
      } else {
        setTimeout(waitForFiles, 500);
      }
    }
    waitForFiles();
  }
});

const headerMenu = document.querySelector('.header-menu');
const headerMenuClose = document.querySelector('.header-menu-close');
const bars3 = document.querySelector('.bars3');

if (window.innerWidth < 1024) {
  if (headerMenu && headerMenuClose && bars3) {
    headerMenuClose.addEventListener('click', function () {
      headerMenu.style.transform = 'translateX(1024px)';
      document.body.classList.remove('overflow-hidden');
    });

    bars3.addEventListener('click', function () {
      headerMenu.style.transform = 'translateX(0)';
      document.body.classList.add('overflow-hidden');
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const toggleDropdowns = document.querySelectorAll('.toggle-dropdown');
  const dropdownIcons = document.querySelectorAll('.dropdown-icon');

  toggleDropdowns.forEach((toggle, index) => {
    const submenu = toggle.nextElementSibling;
    const dropdownIcon = dropdownIcons[index];

    toggle.addEventListener('click', function () {
      dropdownIcon.classList.toggle('rotate-180');

      if (submenu.style.maxHeight) {
        submenu.style.maxHeight = null;
        submenu.style.opacity = '0';
      } else {
        submenu.style.maxHeight = submenu.scrollHeight * 30 + 'px';
        submenu.style.opacity = '1';
      }
    });
  });
});

// fetch header
document.addEventListener('DOMContentLoaded', function () {
  const fetchContentHeader = document.querySelector('.fetch-content-header');
  const headerLi = document.querySelectorAll('.header-li');

  function activateDropdownToggles() {
    const toggleDropdowns = document.querySelectorAll('.toggle-dropdown');
    toggleDropdowns.forEach((toggle) => {
      const submenu = toggle.nextElementSibling;
      const dropdownIcon = toggle.querySelector('.dropdown-icon');

      submenu.style.maxHeight = null;
      submenu.style.opacity = '0';

      toggle.addEventListener('click', () => {
        dropdownIcon.classList.toggle('rotate-180');

        if (submenu.style.maxHeight) {
          submenu.style.maxHeight = null;
          submenu.style.opacity = '0';
        } else {
          submenu.style.maxHeight = submenu.scrollHeight * 30 + 'px';
          submenu.style.opacity = '1';
        }
      });
    });
  }

  activateDropdownToggles();

  if (fetchContentHeader) {
    async function loadInitialContent() {
      const firstItem = document.querySelector('.header-li');
      if (!firstItem) return;

      const cmsQuery = firstItem.getAttribute('data-catid');
      if (!cmsQuery) return;

      try {
        const response = await fetch(`/header-load-items.bc?catid=${cmsQuery}`);
        const data = await response.text();
        fetchContentHeader.innerHTML = data;

        document.querySelectorAll('.header-li').forEach((li) => {
          li.style.backgroundColor = '';
          li.style.color = '';
        });
        firstItem.style.color = '#14eba4';
        firstItem.style.backgroundColor = '#2e58d1';

        const details = document.querySelector('.tourcategorydropdown__details');
        if (details) {
          const label = details.querySelector('.tourcategorydropdown__label');
          if (label) {
            label.textContent = firstItem.textContent.trim();
          }

          details.classList.remove('hidden');
          details.classList.remove('opacity-100');
          details.classList.add('opacity-0', 'transition-opacity', 'duration-300');

          setTimeout(() => {
            details.classList.remove('opacity-0');
            details.classList.add('opacity-100');
          }, 10);
        }

        activateDropdownToggles();
      } catch (err) {
        fetchContentHeader.innerHTML = '<p>مشکلی در دریافت اطلاعات رخ داد: ' + err.message + '</p>';
      }
    }

    loadInitialContent();

    headerLi.forEach((item) => {
      item.addEventListener('click', async function () {
        headerLi.forEach((li) => {
          li.style.backgroundColor = '';
          li.style.color = '';
        });

        item.style.color = '#14eba4';
        item.style.backgroundColor = '#2e58d1';

        const cmsQuery = item.getAttribute('data-catid');
        if (!cmsQuery) return;

        const requestUrl = `/header-load-items.bc?catid=${cmsQuery}`;

        try {
          fetchContentHeader.innerHTML =
            '<div class="flex justify-center mt-6"><span class="header-loader"></span></div>';
          const response = await fetch(requestUrl);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.text();
          fetchContentHeader.innerHTML = data;

          activateDropdownToggles();

          const details = document.querySelector('.tourcategorydropdown__details');
          if (details) {
            const label = details.querySelector('.tourcategorydropdown__label');
            if (label) {
              label.textContent = item.textContent.trim();
            }

            details.classList.remove('hidden');
            details.classList.remove('opacity-100');
            details.classList.add('opacity-0', 'transition-opacity', 'duration-300');

            setTimeout(() => {
              details.classList.remove('opacity-0');
              details.classList.add('opacity-100');
            }, 10);
          }
        } catch (error) {
          console.error('Fetch failed:', error);
          fetchContentHeader.innerHTML = '<p>مشکلی در دریافت اطلاعات رخ داد: ' + error.message + '</p>';
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('.tourcategorydropdown__trigger');
  const content = document.querySelector('.tourcategorydropdown__content');
  const icon = document.querySelector('.tourcategorydropdown__icon');

  if (trigger && content && icon) {
    trigger.addEventListener('click', () => {
      const isHidden = content.classList.contains('hidden');

      if (isHidden) {
        content.classList.remove('hidden', 'opacity-0');
        content.classList.add('flex', 'opacity-100');
        icon.classList.add('rotate-180');
      } else {
        content.classList.add('opacity-0');
        content.classList.remove('opacity-100');
        icon.classList.remove('rotate-180');

        setTimeout(() => {
          content.classList.remove('flex');
          content.classList.add('hidden');
        }, 300);
      }
    });
  }

  setTimeout(() => {
    document.querySelectorAll('.special-tour-label').forEach((labelEl) => {
      const catId = parseInt(labelEl.getAttribute('data-special-catid')?.replace(/[^\d]/g, ''), 10);
      let matched = false;

      document.querySelectorAll('.special-tour-host').forEach((hostEl) => {
        const data = hostEl.getAttribute('data-special');
        if (!data) return;

        const ids = data.split(',').map((id) => parseInt(id.replace(/[^\d]/g, ''), 10));

        if (ids.includes(catId)) {
          matched = true;
        }
      });

      if (matched) {
        labelEl.classList.remove('hidden');
      }
    });
  }, 1000);

  const details = document.getElementById('details');
  document.querySelectorAll('.tourcategorydropdown__item').forEach((item) => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.tourcategorydropdown__item').forEach((li) => {
        li.classList.remove('bg-primary-500', 'text-secondary-500', 'mr-2', 'transition-all', 'duration-300');
      });

      item.classList.add('bg-primary-500', 'text-secondary-500', 'mr-2', 'transition-all', 'duration-300');

      if (details && details.classList.contains('hidden')) {
        details.classList.remove('hidden');
        details.classList.add('opacity-0', 'transition-opacity', 'duration-300');

        setTimeout(() => {
          details.classList.remove('opacity-0');
          details.classList.add('opacity-100');
        }, 10);
      }
    });
  });

  const openMobileBtn = document.getElementById('openTourMobile');
  const mobileOverlay = document.querySelector('.tourcategorymobile__overlay');
  const closeMobileBtn = document.getElementById('closeTourMobile');

  if (openMobileBtn && mobileOverlay && closeMobileBtn) {
    openMobileBtn.addEventListener('click', () => {
      mobileOverlay.classList.remove('hidden', 'opacity-0');
      mobileOverlay.classList.add('opacity-100');
      document.body.classList.add('overflow-hidden');
    });

    closeMobileBtn.addEventListener('click', () => {
      mobileOverlay.classList.remove('opacity-100');
      mobileOverlay.classList.add('opacity-0');
      document.body.classList.remove('overflow-hidden');

      setTimeout(() => {
        mobileOverlay.classList.add('hidden');
      }, 300);
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.search-form');
  if (!form) return;

  const input = form.querySelector('.search-input');
  const button = form.querySelector('.search-toggle');
  if (!input || !button) return;

  let expanded = false;

  function openForm() {
    form.classList.add('w-48');
    form.classList.remove('w-10');

    input.classList.add('w-full', 'pr-3');
    input.classList.remove('w-0', 'pr-0');

    expanded = true;
    input.focus();
  }

  function closeForm() {
    form.classList.remove('w-48');
    form.classList.add('w-10');

    input.classList.remove('w-full', 'pr-3');
    input.classList.add('w-0', 'pr-0');

    expanded = false;
  }

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!expanded) {
      openForm();
    } else if (!input.value.trim()) {
      input.focus();
    } else {
      form.submit();
    }
  });

  document.addEventListener('click', (e) => {
    if (expanded && !form.contains(e.target)) {
      closeForm();
    }
  });

  form.addEventListener('submit', (e) => {
    if (!input.value.trim()) {
      e.preventDefault();
      input.focus();
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.tour-category-header');
  const menu = document.querySelector('.menu-tour-category');
  const icon = document.querySelector('.drop-down-tour-category');

  if (!toggleBtn || !menu || !icon) return;

  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('opacity-0');
    menu.classList.toggle('scale-95');
    menu.classList.toggle('pointer-events-none');
    icon.classList.toggle('rotate-180');
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('opacity-0');
      menu.classList.add('scale-95');
      menu.classList.add('pointer-events-none');
      icon.classList.remove('rotate-180');
    }
  });
});

// fetch personel
document.addEventListener('DOMContentLoaded', function () {
  const fetchContentPersonel = document.querySelector('.fetch-content-personel');
  const personelLi = document.querySelectorAll('.personel-li');

  if (fetchContentPersonel) {
    async function loadInitialContent() {
      const firstItem = document.querySelector('.personel-li');
      if (!firstItem) return;

      const personelId = firstItem.getAttribute('data-personel');
      if (!personelId) return;

      try {
        const response = await fetch(`/personel-load-items.bc?catid=${personelId}`);
        const data = await response.text();
        fetchContentPersonel.innerHTML = data;

        document.querySelectorAll('.personel-li').forEach((li) => {
          li.style.backgroundColor = '';
        });
        firstItem.style.backgroundColor = '#2e58d1';
      } catch (err) {
        fetchContentPersonel.innerHTML = '<p>مشکلی در دریافت اطلاعات رخ داد: ' + err.message + '</p>';
      }
    }

    loadInitialContent();

    personelLi.forEach((item) => {
      item.addEventListener('click', async function () {
        personelLi.forEach((li) => {
          li.style.backgroundColor = '';
          li.style.color = '';
        });

        item.style.backgroundColor = '#2e58d1';

        const personelId = item.getAttribute('data-personel');
        if (!personelId) return;

        const requestUrl = `/personel-load-items.bc?catid=${personelId}`;

        try {
          fetchContentPersonel.innerHTML =
            '<div class="flex justify-center mt-16"><span class="header-loader"></span></div>';
          const response = await fetch(requestUrl);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.text();
          fetchContentPersonel.innerHTML = data;
        } catch (error) {
          console.error('Fetch failed:', error);
          fetchContentPersonel.innerHTML = '<p>مشکلی در دریافت اطلاعات رخ داد: ' + error.message + '</p>';
        }
      });
    });
  }
});

// fetch tour-date
document.addEventListener('DOMContentLoaded', function () {
  const fetchContentPersonel = document.querySelector('.fetch-content-personel');
  const personelLi = document.querySelectorAll('.date-li');

  if (fetchContentPersonel) {
    async function loadInitialContent() {
      const firstItem = document.querySelector('.date-li');
      if (!firstItem) return;

      const personelId = firstItem.getAttribute('data-personel');
      if (!personelId) return;

      try {
        const response = await fetch(`/personel-load-items.bc?catid=${personelId}`);
        const data = await response.text();
        fetchContentPersonel.innerHTML = data;

        document.querySelectorAll('.date-li').forEach((li) => {
          li.style.backgroundColor = '';
        });
        firstItem.style.backgroundColor = '#2e58d1';
      } catch (err) {
        fetchContentPersonel.innerHTML = '<p>مشکلی در دریافت اطلاعات رخ داد: ' + err.message + '</p>';
      }
    }

    loadInitialContent();

    personelLi.forEach((item) => {
      item.addEventListener('click', async function () {
        personelLi.forEach((li) => {
          li.style.backgroundColor = '';
          li.style.color = '';
        });

        item.style.backgroundColor = '#2e58d1';

        const personelId = item.getAttribute('data-personel');
        if (!personelId) return;

        const requestUrl = `/date-load-items.bc?catid=${personelId}`;

        try {
          fetchContentPersonel.innerHTML =
            '<div class="flex justify-center mt-16"><span class="header-loader"></span></div>';
          const response = await fetch(requestUrl);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.text();
          fetchContentPersonel.innerHTML = data;
        } catch (error) {
          console.error('Fetch failed:', error);
          fetchContentPersonel.innerHTML = '<p>مشکلی در دریافت اطلاعات رخ داد: ' + error.message + '</p>';
        }
      });
    });
  }
});

// filter tour-destintion with (,)
document.addEventListener('DOMContentLoaded', function () {
  const textElements = document.querySelectorAll('.tour-destination');

  function createIcon(href, classes) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '73');
    svg.setAttribute('height', '4');
    svg.setAttribute('class', classes);

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
    svg.appendChild(use);

    return svg;
  }

  textElements.forEach((textElement) => {
    const text = textElement.textContent.trim();

    if (!text) {
      textElement.remove();
      return;
    }

    const destinations = text.split(',').map((dest) => dest.trim());
    const parent = textElement.parentElement;
    const icons = parent.querySelectorAll('svg');

    icons.forEach((icon) => {
      icon.classList.add('hidden', 'invisible', 'opacity-0');
      icon.classList.remove('group-hover:visible', 'group-hover:opacity-100', 'group-hover:block');
    });

    const destContainer = document.createElement('div');
    destContainer.className = 'flex items-center justify-center gap-6 mb-4';

    destinations.forEach((dest, index) => {
      const h3 = document.createElement('h3');
      h3.className = 'text-2xl font-black text-primary-500 transition-all duration-300 group-hover:text-white';
      h3.textContent = dest;
      destContainer.appendChild(h3);

      if (index < destinations.length - 1 && destinations.length > 1) {
        const blueIcon = createIcon(
          './images/sprite-icons.svg#icon-blue-border',
          'transition-all duration-300 group-hover:hidden group-hover:invisible group-hover:opacity-0'
        );

        const whiteIcon = createIcon(
          './images/sprite-icons.svg#icon-white-border',
          'hidden transition-all duration-300 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:block'
        );

        destContainer.appendChild(blueIcon);
        destContainer.appendChild(whiteIcon);
      }
    });

    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    parent.appendChild(destContainer);
  });
});

// success message form
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.pov-form');
  if (!form) return;

  const messageBox = form.querySelector('.Message-Form');
  if (!messageBox) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch('/Tem1_OpinionAction.bc', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.text())
      .then((html) => {
        if (html.includes('نظر شما با موفقیت ثبت شد')) {
          messageBox.textContent = 'نظر شما با موفقیت ثبت شد، پس از بررسی توسط مدیر سایت نمایش داده خواهد شد.';
          messageBox.classList.add('text-secondary-500', 'font-bold');
          form.reset();
        } else {
          messageBox.textContent = 'خطایی در ارسال نظر رخ داده است.';
          messageBox.classList.add('text-red-600', 'font-bold');
        }

        setTimeout(() => {
          messageBox.textContent = '';
          messageBox.classList.remove('text-green-600', 'text-red-600', 'font-bold');
        }, 4000);
      })
      .catch(() => {
        messageBox.textContent = 'ارسال ناموفق بود. لطفاً دوباره تلاش کنید.';
        messageBox.classList.add('text-red-600', 'font-bold');

        setTimeout(() => {
          messageBox.textContent = '';
          messageBox.classList.remove('text-red-600', 'font-bold');
        }, 5000);
      });
  });
});

// see-more footer
document.addEventListener('DOMContentLoaded', function () {
  const content = document.querySelector('.content-inner');
  const button = document.querySelector('.see-more-footer');
  let expanded = false;

  content.style.height = '140px';
  content.style.overflow = 'hidden';
  content.style.transition = 'height 0.5s ease';

  button.addEventListener('click', function () {
    if (!expanded) {
      content.style.height = content.scrollHeight + 'px';
      button.textContent = 'نمایش کمتر';
    } else {
      content.style.height = '140px';
      button.textContent = 'مشاهده بیشتر';
    }
    expanded = !expanded;
  });
});

// see-more-airline-items
document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.checkboxList');
  const toggleBtn = document.querySelector('.toggle-btn');
  const items = container ? Array.from(container.querySelectorAll('.airline-item')) : [];
  const visibleCount = 3;

  if (toggleBtn && items.length <= visibleCount) {
    toggleBtn.classList.add('hidden');
  }

  function hideItems() {
    items.forEach((item, index) => {
      if (index >= visibleCount) {
        item.classList.add('hidden', 'opacity-0', 'max-h-0', 'overflow-hidden');
      } else {
        item.classList.remove('hidden', 'opacity-0', 'max-h-0', 'overflow-hidden');
      }
    });
  }

  function showItems() {
    items.forEach((item, index) => {
      if (index >= visibleCount) {
        item.classList.remove('hidden', 'max-h-0', 'overflow-hidden');
        setTimeout(() => item.classList.remove('opacity-0'), 10);
      }
    });
  }

  function toggleItems() {
    if (items.length > visibleCount && items[visibleCount].classList.contains('hidden')) {
      showItems();
      toggleBtn.textContent = 'مشاهده کمتر';
    } else {
      items.forEach((item, index) => {
        if (index >= visibleCount) {
          item.classList.add('opacity-0');
        }
      });

      setTimeout(() => {
        items.forEach((item, index) => {
          if (index >= visibleCount) {
            item.classList.add('hidden', 'max-h-0', 'overflow-hidden');
          }
        });
      }, 500);
      toggleBtn.textContent = 'مشاهده بیشتر';
    }
  }

  if (items.length > 0) {
    hideItems();
  }

  if (toggleBtn && items.length > visibleCount) {
    toggleBtn.addEventListener('click', toggleItems);
  }
});

// open filter-tour-list-mobile and open-filter-hotel
document.addEventListener('DOMContentLoaded', () => {
  function setupFilterMenu(buttonId, menuId, closeId) {
    const btn = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);
    const closeBtn = document.getElementById(closeId);

    if (btn && menu && closeBtn) {
      btn.addEventListener('click', () => {
        menu.classList.remove('translate-y-full');
        document.body.classList.add('overflow-hidden');
      });

      closeBtn.addEventListener('click', () => {
        menu.classList.add('translate-y-full');
        document.body.classList.remove('overflow-hidden');
      });
    }
  }

  setupFilterMenu('filterBtn', 'filterMenu', 'filterMenuClose');
  setupFilterMenu('filterBtnHotel', 'filterMenuHotel', 'filterMenuCloseHotel');
});

// tour-date-btn
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.tourL-tour-date-btn').forEach((btn) => {
    const container = btn.closest('.tourL-tour-card');
    const menu = container?.querySelector('.tourL-tour-date-menu');
    if (!menu) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isShown = menu.classList.contains('opacity-100');
      closeAllTourMenus();
      if (!isShown) {
        menu.classList.remove('opacity-0', 'invisible', 'scale-95');
        menu.classList.add('opacity-100', 'visible', 'scale-100');
      }
    });

    menu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });

  document.addEventListener('click', function (e) {
    const isInsideMenu = e.target.closest('.tourL-tour-date-menu');
    const isButton = e.target.closest('.tourL-tour-date-btn');
    if (!isInsideMenu && !isButton) {
      closeAllTourMenus();
    }
  });

  function closeAllTourMenus() {
    document.querySelectorAll('.tourL-tour-date-menu').forEach((menu) => {
      menu.classList.remove('opacity-100', 'visible', 'scale-100');
      menu.classList.add('opacity-0', 'invisible', 'scale-95');
    });
  }
});

// tour-list date
const toggleTourDateMenu = (button, tourId) => {
  const dateMenu = button.closest('.tourL-tour-card').querySelector('.tourL-tour-date-menu');
  const swiperWrapper = dateMenu.querySelector('.swiper-tour-date-tourL .swiper-wrapper');

  document.querySelectorAll('.tourL-tour-date-menu').forEach((menu) => {
    if (menu !== dateMenu) {
      menu.classList.add('opacity-0', 'invisible', 'scale-95');
    }
  });

  if (dateMenu.classList.contains('opacity-0')) {
    swiperWrapper.innerHTML = '<div class="loading">در حال بارگذاری...</div>';

    window.currentDateContainer = swiperWrapper;
    window.currentTourId = tourId;

    $bc.setSource('db.tourDatesRequest', tourId);

    dateMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
  } else {
    dateMenu.classList.add('opacity-0', 'invisible', 'scale-95');
  }
};

const isMobile = () => {
  return window.innerWidth < 1024;
};

const onTourDatesLoaded = async (apiResponse) => {
  if (!window.currentDateContainer) {
    return;
  }

  try {
    const response = apiResponse.response;
    const jsonData = await response.json();

    let data = [];
    if (jsonData && jsonData.sources && jsonData.sources.length > 0) {
      data = jsonData.sources[0].data || [];
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      window.currentDateContainer.innerHTML = '<div class="no-dates">تاریخی موجود نیست</div>';
      return;
    }

    window.currentDateContainer.innerHTML = '';

    const mobile = isMobile();

    data.forEach((dateItem, index) => {
      const tourLink = `/tour.bc?id=${window.currentTourId}&from=${dateItem.start.dateid}&to=${dateItem.end.dateid}&day=${dateItem.day}`;

      if (mobile) {
        const div = document.createElement('div');
        div.className = 'date-li swiper-slide !w-[230px]';
        div.onclick = () => renderInventoryList(div, dateItem.day, dateItem.start.dateid, dateItem.end.dateid);

        div.innerHTML = `
                    <a href="${tourLink}" class="group block border border-gray-50 bg-white rounded-lg py-4 px-6 transition-all duration-300 hover:border-primary-400">
                        <h3 class="text-gray-500 font-light mb-1">تاریخ رفت و برگشت:</h3>
                        <div class="tour-dates text-sm font-semibold text-gray-500 transition-all duration-300 group-hover/leveltwo:text-primary-500">
                            <span class="start__date" data-date="${dateItem.start.date}">${dateItem.start.date}</span>
                            تا
                            <span class="end__date unicode-embed direction-ltr" data-date="${dateItem.end.date}">${dateItem.end.date}</span>
                        </div>
                    </a>
                `;

        window.currentDateContainer.appendChild(div);
      } else {
        const li = document.createElement('li');
        li.className = 'date-li swiper-slide cursor-pointer';
        li.onclick = () => renderInventoryList(li, dateItem.day, dateItem.start.dateid, dateItem.end.dateid);

        li.innerHTML = `
                    <a href="${tourLink}" class="group/leveltwo block border border-gray-50 w-[230px] bg-white rounded-lg py-4 px-6 transition-all duration-300 hover:border-primary-400">
                        <h3 class="text-gray-500 font-light mb-1">تاریخ رفت و برگشت:</h3>
                        <div class="tour-dates text-sm font-semibold text-gray-500 transition-all duration-300 group-hover/leveltwo:text-primary-500">
                            <span class="start__date" data-date="${dateItem.start.date}">${dateItem.start.date}</span>
                            تا
                            <span class="end__date unicode-embed direction-ltr" data-date="${dateItem.end.date}">${dateItem.end.date}</span>
                        </div>
                    </a>
                `;

        window.currentDateContainer.appendChild(li);
      }
    });
  } catch (error) {
    console.error('خطا در پردازش response:', error);
    window.currentDateContainer.innerHTML = '<div class="error">خطا در بارگذاری تاریخ‌ها</div>';
  }
};

const renderInventoryList = async (element, day, from, to) => {
  try {
    const mobile = isMobile();
    const selector = mobile ? '.swiper-slide' : '.date-li';

    document.querySelectorAll(selector).forEach((e) => {
      const group = e.querySelector('.group, .group\\/leveltwo');
      const dates = e.querySelector('.tour-dates, span');
      if (group) {
        group.classList.remove('border-primary-400');
      }
      if (dates) {
        dates.classList.remove('text-primary-500');
      }
    });

    $bc.setSource('db.inventoryViewSpecificDate', {
      from: from,
      to: to,
      day: day,
    });

    const group = element.querySelector('.group, .group\\/leveltwo');
    const dates = element.querySelector('.tour-dates, span');
    if (group) group.classList.add('border-primary-400');
    if (dates) dates.classList.add('text-primary-500');
  } catch (err) {
    console.error('خطا در renderInventoryList:', err);
  }
};
// tour-list date end

document.addEventListener('DOMContentLoaded', () => {
  const normalizeText = (text) => text.replace(/\s/g, '').normalize('NFKC');

  const tourCards = document.querySelectorAll('.tourL-tour-card');
  const dayFilterContainer = document.querySelector('.day-tour-filter-wrapper');
  const airlineContainer = document.querySelector('.checkboxList');
  const minInput = document.getElementById('minRange');
  const maxInput = document.getElementById('maxRange');
  const rangeTrack = document.getElementById('rangeTrack');
  const minValText = document.getElementById('minValue');
  const maxValText = document.getElementById('maxValue');
  const selectedDays = new Set();
  const selectedAirlines = new Set();

  const formatPrice = (val) => val.toLocaleString('fa-IR');
  const parsePrice = (priceString) => {
    let cleaned = priceString.replace(/[.,/\s]/g, '');
    const parsed = parseInt(cleaned, 10) || 0;
    return parsed;
  };

  let REAL_MIN = 0;
  let REAL_MAX = 0;
  let realMin = 0;
  let realMax = 0;

  let prices = Array.from(tourCards)
    .map((card) => {
      const priceElem = card.querySelector('.tourL-tour-price');
      if (!priceElem) {
        return 0;
      }
      return parsePrice(priceElem.textContent);
    })
    .filter((p) => p > 0);

  if (prices.length > 0) {
    REAL_MIN = Math.min(...prices);
    REAL_MAX = Math.max(...prices);
    realMin = REAL_MIN;
    realMax = REAL_MAX;
  }

  const daysMap = new Map();
  tourCards.forEach(card => {
    const dayElem = card.querySelector('.tourL-tour-day');
    if (dayElem) {
      const originalText = dayElem.textContent.trim();
      const key = normalizeText(originalText);
      if (key && !daysMap.has(key)) {
        const match = originalText.match(/(\d+)[^\d]+(\d+)/); 
        const night = match ? parseInt(match[1], 10) : 0;
        const day = match ? parseInt(match[2], 10) : 0;
        const sortValue = night + day; 
        daysMap.set(key, { originalText, sortValue, night, day });
      }
    }
  });

  const sortedDays = Array.from(daysMap.entries()).sort((a, b) => {
    if (a[1].sortValue !== b[1].sortValue) {
      return a[1].sortValue - b[1].sortValue;
    }
    return a[1].night - b[1].night;
  });

  dayFilterContainer.innerHTML = '';
  sortedDays.forEach(([key, { originalText }]) => {
    const btn = document.createElement('button');
    btn.className = 'day-tour-filter p-4 bg-white border border-gray-50 rounded-lg text-sm font-bold cursor-pointer transition-all duration-300 hover:border-primary-500 hover:text-primary-500';
    btn.textContent = originalText;
    btn.addEventListener('click', () => {
      const isSelected = selectedDays.has(key);
      btn.classList.toggle('border-primary-500', !isSelected);
      btn.classList.toggle('text-primary-500', !isSelected);

      if (isSelected) {
        selectedDays.delete(key);
      } else {
        selectedDays.add(key);
      }
      filterCards();
    });
    dayFilterContainer.appendChild(btn);
  });

  const airlineData = new Map();
  Array.from(tourCards).forEach((card) => {
    const airlineElem = card.querySelector('.tourL-tour-airline');
    if (airlineElem) {
      const airlineName = normalizeText(airlineElem.textContent);
      const imagePath = airlineElem.dataset.airlineImg || '../assets/images/default-airline.png';
      if (airlineName && !airlineData.has(airlineName)) {
        airlineData.set(airlineName, imagePath);
      }
    }
  });

  if (airlineContainer) {
    airlineContainer.innerHTML = '';
    airlineData.forEach((imagePath, airlineName) => {
      const airlineItem = document.createElement('div');
      airlineItem.className = 'airline-item flex items-center justify-between transition-all duration-500 ease-in-out';
      airlineItem.innerHTML = `
        <span class="flex items-center gap-3 text-sm font-bold">
          <span class="airline-hotel-input flex items-center justify-center w-6 h-6 border border-primary-100 rounded-lg cursor-pointer">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.48177 9.33333L5.38153 10.7582C5.81022 11.0797 6.41615 11.0061 6.75548 10.5914L12.1484 4" stroke="white" stroke-width="2" stroke-linecap="round"></path>
            </svg>
          </span>
          <span class="airline-item-name">${airlineName}</span>
        </span>
        <img src="${imagePath}" alt="${airlineName}" width="74" height="20" loading="lazy" />
      `;
      airlineContainer.appendChild(airlineItem);
    });
  }

  function filterCards() {
    tourCards.forEach((card) => {
      const priceElem = card.querySelector('.tourL-tour-price');
      const cardPrice = priceElem ? parsePrice(priceElem.textContent) : 0;

      const dayMatch =
        selectedDays.size === 0 ||
        selectedDays.has(normalizeText(card.querySelector('.tourL-tour-day')?.textContent || ''));

      const airlineMatch =
        selectedAirlines.size === 0 ||
        Array.from(selectedAirlines).some((name) =>
          normalizeText(card.querySelector('.tourL-tour-airline')?.textContent || '').includes(name)
        );

      const priceMatch = cardPrice >= realMin && cardPrice <= realMax;

      card.style.display = dayMatch && airlineMatch && priceMatch ? 'flex' : 'none';
    });

    updateFilterCount();
  }

  function updateFilterCount() {
    const filterCountEl = document.getElementById('filterBtnCount');
    const filterBtn = document.getElementById('filterBtn');
    const filterIcon = document.getElementById('filterIcon');

    if (!filterCountEl || !filterBtn || !filterIcon) {
      return;
    }

    let count = 0;

    if (selectedDays.size > 0) count++;
    if (selectedAirlines.size > 0) count++;
    if (realMin > REAL_MIN || realMax < REAL_MAX) count++;

    if (count > 0) {
      filterCountEl.classList.remove('hidden');
      filterCountEl.classList.add('flex');
      filterCountEl.textContent = count;

      filterBtn.classList.remove('bg-white');
      filterBtn.classList.add('bg-primary-500', 'shadow-small-btn-shadow', 'text-white');

      filterIcon.querySelectorAll('path, ellipse').forEach((el) => {
        el.setAttribute('stroke', '#11C086');
      });
    } else {
      filterCountEl.classList.add('hidden');
      filterCountEl.classList.remove('flex');
      filterCountEl.textContent = '';

      filterBtn.classList.remove('bg-primary-500', 'shadow-small-btn-shadow', 'text-white');
      filterBtn.classList.add('bg-white');

      filterIcon.querySelectorAll('path, ellipse').forEach((el) => {
        el.setAttribute('stroke', '#33363F');
      });
    }
  }

  document.querySelectorAll('.airline-hotel-input').forEach((input) => {
    input.addEventListener('click', function () {
      const parent = input.closest('.airline-item');
      const airlineName = normalizeText(parent.querySelector('.airline-item-name').innerText);

      const isSelected = selectedAirlines.has(airlineName);
      input.classList.toggle('bg-primary-500', !isSelected);

      if (isSelected) {
        selectedAirlines.delete(airlineName);
      } else {
        selectedAirlines.add(airlineName);
      }

      filterCards();
    });
  });

  function updatePriceRange() {
    if (!minInput || !maxInput || !rangeTrack || !minValText || !maxValText) {
      return;
    }

    let min = parseInt(minInput.value);
    let max = parseInt(maxInput.value);

    if (min > max) [min, max] = [max, min];

    const left = 100 - max;
    const width = max - min;

    rangeTrack.style.left = `${left}%`;
    rangeTrack.style.width = `${width}%`;

    realMin = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * min) / 100);
    realMax = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * max) / 100);

    minValText.textContent = formatPrice(realMin);
    maxValText.textContent = formatPrice(realMax);

    filterCards();
  }

  if (minInput) {
    minInput.addEventListener('input', updatePriceRange);
  }
  if (maxInput) {
    maxInput.addEventListener('input', updatePriceRange);
  }

  updatePriceRange();
});


// free-consulation-form
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.free-consulation-form');
  const openButtons = document.querySelectorAll('.open-consulation-btn');
  const closeButton = document.querySelector('.close-consulation-btn');
  const backdrop = document.querySelector('.modal-backdrop');

  const showForm = () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0', 'scale-95');
      modal.classList.add('opacity-100', 'scale-100');
    });

    document.body.style.overflow = 'hidden';
  };

  const hideForm = () => {
    modal.classList.remove('opacity-100', 'scale-100');
    modal.classList.add('opacity-0', 'scale-95');

    setTimeout(() => {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  };

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showForm();
    });
  });

  closeButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideForm();
  });

  backdrop?.addEventListener('click', hideForm);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideForm();
  });
});

// faq-box
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (event) {
    const box = event.target.closest('.faq-box');
    if (!box) return;

    const answer = box.querySelector('.faq-answer');
    const icon = box.querySelector('.faq-btn');
    const iconPath = box.querySelector('.faq-btn path');
    const title = box.querySelector('h2');
    const blackIcon = box.querySelector('.icon-plus-circle');
    const whiteIcon = box.querySelector('.icon-plus-circle-white');

    document.querySelectorAll('.faq-box').forEach((otherBox) => {
      if (otherBox !== box) {
        const otherAnswer = otherBox.querySelector('.faq-answer');
        const otherIcon = otherBox.querySelector('.faq-btn');
        const otherIconPath = otherBox.querySelector('.faq-btn path');
        const otherTitle = otherBox.querySelector('h2');
        const otherBlackIcon = otherBox.querySelector('.icon-plus-circle');
        const otherWhiteIcon = otherBox.querySelector('.icon-plus-circle-white');

        if (otherAnswer) {
          otherAnswer.classList.remove('opacity-100', 'scale-y-100', 'max-h-96', 'mt-2');
          otherAnswer.classList.add('opacity-0', 'scale-y-0', 'max-h-0');
        }

        otherBox.style.backgroundColor = '';
        otherBox.style.border = '';

        if (otherIcon) {
          otherIcon.classList.remove('rotate-180');
        }

        if (otherIconPath) {
          otherIconPath.setAttribute('stroke', '#1E2128');
        }

        if (otherTitle) {
          otherTitle.style.color = '';
        }

        if (otherBlackIcon && otherWhiteIcon) {
          otherBlackIcon.classList.remove('hidden');
          otherWhiteIcon.classList.add('hidden');
        }
      }
    });

    const isOpen = answer.classList.contains('scale-y-100');

    if (!isOpen) {
      answer.classList.remove('opacity-0', 'scale-y-0', 'max-h-0');
      answer.classList.add('opacity-100', 'scale-y-100', 'max-h-96', 'mt-2');

      box.style.backgroundColor = 'var(--primary-500)';
      box.style.border = 'none';

      if (title) {
        title.style.color = 'var(--secondary-500)';
      }

      if (iconPath) {
        iconPath.setAttribute('stroke', 'var(--secondary-500)');
      }

      if (icon) {
        icon.classList.add('rotate-180');
      }

      if (blackIcon && whiteIcon) {
        blackIcon.classList.add('hidden');
        whiteIcon.classList.remove('hidden');
      }
    } else {
      answer.classList.remove('opacity-100', 'scale-y-100', 'max-h-96', 'mt-2');
      answer.classList.add('opacity-0', 'scale-y-0', 'max-h-0');

      box.style.backgroundColor = '';
      box.style.border = '';

      if (title) {
        title.style.color = '';
      }

      if (iconPath) {
        iconPath.setAttribute('stroke', '#1E2128');
      }

      if (icon) {
        icon.classList.remove('rotate-180');
      }

      if (blackIcon && whiteIcon) {
        blackIcon.classList.remove('hidden');
        whiteIcon.classList.add('hidden');
      }
    }
  });
});

//visa with visa word and tour with tour word
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tParam = urlParams.get('t');

  if (tParam === 'all') {
    const allVisaItems = Array.from(document.querySelectorAll('.visa-list-search'));
    const allTourItems = Array.from(document.querySelectorAll('.tourL-tour-card'));
    const containerVisa = document.querySelector('.visa-list-container');
    const sectionVisa = document.querySelector('.visa-list-section');
    const containerTour = document.querySelector('.tour-list-container');
    const sectionTour = document.querySelector('.tour-list-section');

    // ویزا
    if (containerVisa && allVisaItems.length > 0) {
      containerVisa.innerHTML = '';
      let hasVisaMatch = false;

      allVisaItems.forEach((item) => {
        const titleEl = item.querySelector('.title-visa');
        const titleText = titleEl ? titleEl.textContent.trim().toLowerCase() : '';

        if (titleText.includes('visa') || titleText.includes('ویزا')) {
          const clone = item.cloneNode(true);
          containerVisa.appendChild(clone);
          hasVisaMatch = true;
        }
      });

      if (!hasVisaMatch && sectionVisa) {
        sectionVisa.style.display = 'none';
      }
    } else if (sectionVisa) {
      sectionVisa.style.display = 'none';
    }

    // تور
    if (containerTour && allTourItems.length > 0) {
      containerTour.innerHTML = '';
      let hasTourMatch = false;

      allTourItems.forEach((item) => {
        const titleEl = item.querySelector('.title-tour');
        const titleText = titleEl ? titleEl.textContent.trim().toLowerCase() : '';

        if (titleText.includes('tour') || titleText.includes('تور')) {
          const clone = item.cloneNode(true);
          containerTour.appendChild(clone);
          hasTourMatch = true;
        }
      });

      if (!hasTourMatch && sectionTour) {
        sectionTour.style.display = 'none';
      }
    } else if (sectionTour) {
      sectionTour.style.display = 'none';
    }
  }
});

// travel-box
document.addEventListener('DOMContentLoaded', function () {
  const wrappers = document.querySelectorAll('.travel-wrapper');

  function openBox(wrapper, box, answer, iconPath, title, orangeSun, whiteSun) {
    answer.classList.remove('opacity-0', 'scale-y-0', 'max-h-0');
    answer.style.maxHeight = 'none';

    requestAnimationFrame(() => {
      const fullHeight = answer.scrollHeight;

      answer.style.maxHeight = fullHeight + 'px';
      answer.classList.add('opacity-100', 'scale-y-100', 'mt-2');

      box.style.backgroundColor = 'var(--primary-500)';
      box.style.border = 'none';
      wrapper.style.border = '2px solid #D7DBE1';

      if (iconPath) iconPath.setAttribute('stroke', 'var(--secondary-500)');
      if (title) title.style.color = 'var(--secondary-500)';

      if (orangeSun) {
        orangeSun.classList.remove('block');
        orangeSun.classList.add('hidden');
      }
      if (whiteSun) {
        whiteSun.classList.remove('hidden');
        whiteSun.classList.add('block');
      }
    });
  }

  function closeBox(wrapper, box, answer, iconPath, title, orangeSun, whiteSun) {
    answer.classList.remove('opacity-100', 'scale-y-100', 'mt-2');
    answer.classList.add('opacity-0', 'scale-y-0', 'max-h-0');
    answer.style.maxHeight = '';

    box.style.backgroundColor = '';
    box.style.border = '1px solid #E5E7EB';
    wrapper.style.border = 'none';

    if (iconPath) iconPath.setAttribute('stroke', '#1E2128');
    if (title) title.style.color = '';

    if (orangeSun) {
      orangeSun.classList.remove('hidden');
      orangeSun.classList.add('block');
    }
    if (whiteSun) {
      whiteSun.classList.remove('block');
      whiteSun.classList.add('hidden');
    }
  }

  window.addEventListener('load', () => {
    if (wrappers.length > 0) {
      const firstWrapper = wrappers[0];
      const firstBox = firstWrapper.querySelector('.travel-box');
      const firstAnswer = firstWrapper.querySelector('.travel-answer');
      const firstIconPath = firstBox?.querySelector('.travel-btn path');
      const firstTitle = firstBox?.querySelector('h2');
      const firstOrangeSun = firstBox?.querySelector('.orange-sun');
      const firstWhiteSun = firstBox?.querySelector('.white-sun');

      if (firstAnswer) {
        openBox(firstWrapper, firstBox, firstAnswer, firstIconPath, firstTitle, firstOrangeSun, firstWhiteSun);
      }
    }
  });

  document.addEventListener('click', function (event) {
    const box = event.target.closest('.travel-box');
    if (!box) return;

    const wrapper = box.closest('.travel-wrapper');
    const answer = wrapper.querySelector('.travel-answer');
    const iconPath = box.querySelector('.travel-btn path');
    const title = box.querySelector('h2');
    const orangeSun = box.querySelector('.orange-sun');
    const whiteSun = box.querySelector('.white-sun');

    if (wrapper === wrappers[0]) {
      wrappers.forEach((otherWrapper, index) => {
        if (index !== 0) {
          const otherBox = otherWrapper.querySelector('.travel-box');
          const otherAnswer = otherWrapper.querySelector('.travel-answer');
          const otherIconPath = otherBox?.querySelector('.travel-btn path');
          const otherTitle = otherBox?.querySelector('h2');
          const otherOrangeSun = otherBox?.querySelector('.orange-sun');
          const otherWhiteSun = otherBox?.querySelector('.white-sun');
          closeBox(otherWrapper, otherBox, otherAnswer, otherIconPath, otherTitle, otherOrangeSun, otherWhiteSun);
        }
      });
      return;
    }

    const isOpen = !answer.classList.contains('max-h-0');
    if (!isOpen) {
      openBox(wrapper, box, answer, iconPath, title, orangeSun, whiteSun);
    } else {
      closeBox(wrapper, box, answer, iconPath, title, orangeSun, whiteSun);
    }

    wrappers.forEach((otherWrapper, index) => {
      if (otherWrapper !== wrapper && index !== 0) {
        const otherBox = otherWrapper.querySelector('.travel-box');
        const otherAnswer = otherWrapper.querySelector('.travel-answer');
        const otherIconPath = otherBox?.querySelector('.travel-btn path');
        const otherTitle = otherBox?.querySelector('h2');
        const otherOrangeSun = otherBox?.querySelector('.orange-sun');
        const otherWhiteSun = otherBox?.querySelector('.white-sun');
        closeBox(otherWrapper, otherBox, otherAnswer, otherIconPath, otherTitle, otherOrangeSun, otherWhiteSun);
      }
    });
  });
});


// filter price tour-list
document.addEventListener('DOMContentLoaded', function () {
  const priceButton = document.getElementById('priceToggleButton');
  const priceMenu = document.getElementById('priceDropdownMenu');
  const priceIcon = document.getElementById('priceToggleIcon');
  const priceOptions = document.querySelectorAll('.price-option');
  const tourCards = Array.from(document.querySelectorAll('.tourL-tour-card'));
  const tourListContainer = document.querySelector('.tourL-tour-list');
  const specialTourBtn = document.querySelector('.special-tour-btn');

  let isOpen = false;

  function extractCleanPrice(priceText) {
    return parseInt(priceText.replace(/[.,\/\s]+/g, ''));
  }

  function toggleCardVisibility(card, show) {
    if (show) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  }

  if (priceButton && priceMenu && priceIcon) {
    priceButton.addEventListener('click', () => {
      isOpen = !isOpen;

      priceMenu.classList.toggle('hidden', !isOpen);
      priceMenu.classList.toggle('flex', isOpen);
      priceIcon.classList.toggle('rotate-180', isOpen);
      priceIcon.classList.toggle('text-primary-500', isOpen);
      priceIcon.classList.toggle('text-[#1E2128]', !isOpen);
      priceButton.classList.toggle('bg-primary-100', isOpen);
      priceButton.classList.toggle('text-primary-500', isOpen);
      priceButton.classList.toggle('border-primary-500', isOpen);
      priceButton.classList.toggle('border-gray-50', !isOpen);
    });

    document.addEventListener('click', (event) => {
      const isClickInsideButton = priceButton.contains(event.target);
      const isClickInsideMenu = priceMenu.contains(event.target);
      if (!isClickInsideButton && !isClickInsideMenu && isOpen) {
        isOpen = false;
        priceMenu.classList.add('hidden');
        priceMenu.classList.remove('flex');
        priceIcon.classList.remove('rotate-180', 'text-primary-500');
        priceIcon.classList.add('text-[#1E2128]');
        priceButton.classList.remove('bg-primary-100', 'text-primary-500', 'border-primary-500');
        priceButton.classList.add('border-gray-50');
      }
    });
  }

  priceOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const selectedFilter = option.dataset.price;

      document.querySelectorAll('.price-check-icon').forEach((icon) => {
        icon.classList.remove('bg-primary-500', 'text-white');
      });

      const icon = option.querySelector('.price-check-icon');
      icon.classList.add('bg-primary-500', 'text-white');

      if (tourCards.length && selectedFilter) {
        let filteredCards = [...tourCards];

        filteredCards.sort((a, b) => {
          const priceA = extractCleanPrice(a.querySelector('.tourL-tour-price').innerText);
          const priceB = extractCleanPrice(b.querySelector('.tourL-tour-price').innerText);

          if (selectedFilter === 'high-to-low') return priceB - priceA;
          if (selectedFilter === 'low-to-high') return priceA - priceB;
          if (selectedFilter === 'best-price') return priceA - priceB;
        });

        tourListContainer.innerHTML = '';

        filteredCards.forEach((card) => {
          const econSpan = card.querySelector('.economic');
          const isEcon = econSpan?.innerText?.trim().toLowerCase() === 'true';

          if (selectedFilter === 'best-price') {
            toggleCardVisibility(card, isEcon);
            if (isEcon) tourListContainer.appendChild(card);
          } else {
            toggleCardVisibility(card, true);
            tourListContainer.appendChild(card);
          }
        });
      }
    });
  });

  if (specialTourBtn) {
    specialTourBtn.addEventListener('click', () => {
      tourCards.forEach((card) => {
        const specialSpan = card.querySelector('.special-facilities');
        const isSpecial = specialSpan?.innerText?.trim().toLowerCase() === 'true';
        toggleCardVisibility(card, isSpecial);
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.content-container');

  containers.forEach((container) => {
    const btn = container.querySelector('.see-more');
    const btnText = container.querySelector('.see-more-text');
    const shadow = container.querySelector('.white-shadow');

    if (!btn || !btnText) return;

    const isMobile = window.innerWidth < 1024;
    const closedHeight = isMobile ? 620 : 480;

    requestAnimationFrame(() => {
      const contentHeight = container.scrollHeight;

      if (contentHeight <= closedHeight) {
        btn.style.display = 'none';
        if (shadow) shadow.style.display = 'none';
        return;
      }

      container.style.maxHeight = closedHeight + 'px';

      btn.addEventListener('click', () => {
        const isOpen = container.classList.contains('open');

        if (isOpen) {
          container.style.maxHeight = contentHeight + 'px';
          requestAnimationFrame(() => {
            container.style.maxHeight = closedHeight + 'px';
            container.classList.remove('open');
          });

          if (shadow) shadow.classList.add('bg-white-shadow');
          btnText.textContent = 'مشاهده همه';
        } else {
          container.style.maxHeight = closedHeight + 'px';
          container.classList.add('open');

          requestAnimationFrame(() => {
            container.style.maxHeight = container.scrollHeight + 'px';
          });

          if (shadow) shadow.classList.remove('bg-white-shadow');
          btnText.textContent = 'مشاهده کمتر';
        }
      });
    });
  });
});


// reply-comment
async function Reply_Comment(element) {
  const responsereply = await fetch('Client_CheckAuthentication.inc');
  if (!responsereply.ok) {
    throw new Error('متاسفانه مشکلی به وجود آمده است لطفا بعدا مجددا تلاش فرمایید.');
  } else {
    let CheckAuthentication = await responsereply.text();
    if (CheckAuthentication === 'true') {
      var firstname = document.querySelector('.user-profile-content .default-name').innerText;
      var lastname = document.querySelector('.user-profile-content .default-family').innerText;
      element.closest('.opinionRow').querySelector('.reply-title').value = firstname + ' ' + lastname;
      element.closest('.opinionRow').querySelector('.replyCommentForm').classList.toggle('hidden');
    } else {
      showLoginContainer(this);
    }
  }
}

// send-reply
async function send_Reply(element, event) {
  event.preventDefault();
  var form = new FormData(element.closest('pov-form'));
  var xhr = new XMLHttpRequest();
  xhr.open('POST', element.closest('pov-form').action, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      document.getElementById('popupMessage').innerHTML = xhr.responseText;
      document.getElementById('popuparticle').classList.remove('hidden');
    } else {
      document.getElementById('popupMessage').innerHTML = xhr.responseText;
      document.getElementById('popuparticle').classList.remove('hidden');
    }
  };
  xhr.send(form);
}

// request-form
function uploadDocumentRequest(args) {
  document.querySelector('#request-form .Loading_Form').style.display = 'block';
  const captcha = document
    .querySelector('#request-form')
    .querySelector("#captchaContainer input[name='captcha']").value;
  const captchaid = document
    .querySelector('#request-form')
    .querySelector("#captchaContainer input[name='captchaid']").value;
  const stringJson = JSON.stringify(args.source?.rows[0]);
  $bc.setSource('cms.uploadRequest', {
    value: stringJson,
    captcha: captcha,
    captchaid: captchaid,
    run: true,
  });
}

function refreshCaptchaRequest(e) {
  $bc.setSource('captcha.refreshRequest', true);
}

async function OnProcessedEditObjectRequest(args) {
  var response = args.response;
  var json = await response.json();
  var errorid = json.errorid;
  if (errorid == '6') {
    document.querySelector('#request-form .Loading_Form').style.display = 'none';
    document.querySelector('#request-form .message-api').innerHTML = 'درخواست شما با موفقیت ثبت شد.';
  } else {
    refreshCaptchaRequest();
    setTimeout(() => {
      document.querySelector('#request-form .Loading_Form').style.display = 'none';
      document.querySelector('#request-form .message-api').innerHTML = 'خطایی رخ داده, لطفا مجدد اقدام کنید.';
    }, 2000);
  }
}

async function RenderFormRequest() {
  var inputElementVisa7 = document.querySelector(' .request-username input[data-bc-text-input]');
  inputElementVisa7.setAttribute('placeholder', 'نام و نام خانوادگی');

  var inputElementVisa7 = document.querySelector(' .request-number input[data-bc-text-input]');
  inputElementVisa7.setAttribute('placeholder', 'شماره تماس');

  var inputElementVisa7 = document.querySelector(' .request-email input[data-bc-text-input]');
  inputElementVisa7.setAttribute('placeholder', 'آدرس ایمیل');

  var inputElementVisa7 = document.querySelector(' .request-message textarea[data-bc-text-input]');
  inputElementVisa7.setAttribute('placeholder', 'متن درخواست');
}

// employment-form
function uploadDocumentEmployment(args) {
  document.querySelector('#employment-form .Loading_Form').style.display = 'block';
  const captcha = document
    .querySelector('#employment-form')
    .querySelector("#captchaContainer input[name='captcha']").value;
  const captchaid = document
    .querySelector('#employment-form')
    .querySelector("#captchaContainer input[name='captchaid']").value;
  const stringJson = JSON.stringify(args.source?.rows[0]);
  $bc.setSource('cms.uploadEmployment', {
    value: stringJson,
    captcha: captcha,
    captchaid: captchaid,
    run: true,
  });
}

function refreshCaptchaEmployment(e) {
  $bc.setSource('captcha.refreshEmployment', true);
}

async function OnProcessedEditObjectEmployment(args) {
  var response = args.response;
  var json = await response.json();
  var errorid = json.errorid;
  if (errorid == '6') {
    document.querySelector('#employment-form .Loading_Form').style.display = 'none';
    document.querySelector('#employment-form .message-api').innerHTML = 'درخواست شما با موفقیت ثبت شد.';
  } else {
    refreshCaptchaEmployment();
    setTimeout(() => {
      document.querySelector('#employment-form .Loading_Form').style.display = 'none';
      document.querySelector('#employment-form .message-api').innerHTML = 'خطایی رخ داده, لطفا مجدد اقدام کنید.';
    }, 2000);
  }
}

async function RenderFormEmployment() {
  var inputElementVisa7 = document.querySelector(' .employment-username input[data-bc-text-input]');
  inputElementVisa7.setAttribute('placeholder', 'نام و نام خانوادگی');

  var inputElementVisa7 = document.querySelector(' .employment-number input[data-bc-text-input]');
  inputElementVisa7.setAttribute('placeholder', 'شماره تماس');

  var inputElementVisa7 = document.querySelector(' .employment-birth input[data-bc-text-input]');
  inputElementVisa7.setAttribute('placeholder', 'تاریخ تولد');

  var inputElementVisa7 = document.querySelector(".employment-upload input[type='file'][data-bc-file-input]");
  inputElementVisa7.setAttribute('title', 'آپلود رزومه');

  var inputElementVisa7 = document.querySelector(' .employment-message textarea[data-bc-text-input]');
  inputElementVisa7.setAttribute('placeholder', 'توضیحات');
}

// consulation-form
function uploadDocumentConsulation(args) {
  document.querySelector('#consulation-form .Loading_Form').style.display = 'block';
  const captcha = document
    .querySelector('#consulation-form')
    .querySelector("#captchaContainer input[name='captcha']").value;
  const captchaid = document
    .querySelector('#consulation-form')
    .querySelector("#captchaContainer input[name='captchaid']").value;
  const stringJson = JSON.stringify(args.source?.rows[0]);
  $bc.setSource('cms.uploadConsulation', {
    value: stringJson,
    captcha: captcha,
    captchaid: captchaid,
    run: true,
  });
}

function refreshCaptchaConsulation(e) {
  $bc.setSource('captcha.refreshConsulation', true);
}

async function OnProcessedEditObjectConsulation(args) {
  var response = args.response;
  var json = await response.json();
  var errorid = json.errorid;
  if (errorid == '6') {
    document.querySelector('#consulation-form .Loading_Form').style.display = 'none';
    document.querySelector('#consulation-form .message-api').innerHTML = 'درخواست شما با موفقیت ثبت شد.';
  } else {
    refreshCaptchaConsulation();
    setTimeout(() => {
      document.querySelector('#consulation-form .Loading_Form').style.display = 'none';
      document.querySelector('#consulation-form .message-api').innerHTML = 'خطایی رخ داده, لطفا مجدد اقدام کنید.';
    }, 2000);
  }
}

async function RenderFormConsulation() {
  var inputElementVisa7 = document.querySelector(' .consulation-username input[data-bc-text-input]');
  inputElementVisa7.setAttribute('placeholder', 'اسم و فامیل');

  var inputElementVisa7 = document.querySelector(' .consulation-number input[data-bc-text-input]');
  inputElementVisa7.setAttribute('placeholder', '09123456789');
}

//swiper
if (document.querySelector('.swiper-special-destination')) {
  var swiperSpecialDestination = new Swiper('.swiper-special-destination', {
    slidesPerView: 'auto',
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.swiper-special-tour')) {
  var swiperSpecialTour = new Swiper('.swiper-special-tour', {
    slidesPerView: 'auto',
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.swiper-special-spring-tour')) {
  var swiperSpecialSpringTour = new Swiper('.swiper-special-spring-tour', {
    slidesPerView: 'auto',
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.swiper-special-destination-tour')) {
  var swiperSpecialDestinationTour = new Swiper('.swiper-special-destination-tour', {
    slidesPerView: 'auto',
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.swiper-tour-date-tourL')) {
  var swiperTourDateTourL = new Swiper('.swiper-tour-date-tourL', {
    slidesPerView: 2.7,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 8,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
  });
}
if (document.querySelector('.swiper-tour-date-tourL-mobile')) {
  var swiperTourDateTourLMobile = new Swiper('.swiper-tour-date-tourL-mobile', {
    slidesPerView: 2.7,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 8,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
  });
}
if (document.querySelector('.swiper-special-suggestion')) {
  var swiperSpecialSuggestion = new Swiper('.swiper-special-suggestion', {
    slidesPerView: 2.2,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 12,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
  });
}
if (document.querySelector('.swiper-small-gallery-about')) {
  var swiperSmallImg = new Swiper('.swiper-small-gallery-about', {
    spaceBetween: 10,
    slidesPerView: 2,
    freeMode: true,
    watchSlidesProgress: true,
  });
}
if (document.querySelector('.swiper-big-gallery-about')) {
  var swiperBigImg = new Swiper('.swiper-big-gallery-about', {
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    thumbs: {
      swiper: swiperSmallImg,
    },
  });
}
if (document.querySelector('.swiper-slogan-mobile')) {
  var swiperSloganMobile = new Swiper('.swiper-slogan-mobile', {
    slidesPerView: 1.3,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 16,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
  });
}
if (document.querySelector('.swiper-special-destination-mobile')) {
  var swiperSpecialDestinationMobile = new Swiper('.swiper-special-destination-mobile', {
    slidesPerView: 1.3,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.swiper-special-tour-mobile')) {
  var swiperSpecialTourMobile = new Swiper('.swiper-special-tour-mobile', {
    slidesPerView: 1.2,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 16,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.swiper-special-spring-tour-mobile')) {
  var swiperSpecialSpringTourMobile = new Swiper('.swiper-special-spring-tour-mobile', {
    slidesPerView: 1.3,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.swiper-special-destination-tour-mobile')) {
  var swiperSpecialDestinationTourMobile = new Swiper('.swiper-special-destination-tour-mobile', {
    slidesPerView: 4,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.swiper-small-img')) {
  var swiperSmallImg = new Swiper('.swiper-small-img', {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
  });
}
if (document.querySelector('.swiper-big-img')) {
  var swiperBigImg = new Swiper('.swiper-big-img', {
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    thumbs: {
      swiper: swiperSmallImg,
    },
  });
}
if (document.querySelector('.swiper-tour-date')) {
  var swiperTourDate = new Swiper('.swiper-tour-date', {
    slidesPerView: 1.5,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
  });
}
if (document.querySelector('.swiper-same-tour')) {
  var swiperSameTour = new Swiper('.swiper-same-tour', {
    slidesPerView: 2.1,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 16,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.swiper-small-gallery-about-mobile')) {
  var swiperSmallImgMobile = new Swiper('.swiper-small-gallery-about-mobile', {
    spaceBetween: 10,
    slidesPerView: 2,
    freeMode: true,
    watchSlidesProgress: true,
  });
}
if (document.querySelector('.swiper-big-gallery-about-mobile')) {
  var swiperBigImgMobile = new Swiper('.swiper-big-gallery-about-mobile', {
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    thumbs: {
      swiper: swiperSmallImgMobile,
    },
  });
}
if (document.querySelector('.swiper-special-destination-tour-list-mobile')) {
  var swiperSpecialDestinationTourListMobile = new Swiper('.swiper-special-destination-tour-list-mobile', {
    slidesPerView: 1.3,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.swiper-special-suggestion-mobile')) {
  var swiperSpecialDestinationTourMobile = new Swiper('.swiper-special-suggestion-mobile', {
    slidesPerView: 1.17,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 10,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
  });
}
if (document.querySelector('.swiper-special-destination-tour-mobile')) {
  var swiperSpecialDestinationTourMobile = new Swiper('.swiper-special-destination-tour-mobile', {
    slidesPerView: 4,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
if (document.querySelector('.sswiper-small-img-mobile')) {
  var swiperSmallImgMobile = new Swiper('.swiper-small-img-mobile', {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
  });
}
if (document.querySelector('.swiper-big-img-mobile')) {
  var swiperBigImgMobile = new Swiper('.swiper-big-img-mobile', {
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    thumbs: {
      swiper: swiperSmallImgMobile,
    },
  });
}
if (document.querySelector('.swiper-tour-date')) {
  var swiperTourDateMobile = new Swiper('.swiper-tour-date', {
    slidesPerView: 1.5,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
  });
}
if (document.querySelector('.swiper-same-tour-mobile')) {
  var swiperSameTourMobile = new Swiper('.swiper-same-tour-mobile', {
    slidesPerView: 1.17,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 16,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
  });
}
