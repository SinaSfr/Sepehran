const headerMenu = document.querySelector(".header-menu");
const headerMenuClose = document.querySelector(".header-menu-close");
const bars3 = document.querySelector(".bars3");

if (window.innerWidth < 1024) {
  if (headerMenu && headerMenuClose && bars3) {
    headerMenuClose.addEventListener("click", function () {
      headerMenu.style.transform = "translateX(1024px)";
      document.body.classList.remove("overflow-hidden");
    });

    bars3.addEventListener("click", function () {
      headerMenu.style.transform = "translateX(0)";
      document.body.classList.add("overflow-hidden");
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleDropdowns = document.querySelectorAll(".toggle-dropdown");
  const dropdownIcons = document.querySelectorAll(".dropdown-icon");

  toggleDropdowns.forEach((toggle, index) => {
    const submenu = toggle.nextElementSibling;
    const dropdownIcon = dropdownIcons[index];

    toggle.addEventListener("click", function () {
      dropdownIcon.classList.toggle("rotate-180");

      if (submenu.style.maxHeight) {
        submenu.style.maxHeight = null;
        submenu.style.opacity = "0";
      } else {
        submenu.style.maxHeight = submenu.scrollHeight * 30 + "px";
        submenu.style.opacity = "1";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.querySelector(".tourcategorydropdown__trigger");
  const content = document.querySelector(".tourcategorydropdown__content");
  const icon = document.querySelector(".tourcategorydropdown__icon");
  const details = document.getElementById("details");

  const openMobileBtn = document.getElementById("openTourMobile");
  const mobileOverlay = document.querySelector(".tourcategorymobile__overlay");
  const closeMobileBtn = document.getElementById("closeTourMobile");

  if (trigger && content && icon) {
    trigger.addEventListener("click", () => {
      const isHidden = content.classList.contains("hidden");

      if (isHidden) {
        content.classList.remove("hidden", "opacity-0");
        content.classList.add("flex", "opacity-100");
        icon.classList.add("rotate-180");
      } else {
        content.classList.add("opacity-0");
        content.classList.remove("opacity-100");
        icon.classList.remove("rotate-180");

        setTimeout(() => {
          content.classList.remove("flex");
          content.classList.add("hidden");
        }, 300);
      }
    });
  }

  document.querySelectorAll(".tourcategorydropdown__item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".tourcategorydropdown__item").forEach((li) => {
        li.classList.remove(
          "bg-primary-500",
          "text-secondary-500",
          "mr-2",
          "transition-all",
          "duration-300"
        );
      });

      item.classList.add(
        "bg-primary-500",
        "text-secondary-500",
        "mr-2",
        "transition-all",
        "duration-300"
      );

      if (details && details.classList.contains("hidden")) {
        details.classList.remove("hidden");
        details.classList.add(
          "opacity-0",
          "transition-opacity",
          "duration-300"
        );

        setTimeout(() => {
          details.classList.remove("opacity-0");
          details.classList.add("opacity-100");
        }, 10);
      }
    });
  });

  if (openMobileBtn && mobileOverlay && closeMobileBtn) {
    openMobileBtn.addEventListener("click", () => {
      mobileOverlay.classList.remove("hidden", "opacity-0");
      mobileOverlay.classList.add("opacity-100");
      document.body.classList.add("overflow-hidden");
    });

    closeMobileBtn.addEventListener("click", () => {
      mobileOverlay.classList.remove("opacity-100");
      mobileOverlay.classList.add("opacity-0");
      document.body.classList.remove("overflow-hidden");

      setTimeout(() => {
        mobileOverlay.classList.add("hidden");
      }, 300);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".search-form");
  if (!form) return;

  const input = form.querySelector(".search-input");
  const button = form.querySelector(".search-toggle");
  if (!input || !button) return;

  let expanded = false;

  function openForm() {
    form.classList.add("w-48");
    form.classList.remove("w-10");

    input.classList.add("w-full", "pr-3");
    input.classList.remove("w-0", "pr-0");

    expanded = true;
    input.focus();
  }

  function closeForm() {
    form.classList.remove("w-48");
    form.classList.add("w-10");

    input.classList.remove("w-full", "pr-3");
    input.classList.add("w-0", "pr-0");

    expanded = false;
  }

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!expanded) {
      openForm();
    } else if (!input.value.trim()) {
      input.focus();
    } else {
      form.submit();
    }
  });

  document.addEventListener("click", () => {
    if (expanded) {
      closeForm();
    }
  });

  form.addEventListener("submit", (e) => {
    if (!input.value.trim()) {
      e.preventDefault();
      input.focus();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector(".tour-category-header");
  const menu = document.querySelector(".menu-tour-category");
  const icon = document.querySelector(".drop-down-tour-category");

  if (!toggleBtn || !menu || !icon) return;

  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("opacity-0");
    menu.classList.toggle("scale-95");
    menu.classList.toggle("pointer-events-none");
    icon.classList.toggle("rotate-180");
  });

  document.addEventListener("click", (e) => {
    if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add("opacity-0");
      menu.classList.add("scale-95");
      menu.classList.add("pointer-events-none");
      icon.classList.remove("rotate-180");
    }
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   const minInput = document.getElementById("minRange");
//   const maxInput = document.getElementById("maxRange");
//   const rangeTrack = document.getElementById("rangeTrack");
//   const minValText = document.getElementById("minValue");
//   const maxValText = document.getElementById("maxValue");

//   const tourContainer = document.querySelector(".tourL-tour-list");
//   const tourCards = tourContainer
//     ? Array.from(tourContainer.querySelectorAll(".tourL-tour-card"))
//     : [];

//   if (!minInput || !maxInput || !rangeTrack || !minValText || !maxValText) {
//     return;
//   }

//   function formatPrice(val) {
//     return val.toLocaleString("fa-IR");
//   }

//   function parsePrice(priceString) {
//     let cleaned = priceString.replace(/[.,\/\s]/g, "");
//     return parseInt(cleaned, 10) || 0;
//   }

//   let prices = tourCards
//     .map((card) => {
//       const priceElem = card.querySelector(".tourL-tour-price");
//       if (!priceElem) return 0;
//       return parsePrice(priceElem.textContent);
//     })
//     .filter((p) => p > 0);

//   const REAL_MIN = Math.min(...prices);
//   const REAL_MAX = Math.max(...prices);

//   function updateTrack() {
//     let min = parseInt(minInput.value);
//     let max = parseInt(maxInput.value);

//     if (min > max) {
//       [min, max] = [max, min];
//     }

//     const left = 100 - max;
//     const width = max - min;

//     rangeTrack.style.left = `${left}%`;
//     rangeTrack.style.width = `${width}%`;

//     const realMin = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * min) / 100);
//     const realMax = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * max) / 100);

//     minValText.textContent = formatPrice(realMin);
//     maxValText.textContent = formatPrice(realMax);

//     tourCards.forEach((card) => {
//       const priceElem = card.querySelector(".tourL-tour-price");
//       if (!priceElem) return;

//       const cardPrice = parsePrice(priceElem.textContent);
//       if (cardPrice >= realMin && cardPrice <= realMax) {
//         card.classList.remove("hidden");
//         card.classList.add("flex");
//       } else {
//         card.classList.add("hidden");
//         card.classList.remove("flex");
//       }
//     });
//   }

//   minInput.addEventListener("input", updateTrack);
//   maxInput.addEventListener("input", updateTrack);

//   updateTrack();
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const filterButtons = document.querySelectorAll(".day-tour-filter");
//   const tourCards = document.querySelectorAll(".tourL-tour-card");

//   const normalizeText = (text) => text.replace(/\s/g, "").normalize("NFKD");

//   const selectedDays = new Set();

//   filterButtons.forEach((button) => {
//     button.addEventListener("click", function () {
//       const selectedDay = normalizeText(button.textContent);

//       // انتخاب یا لغو انتخاب
//       if (selectedDays.has(selectedDay)) {
//         selectedDays.delete(selectedDay);
//         button.classList.remove("border-primary-500", "text-primary-500");
//       } else {
//         selectedDays.add(selectedDay);
//         button.classList.add("border-primary-500", "text-primary-500");
//       }

//       filterCards(); // فیلتر کن
//     });
//   });

//   // پشتیبانی از فیلتر ایرلاین همزمان (درصورتی که قبلی رو هم اد کردی)
//   const airlineInputs = document.querySelectorAll(".airline-hotel-input");
//   const selectedAirlines = new Set();

//   airlineInputs.forEach((input) => {
//     input.addEventListener("click", function () {
//       const parent = input.closest('.airline-item');
//       const airlineName = normalizeText(parent.querySelector('.airline-item-name').innerText);

//       if (selectedAirlines.has(airlineName)) {
//         selectedAirlines.delete(airlineName);
//         input.classList.remove('bg-primary-500');
//       } else {
//         selectedAirlines.add(airlineName);
//         input.classList.add('bg-primary-500');
//       }

//       filterCards(); // فیلتر کن
//     });
//   });

//   // تابع فیلتر نهایی
//   function filterCards() {
//     tourCards.forEach((card) => {
//       const tourDay = card.querySelector(".tourL-tour-day");
//       const airline = card.querySelector(".tourL-tour-airline");

//       const cardDay = tourDay ? normalizeText(tourDay.textContent) : "";
//       const cardAirline = airline ? normalizeText(airline.textContent) : "";

//       const dayMatch = selectedDays.size === 0 || selectedDays.has(cardDay);
//       const airlineMatch = selectedAirlines.size === 0 || Array.from(selectedAirlines).some(name => cardAirline.includes(name));

//       card.style.display = dayMatch && airlineMatch ? "flex" : "none";
//     });
//   }
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const normalizeText = (text) => text.replace(/\s/g, '').normalize('NFKD');

//   const tourCards = document.querySelectorAll('.tourL-tour-card');
//   const airlineInputs = document.querySelectorAll('.airline-hotel-input');

//   const selectedAirlines = new Set();

//   airlineInputs.forEach((input) => {
//     input.addEventListener("click", function () {
//       const parent = input.closest('.airline-item');
//       const airlineName = normalizeText(parent.querySelector('.airline-item-name').innerText);

//       // toggle انتخاب
//       if (selectedAirlines.has(airlineName)) {
//         selectedAirlines.delete(airlineName);
//         input.classList.remove('bg-primary-500');
//       } else {
//         selectedAirlines.add(airlineName);
//         input.classList.add('bg-primary-500');
//       }

//       // اعمال فیلتر
//       tourCards.forEach((card) => {
//         const airlineEl = card.querySelector('.tourL-tour-airline');
//         if (!airlineEl) return;

//         const cardAirline = normalizeText(airlineEl.innerText);

//         if (selectedAirlines.size === 0) {
//           card.style.display = 'flex'; // همه رو نشون بده
//           return;
//         }

//         const isMatch = Array.from(selectedAirlines).some((selected) =>
//           cardAirline.includes(selected)
//         );

//         card.style.display = isMatch ? 'flex' : 'none';
//       });
//     });
//   });
// });

// see-more-airline-items
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".checkboxList");
  const toggleBtn = document.querySelector(".toggle-btn");
  const items = container
    ? Array.from(container.querySelectorAll(".airline-item"))
    : [];
  const visibleCount = 3;

  function hideItems() {
    items.forEach((item, index) => {
      if (index >= visibleCount) {
        item.classList.add("hidden", "opacity-0", "max-h-0", "overflow-hidden");
      } else {
        item.classList.remove(
          "hidden",
          "opacity-0",
          "max-h-0",
          "overflow-hidden"
        );
      }
    });
  }

  function showItems() {
    items.forEach((item, index) => {
      if (index >= visibleCount) {
        item.classList.remove("hidden", "max-h-0", "overflow-hidden");

        setTimeout(() => item.classList.remove("opacity-0"), 10);
      }
    });
  }

  function toggleItems() {
    if (
      items.length > visibleCount &&
      items[visibleCount].classList.contains("hidden")
    ) {
      showItems();
      toggleBtn.textContent = "مشاهده کمتر";
    } else {
      items.forEach((item, index) => {
        if (index >= visibleCount) {
          item.classList.add("opacity-0");
        }
      });

      setTimeout(() => {
        items.forEach((item, index) => {
          if (index >= visibleCount) {
            item.classList.add("hidden", "max-h-0", "overflow-hidden");
          }
        });
      }, 500);
      toggleBtn.textContent = "مشاهده بیشتر";
    }
  }

  hideItems();
  toggleBtn?.addEventListener("click", toggleItems);
});

// open-filter-tour-list-mobile and open-filter-hotel
document.addEventListener("DOMContentLoaded", () => {
  function setupFilterMenu(buttonId, menuId, closeId) {
    const btn = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);
    const closeBtn = document.getElementById(closeId);

    if (btn && menu && closeBtn) {
      btn.addEventListener("click", () => {
        menu.classList.remove("translate-y-full");
        document.body.classList.add("overflow-hidden");
      });

      closeBtn.addEventListener("click", () => {
        menu.classList.add("translate-y-full");
        document.body.classList.remove("overflow-hidden");
      });
    }
  }

  setupFilterMenu("filterBtn", "filterMenu", "filterMenuClose");
  setupFilterMenu("filterBtnHotel", "filterMenuHotel", "filterMenuCloseHotel");
});

// filter-tour-list
document.addEventListener("DOMContentLoaded", () => {
  const normalizeText = (text) => text.replace(/\s/g, "").normalize("NFKD");

  const tourCards = document.querySelectorAll(".tourL-tour-card");
  const filterButtons = document.querySelectorAll(".day-tour-filter");
  const airlineInputs = document.querySelectorAll(".airline-hotel-input");

  const minInput = document.getElementById("minRange");
  const maxInput = document.getElementById("maxRange");
  const rangeTrack = document.getElementById("rangeTrack");
  const minValText = document.getElementById("minValue");
  const maxValText = document.getElementById("maxValue");

  const selectedDays = new Set();
  const selectedAirlines = new Set();

  const formatPrice = (val) => val.toLocaleString("fa-IR");
  const parsePrice = (priceString) => {
    let cleaned = priceString.replace(/[.,\/\s]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  let prices = Array.from(tourCards)
    .map((card) => {
      const priceElem = card.querySelector(".tourL-tour-price");
      return priceElem ? parsePrice(priceElem.textContent) : 0;
    })
    .filter((p) => p > 0);

  const REAL_MIN = Math.min(...prices);
  const REAL_MAX = Math.max(...prices);
  let realMin = REAL_MIN;
  let realMax = REAL_MAX;

  function filterCards() {
    tourCards.forEach((card) => {
      const tourDay = card.querySelector(".tourL-tour-day");
      const airline = card.querySelector(".tourL-tour-airline");
      const priceElem = card.querySelector(".tourL-tour-price");

      const cardDay = tourDay ? normalizeText(tourDay.textContent) : "";
      const cardAirline = airline ? normalizeText(airline.textContent) : "";
      const cardPrice = priceElem ? parsePrice(priceElem.textContent) : 0;

      const dayMatch = selectedDays.size === 0 || selectedDays.has(cardDay);
      const airlineMatch =
        selectedAirlines.size === 0 ||
        Array.from(selectedAirlines).some((name) => cardAirline.includes(name));
      const priceMatch = cardPrice >= realMin && cardPrice <= realMax;

      card.style.display =
        dayMatch && airlineMatch && priceMatch ? "flex" : "none";
    });

    updateFilterCount();
  }

  function updateFilterCount() {
    const filterCountEl = document.getElementById("filterBtnCount");
    const filterBtn = document.getElementById("filterBtn");
    const filterIcon = document.getElementById("filterIcon");

    if (!filterCountEl || !filterBtn || !filterIcon) return;

    let count = 0;

    if (selectedDays.size > 0) count++;
    if (selectedAirlines.size > 0) count++;
    if (realMin > REAL_MIN || realMax < REAL_MAX) count++;

    if (count > 0) {
      filterCountEl.classList.remove("hidden");
      filterCountEl.classList.add("flex");
      filterCountEl.textContent = count;

      filterBtn.classList.remove("bg-white");
      filterBtn.classList.add(
        "bg-primary-500",
        "shadow-small-btn-shadow",
        "text-white"
      );

      filterIcon.querySelectorAll("path, ellipse").forEach((el) => {
        el.setAttribute("stroke", "#11C086");
      });
    } else {
      filterCountEl.classList.add("hidden");
      filterCountEl.classList.remove("flex");
      filterCountEl.textContent = "";

      filterBtn.classList.remove(
        "bg-primary-500",
        "shadow-small-btn-shadow",
        "text-white"
      );
      filterBtn.classList.add("bg-white");

      filterIcon.querySelectorAll("path, ellipse").forEach((el) => {
        el.setAttribute("stroke", "#33363F");
      });
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedDay = normalizeText(button.textContent);
      const isSelected = selectedDays.has(selectedDay);

      button.classList.toggle("border-primary-500", !isSelected);
      button.classList.toggle("text-primary-500", !isSelected);

      if (isSelected) {
        selectedDays.delete(selectedDay);
      } else {
        selectedDays.add(selectedDay);
      }

      filterCards();
    });
  });

  airlineInputs.forEach((input) => {
    input.addEventListener("click", function () {
      const parent = input.closest(".airline-item");
      const airlineName = normalizeText(
        parent.querySelector(".airline-item-name").innerText
      );

      const isSelected = selectedAirlines.has(airlineName);
      input.classList.toggle("bg-primary-500", !isSelected);

      if (isSelected) {
        selectedAirlines.delete(airlineName);
      } else {
        selectedAirlines.add(airlineName);
      }

      filterCards();
    });
  });

  function updatePriceRange() {
    if (!minInput || !maxInput || !rangeTrack || !minValText || !maxValText)
      return;

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
    minInput.addEventListener("input", updatePriceRange);
  }
  if (maxInput) {
    maxInput.addEventListener("input", updatePriceRange);
  }

  updatePriceRange();
});

// filter-hotel-card
document.addEventListener("DOMContentLoaded", () => {
  const normalizeText = (text) =>
    text ? text.replace(/\s|\./g, "").normalize("NFKD").toLowerCase() : "";

  const selectedStars = new Set();
  const selectedServices = new Set();
  let hotelNameQuery = "";

  const hotelNameInput = document.querySelector(".hotel-name-input");
  const starInputs = document.querySelectorAll(".star-hotel-input");
  const serviceInputs = document.querySelectorAll(".filter-hotel-services");
  const minRange = document.getElementById("minRange");
  const maxRange = document.getElementById("maxRange");
  const minValueSpan = document.getElementById("minValue");
  const maxValueSpan = document.getElementById("maxValue");

  const hotelCards = document.querySelectorAll(".hotel-card");

  const parsePrice = (text) => parseInt(text.replace(/[^\d]/g, ""), 10) || 0;

  const allPrices = Array.from(hotelCards)
    .map((card) => {
      const priceElem = card.querySelector(".hotel-card-price");
      return priceElem ? parsePrice(priceElem.textContent) : 0;
    })
    .filter((p) => p > 0);

  const REAL_MIN = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const REAL_MAX = allPrices.length > 0 ? Math.max(...allPrices) : 0;

  let realMin = REAL_MIN;
  let realMax = REAL_MAX;

  function updateFilterCount() {
    const filterCountEl = document.getElementById("filterBtnCountHotel");
    const filterBtn = document.getElementById("filterBtnHotel");
    const filterIcon = document.getElementById("filterIconHotel");

    if (!filterCountEl || !filterBtn || !filterIcon) return;

    let count = 0;

    if (selectedStars.size > 0) count++;
    if (selectedServices.size > 0) count++;
    if (realMin > REAL_MIN || realMax < REAL_MAX) count++;
    if (hotelNameQuery.trim() !== "") count++; 

    if (count > 0) {
      filterCountEl.classList.remove("hidden");
      filterCountEl.classList.add("flex");
      filterCountEl.textContent = count;

      filterBtn.classList.remove("bg-white");
      filterBtn.classList.add(
        "bg-primary-500",
        "shadow-small-btn-shadow",
        "text-white"
      );

      filterIcon.querySelectorAll("path, ellipse").forEach((el) => {
        el.setAttribute("stroke", "#11C086");
      });
    } else {
      filterCountEl.classList.add("hidden");
      filterCountEl.classList.remove("flex");
      filterCountEl.textContent = "";

      filterBtn.classList.remove(
        "bg-primary-500",
        "shadow-small-btn-shadow",
        "text-white"
      );
      filterBtn.classList.add("bg-white");

      filterIcon.querySelectorAll("path, ellipse").forEach((el) => {
        el.setAttribute("stroke", "#33363F");
      });
    }
  }

  function filterCardsExtended() {
    hotelCards.forEach((card) => {
      const starElems = card.querySelectorAll(".hotel-card-star");
      const serviceElems = card.querySelectorAll(".hotel-card-service");
      const hotelNameElem = card.querySelector(".hotel-card-title");
      const priceElem = card.querySelector(".hotel-card-price");

      const cardStars = Array.from(starElems).map((el) =>
        normalizeText(el.textContent)
      );

      const cardServices = Array.from(serviceElems).map((el) =>
        normalizeText(el.textContent)
      );

      const cardHotelName = normalizeText(hotelNameElem?.textContent);
      const cardPrice = priceElem ? parsePrice(priceElem.textContent) : 0;

      const starMatch =
        selectedStars.size === 0 ||
        cardStars.some((star) => selectedStars.has(star));

      const serviceMatch =
        selectedServices.size === 0 ||
        cardServices.some((service) => selectedServices.has(service));

      const nameMatch =
        !hotelNameQuery ||
        cardHotelName.includes(normalizeText(hotelNameQuery));

      const priceMatch = cardPrice >= realMin && cardPrice <= realMax;

      card.style.display =
        starMatch && serviceMatch && nameMatch && priceMatch ? "flex" : "none";
    });

    updateFilterCount();
  }

  starInputs.forEach((el) => {
    el.addEventListener("click", () => {
      const wrapper = el.closest(".star-hotel-wrapper");
      const rawText = wrapper?.querySelector(".star-hotel")?.textContent || "";
      const match = normalizeText(rawText).match(/(\d+)ستاره/);
      const label = match ? match[0] : "";

      if (!label) return;

      const isActive = selectedStars.has(label);
      el.classList.toggle("bg-primary-500", !isActive);
      el.classList.toggle("border-primary-500", !isActive);

      isActive ? selectedStars.delete(label) : selectedStars.add(label);
      filterCardsExtended();
    });
  });

  serviceInputs.forEach((el) => {
    el.addEventListener("click", () => {
      const labelElem = el.querySelector(".filter-hotel-services-name");
      const label = normalizeText(
        labelElem ? labelElem.textContent : el.textContent
      );

      const isActive = selectedServices.has(label);
      el.classList.toggle("text-primary-500", !isActive);
      el.classList.toggle("border-primary-500", !isActive);

      isActive ? selectedServices.delete(label) : selectedServices.add(label);
      filterCardsExtended();
    });
  });

  if (hotelNameInput) {
    hotelNameInput.addEventListener("input", () => {
      hotelNameQuery = hotelNameInput.value;
      filterCardsExtended();
    });
  }

  function updatePriceValues() {
    if (!minRange || !maxRange || !minValueSpan || !maxValueSpan) return;

    let min = parseInt(minRange.value);
    let max = parseInt(maxRange.value);

    if (min > max) [min, max] = [max, min];

    realMin = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * min) / 100);
    realMax = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * max) / 100);

    minValueSpan.textContent = realMin.toLocaleString("fa-IR");
    maxValueSpan.textContent = realMax.toLocaleString("fa-IR");

    filterCardsExtended();
  }

  if (minRange) minRange.addEventListener("input", updatePriceValues);
  if (maxRange) maxRange.addEventListener("input", updatePriceValues);

  updatePriceValues();
  filterCardsExtended();
});

// faq-box
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const box = event.target.closest(".faq-box");
    if (!box) return;

    const answer = box.querySelector(".faq-answer");
    const icon = box.querySelector(".faq-btn");
    const iconPath = box.querySelector(".faq-btn path");
    const title = box.querySelector("h2");
    const blackIcon = box.querySelector(".icon-plus-circle");
    const whiteIcon = box.querySelector(".icon-plus-circle-white");

    document.querySelectorAll(".faq-box").forEach((otherBox) => {
      if (otherBox !== box) {
        const otherAnswer = otherBox.querySelector(".faq-answer");
        const otherIcon = otherBox.querySelector(".faq-btn");
        const otherIconPath = otherBox.querySelector(".faq-btn path");
        const otherTitle = otherBox.querySelector("h2");
        const otherBlackIcon = otherBox.querySelector(".icon-plus-circle");
        const otherWhiteIcon = otherBox.querySelector(
          ".icon-plus-circle-white"
        );

        if (otherAnswer) {
          otherAnswer.classList.remove(
            "opacity-100",
            "scale-y-100",
            "max-h-96",
            "mt-2"
          );
          otherAnswer.classList.add("opacity-0", "scale-y-0", "max-h-0");
        }

        otherBox.style.backgroundColor = "";
        otherBox.style.border = "";

        if (otherIcon) {
          otherIcon.classList.remove("rotate-180");
        }

        if (otherIconPath) {
          otherIconPath.setAttribute("stroke", "#1E2128");
        }

        if (otherTitle) {
          otherTitle.style.color = "";
        }

        if (otherBlackIcon && otherWhiteIcon) {
          otherBlackIcon.classList.remove("hidden");
          otherWhiteIcon.classList.add("hidden");
        }
      }
    });

    const isOpen = answer.classList.contains("scale-y-100");

    if (!isOpen) {
      answer.classList.remove("opacity-0", "scale-y-0", "max-h-0");
      answer.classList.add("opacity-100", "scale-y-100", "max-h-96", "mt-2");

      box.style.backgroundColor = "var(--primary-500)";
      box.style.border = "none";

      if (title) {
        title.style.color = "var(--secondary-500)";
      }

      if (iconPath) {
        iconPath.setAttribute("stroke", "var(--secondary-500)");
      }

      if (icon) {
        icon.classList.add("rotate-180");
      }

      if (blackIcon && whiteIcon) {
        blackIcon.classList.add("hidden");
        whiteIcon.classList.remove("hidden");
      }
    } else {
      answer.classList.remove("opacity-100", "scale-y-100", "max-h-96", "mt-2");
      answer.classList.add("opacity-0", "scale-y-0", "max-h-0");

      box.style.backgroundColor = "";
      box.style.border = "";

      if (title) {
        title.style.color = "";
      }

      if (iconPath) {
        iconPath.setAttribute("stroke", "#1E2128");
      }

      if (icon) {
        icon.classList.remove("rotate-180");
      }

      if (blackIcon && whiteIcon) {
        blackIcon.classList.remove("hidden");
        whiteIcon.classList.add("hidden");
      }
    }
  });
});

// travel-box
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const box = event.target.closest(".travel-box");
    if (!box) return;

    const wrapper = box.closest(".travel-wrapper");
    const answer = wrapper.querySelector(".travel-answer");
    const iconPath = box.querySelector(".travel-btn path");
    const title = box.querySelector("h2");

    const orangeSun = box.querySelector(".orange-sun");
    const whiteSun = box.querySelector(".white-sun");

    document.querySelectorAll(".travel-wrapper").forEach((otherWrapper) => {
      if (otherWrapper !== wrapper) {
        const otherAnswer = otherWrapper.querySelector(".travel-answer");
        const otherIconPath = otherWrapper.querySelector(".travel-btn path");
        const otherTitle = otherWrapper.querySelector("h2");
        const otherBox = otherWrapper.querySelector(".travel-box");
        const otherOrangeSun = otherWrapper.querySelector(".orange-sun");
        const otherWhiteSun = otherWrapper.querySelector(".white-sun");

        otherAnswer?.classList.remove("opacity-100", "scale-y-100", "mt-2");
        otherAnswer?.classList.add("opacity-0", "scale-y-0", "max-h-0");
        otherAnswer.style.maxHeight = "";

        otherIconPath?.setAttribute("stroke", "#1E2128");
        otherTitle && (otherTitle.style.color = "");
        otherBox && (otherBox.style.backgroundColor = "");
        otherBox && (otherBox.style.border = "1px solid #E5E7EB");
        otherWrapper.style.border = "none";

        if (otherOrangeSun) {
          otherOrangeSun.classList.remove("hidden");
          otherOrangeSun.classList.add("block");
        }
        if (otherWhiteSun) {
          otherWhiteSun.classList.remove("block");
          otherWhiteSun.classList.add("hidden");
        }
      }
    });

    const isOpen = !answer.classList.contains("max-h-0");

    if (!isOpen) {
      answer.classList.remove("opacity-0", "scale-y-0", "max-h-0");
      answer.classList.add("opacity-100", "scale-y-100", "mt-2");
      answer.style.maxHeight = answer.scrollHeight + "px";

      box.style.backgroundColor = "var(--primary-500)";
      box.style.border = "none";
      wrapper.style.border = "2px solid #D7DBE1";

      iconPath?.setAttribute("stroke", "var(--secondary-500)");
      title && (title.style.color = "var(--secondary-500)");

      if (orangeSun) {
        orangeSun.classList.remove("block");
        orangeSun.classList.add("hidden");
      }
      if (whiteSun) {
        whiteSun.classList.remove("hidden");
        whiteSun.classList.add("block");
      }
    } else {
      answer.classList.remove("opacity-100", "scale-y-100", "mt-2");
      answer.classList.add("opacity-0", "scale-y-0", "max-h-0");
      answer.style.maxHeight = null;

      box.style.backgroundColor = "";
      box.style.border = "1px solid #E5E7EB";
      wrapper.style.border = "none";

      iconPath?.setAttribute("stroke", "#1E2128");
      title && (title.style.color = "");

      if (orangeSun) {
        orangeSun.classList.remove("hidden");
        orangeSun.classList.add("block");
      }
      if (whiteSun) {
        whiteSun.classList.remove("block");
        whiteSun.classList.add("hidden");
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const priceButton = document.getElementById("priceToggleButton");
  const priceMenu = document.getElementById("priceDropdownMenu");
  const priceIcon = document.getElementById("priceToggleIcon");
  const priceOptions = document.querySelectorAll(".price-option");
  const tourCards = Array.from(document.querySelectorAll(".tourL-tour-card"));

  let isOpen = false;

  function extractCleanPrice(priceText) {
    return parseInt(priceText.replace(/[.,\/\s]+/g, ""));
  }

  if (priceButton && priceMenu && priceIcon) {
    priceButton.addEventListener("click", () => {
      isOpen = !isOpen;

      if (isOpen) {
        priceMenu.classList.remove("hidden");
        priceMenu.classList.add("flex");

        priceIcon.classList.add("rotate-180", "text-primary-500");
        priceIcon.classList.remove("text-[#1E2128]");

        priceButton.classList.add(
          "bg-primary-100",
          "text-primary-500",
          "border-primary-500"
        );
        priceButton.classList.remove("border-gray-50");
      } else {
        priceMenu.classList.remove("flex");
        priceMenu.classList.add("hidden");

        priceIcon.classList.remove("rotate-180", "text-primary-500");
        priceIcon.classList.add("text-[#1E2128]");

        priceButton.classList.remove(
          "bg-primary-100",
          "text-primary-500",
          "border-primary-500"
        );
        priceButton.classList.add("border-gray-50");
      }
    });

    document.addEventListener("click", (event) => {
      const isClickInsideButton = priceButton.contains(event.target);
      const isClickInsideMenu = priceMenu.contains(event.target);

      if (!isClickInsideButton && !isClickInsideMenu && isOpen) {
        isOpen = false;
        priceMenu.classList.remove("flex");
        priceMenu.classList.add("hidden");

        priceIcon.classList.remove("rotate-180", "text-primary-500");
        priceIcon.classList.add("text-[#1E2128]");

        priceButton.classList.remove(
          "bg-primary-100",
          "text-primary-500",
          "border-primary-500"
        );
        priceButton.classList.add("border-gray-50");
      }
    });
  }

  priceOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedFilter = option.dataset.price;

      document.querySelectorAll(".price-check-icon").forEach((icon) => {
        icon.classList.remove("bg-primary-500", "text-white");
      });

      const icon = option.querySelector(".price-check-icon");
      icon.classList.add("bg-primary-500", "text-white");

      if (tourCards.length && selectedFilter) {
        let sortedCards = [...tourCards];

        sortedCards.sort((a, b) => {
          const priceA = extractCleanPrice(
            a.querySelector(".tourL-tour-price").innerText
          );
          const priceB = extractCleanPrice(
            b.querySelector(".tourL-tour-price").innerText
          );

          if (selectedFilter === "high-to-low") return priceB - priceA;
          if (selectedFilter === "low-to-high") return priceA - priceB;
          if (selectedFilter === "best-price") return priceA - priceB;
        });

        const parent = tourCards[0].parentElement;
        parent.innerHTML = "";
        sortedCards.forEach((card) => {
          card.classList.remove("hidden");
          card.classList.add("flex");
          parent.appendChild(card);
        });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".content-container");

  containers.forEach((container) => {
    const btn = container.querySelector(".toggle-btn");
    const shadow = container.querySelector(".white-shadow");

    btn.addEventListener("click", () => {
      const isOpen = container.classList.contains("open");
      const isMobile = window.innerWidth < 1024;
      const closedHeight = isMobile ? "620px" : "30rem";

      if (isOpen) {
        const contentHeight = container.scrollHeight;
        container.style.maxHeight = contentHeight + "px";
        requestAnimationFrame(() => {
          container.style.maxHeight = closedHeight;
          container.classList.remove("open");
        });

        if (shadow) shadow.classList.add("bg-white-shadow");
        btn.textContent = "مشاهده همه";
      } else {
        const contentHeight = container.scrollHeight;
        container.style.maxHeight = closedHeight;
        container.classList.add("open");

        requestAnimationFrame(() => {
          container.style.maxHeight = contentHeight + "px";
        });

        if (shadow) shadow.classList.remove("bg-white-shadow");
        btn.textContent = "مشاهده کمتر";
      }
    });
  });
});
