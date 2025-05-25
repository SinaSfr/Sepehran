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

document.addEventListener("DOMContentLoaded", () => {
  const min = document.getElementById("minRange");
  const max = document.getElementById("maxRange");
  const minVal = document.getElementById("minValue");
  const maxVal = document.getElementById("maxValue");
  const track = document.getElementById("rangeTrack");

  if (!min || !max || !minVal || !maxVal || !track) {
    console.warn("🔧 Some range elements are missing in the DOM.");
    return;
  }

  const updateTrack = () => {
    let minValue = Number(min.value);
    let maxValue = Number(max.value);

    if (minValue >= maxValue) {
      minValue = maxValue - 1;
      min.value = minValue;
    }

    if (maxValue <= minValue) {
      maxValue = minValue + 1;
      max.value = maxValue;
    }

    const percentMin = (minValue / 100) * 100;
    const percentMax = (maxValue / 100) * 100;

    track.style.left = `${percentMin}%`;
    track.style.width = `${percentMax - percentMin}%`;

    minVal.textContent = minValue;
    maxVal.textContent = maxValue;
  };

  min.addEventListener("input", updateTrack);
  max.addEventListener("input", updateTrack);
  updateTrack(); // Run once initially
});


document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.checkboxList');
    const toggleBtn = document.querySelector('.toggleBtn');
    const items = container ? Array.from(container.children) : [];

    const visibleCount = 3; // تعداد آیتم‌هایی که اول نمایش داده میشه

    function initializeItems() {
      items.forEach((item, index) => {
        if (index >= visibleCount) {
          item.classList.add('hidden', 'opacity-0');
          item.classList.add('transition-opacity', 'duration-500');
        } else {
          item.classList.remove('hidden', 'opacity-0');
        }
      });
    }

    function toggleItems() {
      if (!container || !toggleBtn) return;

      const isCollapsed = items[visibleCount]?.classList.contains('hidden');

      if (isCollapsed) {
        // نمایش بقیه آیتم‌ها با انیمیشن
        for(let i = visibleCount; i < items.length; i++) {
          items[i].classList.remove('hidden');
          setTimeout(() => items[i].classList.remove('opacity-0'), 10);
        }
        toggleBtn.textContent = 'مشاهده کمتر';
      } else {
        // مخفی کردن بقیه آیتم‌ها با انیمیشن
        for(let i = visibleCount; i < items.length; i++) {
          items[i].classList.add('opacity-0');
          setTimeout(() => items[i].classList.add('hidden'), 500);
        }
        toggleBtn.textContent = 'مشاهده بیشتر';
      }
    }

    // مقداردهی اولیه
    initializeItems();

    toggleBtn?.addEventListener('click', toggleItems);
});
