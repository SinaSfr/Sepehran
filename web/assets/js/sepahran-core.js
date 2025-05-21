document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".search-form");
  const input = form.querySelector(".search-input");
  const button = form.querySelector(".search-toggle");

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
    const toggleBtn = document.querySelector('.tour-category-header');
    const menu = document.querySelector('.menu-tour-category');
    const icon = document.querySelector('.drop-down-tour-category');

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