"use strict";

const cardHeaderImg = document.querySelectorAll(".card-header_img");
const cardName = document.querySelectorAll(".card-name");
const cardDescr = document.querySelectorAll(".card-descr");
const toggleLabel = document.querySelectorAll(".toggle__label");
const toggleInput = document.querySelectorAll(".toggle-input");
const removeBtn = document.querySelectorAll(".remove-btn");
const themeLogo = document.querySelector(".theme-logo");
const themeBtn = document.querySelector(".theme-btn");
const filterButtons = document.querySelectorAll(".filter-btn");
const cardCont = document.querySelectorAll(".card-container");
const extensionList = document.querySelector(".extension-list");
const overLay = document.querySelector(".overlay");
const root = document.documentElement;
let filterActiveState = "all";

// Initializing card details
function init() {
  const data = [
    {
      logo: "./assets/images/logo-devlens.svg",
      name: "DevLens",
      description:
        "Quickly inspect page layouts and visualize element boundaries.",
      isActive: true,
    },
    {
      logo: "./assets/images/logo-style-spy.svg",
      name: "StyleSpy",
      description: "Instantly analyze and copy CSS from any webpage element.",
      isActive: true,
    },
    {
      logo: "./assets/images/logo-speed-boost.svg",
      name: "SpeedBoost",
      description:
        "Optimizes browser resource usage to accelerate page loading.",
      isActive: false,
    },
    {
      logo: "./assets/images/logo-json-wizard.svg",
      name: "JSONWizard",
      description:
        "Formats, validates, and prettifies JSON responses in-browser.",
      isActive: true,
    },
    {
      logo: "./assets/images/logo-tab-master-pro.svg",
      name: "TabMaster Pro",
      description: "Organizes browser tabs into groups and sessions.",
      isActive: true,
    },
    {
      logo: "./assets/images/logo-viewport-buddy.svg",
      name: "ViewportBuddy",
      description:
        "Simulates various screen resolutions directly within the browser.",
      isActive: false,
    },
    {
      logo: "./assets/images/logo-markup-notes.svg",
      name: "Markup Notes",
      description:
        "Enables annotation and notes directly onto webpages for collaborative debugging.",
      isActive: true,
    },
    {
      logo: "./assets/images/logo-grid-guides.svg",
      name: "GridGuides",
      description:
        "Overlay customizable grids and alignment guides on any webpage.",
      isActive: false,
    },
    {
      logo: "./assets/images/logo-palette-picker.svg",
      name: "Palette Picker",
      description: "Instantly extracts color palettes from any webpage.",
      isActive: true,
    },
    {
      logo: "./assets/images/logo-link-checker.svg",
      name: "LinkChecker",
      description: "Scans and highlights broken links on any page.",
      isActive: true,
    },
    {
      logo: "./assets/images/logo-dom-snapshot.svg",
      name: "DOM Snapshot",
      description: "Capture and export DOM structures quickly.",
      isActive: false,
    },
    {
      logo: "./assets/images/logo-console-plus.svg",
      name: "ConsolePlus",
      description:
        "Enhanced developer console with advanced filtering and logging.",
      isActive: true,
    },
  ];

  for (let i = 0; i < data.length; i++) {
    cardHeaderImg[i].src = data[i].logo;
    cardName[i].textContent = data[i].name;
    cardDescr[i].textContent = data[i].description;
    removeBtn[i].setAttribute("aria-label", `Remove ${data[i].name} extension`);
    toggleLabel[i].textContent = `Enable or disable ${data[i].name} extension`;
    toggleLabel[i].id = `toggle-label${i}`;
    toggleInput[i].setAttribute("aria-labelledby", `${toggleLabel[i].id}`);
    toggleInput[i].checked = data[i].isActive;
    toggleInput[i].name = data[i].name;
  }

  if (getComputedStyle(root).getPropertyValue("--theme") === '"light"') {
    themeLogo.src = "assets/images/icon-moon.svg";
  }
}
init();

// Storing theme in localStorage
function getTheme(currentTHeme) {
  localStorage.setItem("theme", currentTHeme);
}
function applyTheme() {
  const activeTheme = localStorage.getItem("theme") ?? `"dark"`;
  root.style.setProperty("--theme", activeTheme);
  themeLogo.src = `assets/images/icon-${
    activeTheme !== `"light"` ? "sun" : "moon"
  }.svg`;
}

document.onload = applyTheme();

// ----------- Set Theme function
function changeTheme(current) {
  const isLight = current === `"light"`;
  root.style.setProperty("--theme", `${isLight ? `"dark"` : `"light"`}`);
  themeLogo.src = `assets/images/icon-${isLight ? "sun" : "moon"}.svg`;
}

extensionList.style.setProperty("view-transition-name", "extension");

themeBtn.addEventListener("click", (eventObject) => {
  // remove separate transition
  extensionList.style.removeProperty("view-transition-name");

  const currentTHeme = getComputedStyle(root).getPropertyValue("--theme");
  getTheme(currentTHeme === `"light"` ? `"dark"` : `"light"`);

  const getLastClick = eventObject;

  // get clicked coordinates
  const x = getLastClick?.clientX ?? innerWidth;
  const y = getLastClick?.clientY ?? 0;

  // Get the distance to the furthest corner
  const circleRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  // fallback for startViewTransition
  if (!document.startViewTransition) {
    changeTheme(currentTHeme);
    return;
  }
  const viewTransition = document.startViewTransition(() =>
    changeTheme(currentTHeme)
  );

  viewTransition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0 at ${x}px ${y}px)`,
          `circle(${circleRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 800,
        easing: "ease-in",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });

  viewTransition.finished.then(() =>
    extensionList.style.setProperty("view-transition-name", "extension")
  );
});

// filter btns logic
filterButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    this.classList.add("active");
    this.setAttribute("aria-pressed", "true");
    filterActiveState = this.dataset.filter;

    filterButtons.forEach((x) => {
      if (x.dataset.filter !== filterActiveState) {
        x.classList.remove("active");
        x.setAttribute("aria-pressed", "false");
      }
    });

    update(filterActiveState);
  });
});

// update filter function
function update(btnState) {
  function updateArea() {
    for (let i = 0; i < cardCont.length; i++) {
      const isChecked = toggleInput[i].checked;
      const shouldHide =
        (btnState === "active" && !isChecked) ||
        (btnState === "inactive" && isChecked);

      cardCont[i].classList.toggle("hidden", shouldHide);
    }
    if (extensionList.children.length !== 1) overlay(btnState);
  }

  if (!document.startViewTransition) {
    // fallBack for view transition
    updateArea(filterActiveState);
  }

  document.startViewTransition(() => updateArea(filterActiveState));
}

// toggle btns logic
toggleInput.forEach((toggle) => {
  toggle.addEventListener("change", () => {
    update(filterActiveState);
  });
});

// hiding or showing Overlay function
function overlay(state) {
  let isChecked = 0;
  for (let i = 0; i < cardCont.length; i++) {
    toggleInput[i].checked ? isChecked++ : isChecked;
  }
  const shouldShow =
    (state === "active" && isChecked === 0) ||
    (state === "inactive" && isChecked === cardCont.length);

  overLay.classList.toggle("hidden", !shouldShow);
  overLay.textContent = `All ${state} themes have been removed.`;
}

// remove btns logic
removeBtn.forEach((remove, i) => {
  remove.addEventListener("click", function () {
    cardCont[i].remove();

    if (extensionList.children.length === 1) {
      overLay.classList.remove("hidden");
      overLay.textContent = "All themes have been removed.";
    }
  });
});

