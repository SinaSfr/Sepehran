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

window.addEventListener("DOMContentLoaded", () => {
  const REAL_MIN = 10000000;
  const REAL_MAX = 100000000;

  const minInput = document.getElementById("minRange");
  const maxInput = document.getElementById("maxRange");
  const rangeTrack = document.getElementById("rangeTrack");
  const minValText = document.getElementById("minValue");
  const maxValText = document.getElementById("maxValue");

  if (!minInput || !maxInput || !rangeTrack || !minValText || !maxValText) {
    return;
  }

  function formatPrice(val) {
    return val.toLocaleString("fa-IR");
  }

  function updateTrack() {
    let min = parseInt(minInput.value);
    let max = parseInt(maxInput.value);

    if (min > max) {
      [min, max] = [max, min];
    }

    const left = 100 - max;
    const width = max - min;

    rangeTrack.style.left = `${left}%`;
    rangeTrack.style.width = `${width}%`;

    const realMin = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * min) / 100);
    const realMax = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * max) / 100);

    minValText.textContent = formatPrice(realMin);
    maxValText.textContent = formatPrice(realMax);
  }

  minInput.addEventListener("input", updateTrack);
  maxInput.addEventListener("input", updateTrack);

  updateTrack();
});

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
    if (items[visibleCount].classList.contains("hidden")) {
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

// faq-box
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const box = event.target.closest(".faq-box");
    if (!box) return;

    const answer = box.querySelector(".faq-answer");
    const icon = box.querySelector(".faq-btn");
    const iconPath = box.querySelector(".faq-btn path");
    const title = box.querySelector("h2");

    // بستن بقیه
    document.querySelectorAll(".faq-box").forEach((otherBox) => {
      if (otherBox !== box) {
        const otherAnswer = otherBox.querySelector(".faq-answer");
        const otherIcon = otherBox.querySelector(".faq-btn");
        const otherIconPath = otherBox.querySelector(".faq-btn path");
        const otherTitle = otherBox.querySelector("h2");

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
      }
    });

    // باز یا بسته کردن مورد کلیک‌شده
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
  const starHotelInput = document.querySelectorAll(".star-hotel-input");

  starHotelInput.forEach((inp) => {
    inp.addEventListener("click", function () {
      inp.classList.toggle("bg-primary-500");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const starHotelInput = document.querySelectorAll(".airline-hotel-input");

  starHotelInput.forEach((inp) => {
    inp.addEventListener("click", function () {
      inp.classList.toggle("bg-primary-500");
    });
  });
});

document.addEventListener("DOMContentLoaded", function(){
  const priceButton = document.getElementById('priceToggleButton');
  const priceMenu = document.getElementById('priceDropdownMenu');
  const priceIcon = document.getElementById('priceToggleIcon');
  
  let isOpen = false;

  if (priceButton && priceMenu && priceIcon) {
    priceButton.addEventListener('click', () => {
      isOpen = !isOpen;
    
      if (isOpen) {
        priceMenu.classList.remove('hidden');
        priceMenu.classList.add('flex');

        priceIcon.classList.add('rotate-180', 'text-primary-500');
        priceIcon.classList.remove('text-[#1E2128]');

        priceButton.classList.add('bg-primary-100', 'text-primary-500', 'border-primary-500');
        priceButton.classList.remove('border-gray-50');
      } else {
        priceMenu.classList.remove('flex');
        priceMenu.classList.add('hidden');

        priceIcon.classList.remove('rotate-180', 'text-primary-500');
        priceIcon.classList.add('text-[#1E2128]');

        priceButton.classList.remove('bg-primary-100', 'text-primary-500', 'border-primary-500');
        priceButton.classList.add('border-gray-50');
      }
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".content-container");

  containers.forEach((container) => {
    const btn = container.querySelector(".toggle-btn");
    const shadow = container.querySelector(".white-shadow");

    btn.addEventListener("click", () => {
      const isOpen = container.classList.contains("open");

      if (isOpen) {
        const contentHeight = container.scrollHeight;
        container.style.maxHeight = contentHeight + "px";
        requestAnimationFrame(() => {
          container.style.maxHeight = "30rem";
          container.classList.remove("open");
        });

        if (shadow) shadow.classList.add("bg-white-shadow");
        btn.textContent = "مشاهده همه";
      } else {
        const contentHeight = container.scrollHeight;
        container.style.maxHeight = "30rem";
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
