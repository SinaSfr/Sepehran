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

  function formatPrice(val) {
    return val.toLocaleString("fa-IR");
  }

  function updateTrack() {
    let min = parseInt(minInput.value);
    let max = parseInt(maxInput.value);

    // جلوگیری از تداخل دو دسته
    if (min > max) {
      [min, max] = [max, min];
    }

    // موقعیت نوار سبز بین دو thumb
    const percentMin = (min / 100) * minInput.offsetWidth;
    const percentMax = (max / 100) * maxInput.offsetWidth;

    rangeTrack.style.left = `${min}%`;
    rangeTrack.style.width = `${max - min}%`;

    // مقدارهای واقعی (ریالی)
    const realMin = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * min / 100));
    const realMax = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * max / 100));

    minValText.textContent = formatPrice(realMin);
    maxValText.textContent = formatPrice(realMax);
  }

  minInput.addEventListener("input", updateTrack);
  maxInput.addEventListener("input", updateTrack);

  // مقدار اولیه
  updateTrack();
});


document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".checkboxList");
  const toggleBtn = document.querySelector(".toggle-btn");
  const items = container ? Array.from(container.querySelectorAll(".airline-item")) : [];
  const visibleCount = 3;

  function hideItems() {
    items.forEach((item, index) => {
      if (index >= visibleCount) {
        item.classList.add("hidden", "opacity-0", "max-h-0", "overflow-hidden");
      } else {
        item.classList.remove("hidden", "opacity-0", "max-h-0", "overflow-hidden");
      }
    });
  }

  function showItems() {
    items.forEach((item, index) => {
      if (index >= visibleCount) {
        item.classList.remove("hidden", "max-h-0", "overflow-hidden");
        // برای انیمیشن محو شدن کامل، بعد از کمی delay، opacity-0 رو حذف می‌کنیم
        setTimeout(() => item.classList.remove("opacity-0"), 10);
      }
    });
  }

  function toggleItems() {
    if (items[visibleCount].classList.contains("hidden")) {
      showItems();
      toggleBtn.textContent = "مشاهده کمتر";
    } else {
      // اول opacity رو اضافه می‌کنیم برای انیمیشن محو شدن
      items.forEach((item, index) => {
        if (index >= visibleCount) {
          item.classList.add("opacity-0");
        }
      });
      // بعد از انیمیشن، کلاس‌های مخفی رو اضافه می‌کنیم
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

