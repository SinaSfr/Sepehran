// document.addEventListener("DOMContentLoaded", function () {
//   const form = document.querySelector(".search-form");
//   const input = form.querySelector(".search-input");
//   const button = form.querySelector(".search-toggle");

//   let expanded = false;

//   function openForm() {
//     form.classList.add("w-48");
//     form.classList.remove("w-10");

//     input.classList.add("w-full", "pr-3");
//     input.classList.remove("w-0", "pr-0");

//     expanded = true;
//     input.focus();
//   }

//   function closeForm() {
//     form.classList.remove("w-48");
//     form.classList.add("w-10");

//     input.classList.remove("w-full", "pr-3");
//     input.classList.add("w-0", "pr-0");

//     expanded = false;
//   }

//   button.addEventListener("click", (e) => {
//     e.stopPropagation();
//     if (!expanded) {
//       openForm();
//     } else if (!input.value.trim()) {
//       input.focus();
//     } else {
//       form.submit();
//     }
//   });

//   document.addEventListener("click", () => {
//     if (expanded) {
//       closeForm();
//     }
//   });

//   form.addEventListener("submit", (e) => {
//     if (!input.value.trim()) {
//       e.preventDefault();
//       input.focus();
//     }
//   });
// });
// document.addEventListener("DOMContentLoaded", function () {
//   const toggleBtn = document.querySelector(".tour-category-header");
//   const menu = document.querySelector(".menu-tour-category");
//   const icon = document.querySelector(".drop-down-tour-category");

//   toggleBtn.addEventListener("click", () => {
//     menu.classList.toggle("opacity-0");
//     menu.classList.toggle("scale-95");
//     menu.classList.toggle("pointer-events-none");
//     icon.classList.toggle("rotate-180");
//   });

//   document.addEventListener("click", (e) => {
//     if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
//       menu.classList.add("opacity-0");
//       menu.classList.add("scale-95");
//       menu.classList.add("pointer-events-none");
//       icon.classList.remove("rotate-180");
//     }
//   });
// });

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

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const box = event.target.closest(".faq-box");
    if (!box) return;

    const answer = box.querySelector(".faq-answer");
    const icon = box.querySelector(".faq-btn");

    document.querySelectorAll(".faq-box").forEach((otherBox) => {
      if (otherBox !== box) {
        const otherAnswer = otherBox.querySelector(".faq-answer");
        const otherIcon = otherBox.querySelector(".faq-btn");

        if (otherAnswer) {
          otherAnswer.classList.remove(
            "opacity-100",
            "scale-y-100",
            "max-h-96",
            "mt-2"
          );
          otherAnswer.classList.add("opacity-0", "scale-y-0", "max-h-0");
        }

        if (otherIcon) {
          otherIcon.classList.remove("rotate-180");
        }

        otherBox.style.backgroundColor = "";
        otherBox.style.border = "";
      }
    });

    const isOpen = answer.classList.contains("scale-y-100");

    if (!isOpen) {
      answer.classList.remove("opacity-0", "scale-y-0", "max-h-0");
      answer.classList.add("opacity-100", "scale-y-100", "max-h-96", "mt-2");
      box.style.backgroundColor = "var(--primary-50)";
      box.style.border = "2px solid var(--primary-200)";

      if (icon) {
        icon.classList.add("rotate-180");
      }
    } else {
      answer.classList.remove("opacity-100", "scale-y-100", "max-h-96", "mt-2");
      answer.classList.add("opacity-0", "scale-y-0", "max-h-0");
      box.style.backgroundColor = "";
      box.style.border = "";

      if (icon) {
        icon.classList.remove("rotate-180");
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
