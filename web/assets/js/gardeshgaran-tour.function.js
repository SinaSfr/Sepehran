const callbackSourceExecutionPlanTypesView = async (args) => {
  try {
    const resultJson = args.source?.rows;
    const originsSourceArray = new Array();
    const destinationsSourceArray = new Array();
    let originsRownumber = 1;
    let destinationsRownumber = 1;
    if (resultJson[0]) {
      document
        .querySelector(".tourExecution__container")
        .classList.remove("hidden");
      for (const element of resultJson[0].execution.origins) {
        const sourceObj = new Object();
        sourceObj["rownumber"] = originsRownumber;
        sourceObj["info"] = element;
        sourceObj["len"] = resultJson[0].execution.origins.length;
        originsSourceArray.push(sourceObj);
        originsRownumber++;
      }
      for (const element of resultJson[0].execution.destinations) {
        const sourceObj = new Object();
        sourceObj["rownumber"] = destinationsRownumber;
        sourceObj["info"] = element;
        sourceObj["len"] = resultJson[0].execution.destinations.length;
        destinationsSourceArray.push(sourceObj);
        destinationsRownumber++;
      }
    }

    setTimeout(() => {
      $bc.setSource("refresh.executionPlanTypesOrigins", originsSourceArray);
      $bc.setSource(
        "refresh.executionPlanTypesDestinations",
        destinationsSourceArray
      );
    }, "10");
  } catch (err) {
    console.error(
      "callbackSourceExecutionPlanTypesView=" +
        err.lineNumber +
        "," +
        err.message
    );
  }
};

const onProcessedHotelsImg = async (args) => {
  console.log(args);
  try {
    const response = args.response;
    if (response.status === 200) {
      const responseJson = await response.json();
      if (!responseJson) return;

      document
        .querySelectorAll(".tourInventory__details__item__img")
        .forEach((img) => {
          const pageName = img.dataset.pagename;
          const hotelId = parseInt(img.dataset.id);

          console.log(`Checking hotelId: ${hotelId}`);

          const matched = responseJson.find(
            (item) => parseInt(item.usedforid) === hotelId
          );

          if (!matched) {
            console.warn(`No matched image for hotelId ${hotelId}`);
            return;
          }

          console.log(`Matched image for ${hotelId}:`, matched);

          img.src = `/${matched.originalImage}`;
        });
    }
  } catch (err) {
    console.error(
      "onProcessedHotelsImg=" + (err.lineNumber || "-") + "," + err.message
    );
  }
};

const renderTransportationImage = async (element) => {
  try {
    if (element) {
      if (element.info.transportation.id) {
        return ` <img src="" data-id="${element.info.transportation.id}"
                  class="transportation__img h-10 object-cover" alt="${element.info.transportation.name}" width="135"
                    height="40" loading="lazy" />`;
      }
    }
  } catch (err) {
    console.error(
      "renderTransportationName=" + err.lineNumber + "," + err.message
    );
  }
};

const onProcessedAirlinesOriginsImg = async (args) => {
  const response = args.response;
  if (response.status == 200) {
    const responseJson = await response.json();
    if (responseJson) {
      document
        .querySelector(".tourExecution__container__origins")
        .querySelectorAll(".transportation__img")
        .forEach((e) => {
          for (const item of responseJson) {
            if (parseInt(e.dataset.id) == parseInt(item.usedforid)) {
              e.setAttribute("src", `/${item.originalImage}`);
            }
          }
        });
    }
  }
};
const onProcessedAirlinesDestinationsImg = async (args) => {
  const response = args.response;
  if (response.status == 200) {
    const responseJson = await response.json();
    if (responseJson) {
      document
        .querySelector(".tourExecution__container__destinations")
        .querySelectorAll(".transportation__img")
        .forEach((e) => {
          for (const item of responseJson) {
            if (parseInt(e.dataset.id) == parseInt(item.usedforid)) {
              e.setAttribute("src", `/${item.originalImage}`);
            }
          }
        });
    }
  }
};

const onrenderedInventoryView = async () => {
  try {
    let ids = [];
    document
      .querySelectorAll(".tourInventory__details__item__img")
      .forEach((e) => {
        if (e.dataset.id !== "") {
          ids.push(e.dataset.id);
        }
      });
    if (ids.length > 0) {
      $bc.setSource("db.hotelGallery", {
        ids: ids,
        run: true,
      });
    }
  } catch (err) {
    console.error(
      "onrenderedInventoryView=" + err.lineNumber + "," + err.message
    );
  }
};

const renderHotels = async (element, type) => {
  try {
    if (element) {
      let output = "";
      let index = 0;
      const escapeHtml = (unsafe) => {
        return (unsafe || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };

      for (const item of element.hotelinfo[0].hotels) {
        let img = `/common/images/img-symbol-sign.jpg`;
        if (
          document.querySelector(".layout__body__container").dataset.noimgsign
            .length > 0
        ) {
          img = `/images/${
            document.querySelector(".layout__body__container").dataset.noimgsign
          }`;
        }

        const hotel = item.hotel;
        const cleanHotelName = (() => {
          const div = document.createElement("div");
          div.innerHTML = hotel.hotelname;
          return div.textContent || div.innerText || "";
        })();

        const pageName = escapeHtml(
          document.querySelector(".layout__body__container").dataset
            .pagenameinventory
        );

        const hotelStar = item.hotel.star === "" ? 0 : item.hotel.star;
        const serviceHTML = await renderServiceHotel(hotel);

        output += `
          <div class="flex items-stretch justify-between w-full" data-index="${index}">
            <div class="flex items-center gap-6">
              <div class="shadow-card-shadow">
                <img src="${img}" data-id="${
          hotel.hotelid
        }" data-pageName="${pageName}"
                  class="tourInventory__details__item__img h-40 object-cover rounded-xl" alt="" width="253" height="164"
                  loading="lazy" />
              </div>
              <div class="flex flex-col gap-3">
                <h2 class="font-extrabold hotel-card-title">${escapeHtml(
                  cleanHotelName
                )}</h2>
                <div class="flex items-center gap-3 text-sm font-bold">
                  <span class="hotel-card-star" data-value="${hotelStar}">
                    ${hotelStar} ستاره
                  </span>
                  <div class="flex items-center">${await renderHotelRate(
                    hotel
                  )}</div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex flex-col gap-2 items-center bg-gray-50 p-2 rounded-lg">
                    <span class="font-semibold text-sm hotel-card-service">${escapeHtml(
                      serviceHTML.service
                    )}</span>
                    <span class="text-xs font-light">${escapeHtml(
                      serviceHTML.english
                    )}</span>
                  </div>
                  <span class="text-xs font-light w-2/5 leading-5" data-value="${escapeHtml(
                    hotel.service.vid
                  )}">
                    ${escapeHtml(serviceHTML.title)}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex flex-col justify-center gap-2 w-40">
              <div class="text-xs font-light text-center">
                برای دریافت اطاعات هتل
                میتوانید با شماره
                <span class="text-sm font-bold">021-91009292</span> تماس بگیرید
              </div>
              <a href="/${pageName}?id=${hotel.hotelid}" data-id="${
          hotel.hotelid
        }" data-pageName="${pageName}"
                class="group flex items-center justify-center gap-2 font-extrabold border border-gray-100 rounded-xl w-40 h-[73px] transition-all duration-300 hover:bg-primary-500 hover:text-white hover:shadow-btn-shadow">
                جزئیات هتل
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path class="transition-all duration-300 group-hover:stroke-white"
                    d="M17 6.5L11 12.5L17 18.5" stroke="#1E2128" stroke-width="2" />
                  <path class="transition-all duration-300 group-hover:stroke-white"
                    d="M6 7.5V17.5" stroke="#1E2128" stroke-width="2" />
                </svg>
              </a>
            </div>
          </div>`;
        index++;
      }

      return output;

      
    }
  } catch (err) {
    console.error("renderHotels=" + err.lineNumber + "," + err.message);
  }
};

const renderPriceInfo = async (element, type) => {
  try {
    if (element) {
      if (type == "doublecost") {
        let output = "";
        for (const item of element.priceinfo.doublecost) {
          output += `<div class="flex items-center gap-2 text-sm font-bold">
                                <span class="text-[36px] font-extrabold text-primary-500 hotel-card-price">${new Intl.NumberFormat().format(
                                  item.doublecost.doublecostf
                                )}</span>
                                ${
                                  item.doublecost.doubleunit.length == 0
                                    ? ``
                                    : item.doublecost.doubleunit
                                }</div>`;
        }

        return output;
      } else if (type == "singlecost") {
        let output = "";
        for (const item of element.priceinfo.singlecost) {
          output += `<div class="flex items-center gap-2 text-sm font-bold">
                                <span class="text-[36px] font-extrabold text-primary-500 hotel-card-price">${new Intl.NumberFormat().format(
                                  item.singlecost.singlecostf
                                )}</span>
                                ${
                                  item.singlecost.singleunit.length == 0
                                    ? ``
                                    : item.singlecost.singleunit
                                }</div>`;
        }

        return output;
      } else if (type == "childwithbed") {
        let output = "";
        for (const item of element.priceinfo.childwithbed) {
          output += `<div class="flex items-center gap-2 text-sm font-bold">
                                <span class="text-[36px] font-extrabold text-primary-500 hotel-card-price">${new Intl.NumberFormat().format(
                                  item.childwithbed.childwithbedf
                                )}</span>
                                ${
                                  item.childwithbed.childwithbedunit.length == 0
                                    ? ``
                                    : item.childwithbed.childwithbedunit
                                }</div>`;
        }

        return output;
      } else if (type == "childwithoutbed") {
        let output = "";
        for (const item of element.priceinfo.childwithoutbed) {
          output += `<div class="flex items-center gap-2 text-sm font-bold">
                                <span class="text-[36px] font-extrabold text-primary-500 hotel-card-price">${new Intl.NumberFormat().format(
                                  item.childwithoutbed.childwithoutbedf
                                )}</span>
                                ${
                                  item.childwithoutbed.childwithoutbedunit
                                    .length == 0
                                    ? ``
                                    : item.childwithoutbed.childwithoutbedunit
                                }</div>`;
        }

        return output;
      }
    }
  } catch (err) {
    console.error("renderPriceInfo=" + err.lineNumber + "," + err.message);
  }
};

const serviceDefinitions = {
  0: { code: "-", titleFa: "", titleEn: "" },
  1654: { code: "O.R", titleFa: "بدون وعده غذایی", titleEn: "Room Only" },
  1655: {
    code: "B.B",
    titleFa: "همراه یک وعده صبحانه در روز",
    titleEn: "Breakfast & Bed",
  },
  1656: {
    code: "H.B",
    titleFa: "همراه دو وعده غذایی صبحانه و شام",
    titleEn: "Breakfast & Dinner",
  },
  1657: {
    code: "F.B",
    titleFa: "همراه سه وعده غذایی صبحانه و ناهار و شام",
    titleEn: "Breakfast, Lunch & Dinner",
  },
  1658: {
    code: "ALL",
    titleFa: "تمام وعده‌های غذایی و امکانات هتل",
    titleEn: "All Inclusive",
  },
  1659: {
    code: "U.ALL",
    titleFa:
      "تمام وعده‌های غذایی و امکانات هتل در هر زمان از اقامت بدون محدودیت",
    titleEn: "Ultra All Inclusive",
  },
  1660: {
    code: "Maximum All Inclusive",
    titleFa:
      "تمام وعده‌های غذایی و امکانات هتل در هر زمان از اقامت بدون محدودیت",
    titleEn: "Maximum All Inclusive",
  },
};

const renderServiceHotel = async (element) => {
  try {
    if (element && element.service && element.service.vid) {
      const vid = parseInt(element.service.vid);
      const service = serviceDefinitions[vid];

      if (service) {
        return {
          service: service.code,
          title: service.titleFa,
          english: service.titleEn,
        };
      }
    }

    return {
      service: "-",
      title: "",
      english: "",
    };
  } catch (err) {
    console.error("renderServiceHotel=" + err.lineNumber + "," + err.message);
    return {
      service: "-",
      title: "",
      english: "",
    };
  }
};

const renderHotelRate = async (element) => {
  try {
    if (element) {
      let output = "";
      let i = 0;
      for (; i < element.star == "" ? 0 : element.star; ) {
        output += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.3075 7.21986C10.9496 5.61918 11.2706 4.81883 11.7922 4.70791C11.9293 4.67874 12.0711 4.67874 12.2082 4.70791C12.7298 4.81883 13.0508 5.61918 13.6929 7.21986C14.058 8.13014 14.2406 8.58528 14.5822 8.89485C14.678 8.98168 14.782 9.05901 14.8928 9.12576C15.2876 9.36374 15.7805 9.40788 16.7663 9.49617C18.4351 9.64562 19.2695 9.72034 19.5243 10.1961C19.577 10.2946 19.6129 10.4013 19.6304 10.5117C19.7149 11.0447 19.1015 11.6028 17.8747 12.7189L17.534 13.0288C16.9605 13.5506 16.6737 13.8115 16.5078 14.1372C16.4083 14.3325 16.3416 14.5428 16.3104 14.7598C16.2582 15.1215 16.3422 15.5 16.5102 16.2569L16.5702 16.5274C16.8714 17.8849 17.022 18.5637 16.834 18.8973C16.6651 19.197 16.3541 19.3889 16.0105 19.4053C15.6279 19.4236 15.089 18.9844 14.011 18.106C13.3008 17.5273 12.9457 17.2379 12.5515 17.1249C12.1912 17.0216 11.8092 17.0216 11.4489 17.1249C11.0547 17.2379 10.6996 17.5273 9.98941 18.106C8.91144 18.9844 8.37245 19.4236 7.98993 19.4053C7.64633 19.3889 7.33528 19.197 7.16642 18.8973C6.97842 18.5637 7.12902 17.8849 7.43022 16.5274L7.49023 16.2569C7.65818 15.5 7.74216 15.1215 7.69004 14.7598C7.65878 14.5428 7.59207 14.3325 7.49257 14.1372C7.32669 13.8115 7.03992 13.5506 6.46637 13.0288L6.1257 12.7189C4.89891 11.6028 4.28552 11.0447 4.36999 10.5117C4.38749 10.4013 4.42337 10.2946 4.47614 10.1961C4.73094 9.72034 5.56532 9.64562 7.23408 9.49617C8.21986 9.40788 8.71276 9.36374 9.1076 9.12576C9.21834 9.05901 9.32236 8.98168 9.41818 8.89485C9.75979 8.58528 9.94236 8.13014 10.3075 7.21986Z" fill="#FFBC2C" stroke="#FFBC2C" stroke-width="2"/>
</svg>
`;
        i++;
      }
      let j = 0;
      for (; j < 5 - parseInt(element.star == "" ? 0 : element.star); ) {
        output += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
        <path
            d="M10.3075 7.71986C10.9496 6.11918 11.2706 5.31883 11.7922 5.20791C11.9293 5.17874 12.0711 5.17874 12.2082 5.20791C12.7298 5.31883 13.0508 6.11918 13.6929 7.71986C14.058 8.63014 14.2406 9.08528 14.5822 9.39485C14.678 9.48168 14.782 9.55901 14.8928 9.62576C15.2876 9.86374 15.7805 9.90788 16.7663 9.99617C18.4351 10.1456 19.2695 10.2203 19.5243 10.6961C19.577 10.7946 19.6129 10.9013 19.6304 11.0117C19.7149 11.5447 19.1015 12.1028 17.8747 13.2189L17.534 13.5288C16.9605 14.0506 16.6737 14.3115 16.5078 14.6372C16.4083 14.8325 16.3416 15.0428 16.3104 15.2598C16.2582 15.6215 16.3422 16 16.5102 16.7569L16.5702 17.0274C16.8714 18.3849 17.022 19.0637 16.834 19.3973C16.6651 19.697 16.3541 19.8889 16.0105 19.9053C15.6279 19.9236 15.089 19.4844 14.011 18.606C13.3008 18.0273 12.9457 17.7379 12.5515 17.6249C12.1912 17.5216 11.8092 17.5216 11.4489 17.6249C11.0547 17.7379 10.6996 18.0273 9.98941 18.606C8.91144 19.4844 8.37245 19.9236 7.98993 19.9053C7.64633 19.8889 7.33528 19.697 7.16642 19.3973C6.97842 19.0637 7.12902 18.3849 7.43022 17.0274L7.49023 16.7569C7.65818 16 7.74216 15.6215 7.69004 15.2598C7.65878 15.0428 7.59207 14.8325 7.49257 14.6372C7.32669 14.3115 7.03992 14.0506 6.46637 13.5288L6.1257 13.2189C4.89891 12.1028 4.28552 11.5447 4.36999 11.0117C4.38749 10.9013 4.42337 10.7946 4.47614 10.6961C4.73094 10.2203 5.56532 10.1456 7.23408 9.99617C8.21986 9.90788 8.71276 9.86374 9.1076 9.62576C9.21834 9.55901 9.32236 9.48168 9.41818 9.39485C9.75979 9.08528 9.94236 8.63014 10.3075 7.71986Z"
            fill="#D7DBE1" stroke="#D7DBE1" stroke-width="2" />
                                                                </svg>`;
        j++;
      }
      return output;
    }
  } catch (err) {
    console.error("renderHotelRate=" + err.lineNumber + "," + err.message);
  }
};

const onrenderedExecutionOrigins = async () => {
  try {
    const originElement = document.querySelector(
      ".tourExecution__container__origins .execution__details__path__item .details__city"
    );
    if (originElement) {
      let origin = originElement.textContent;
      console.log(origin);

      let ids = [];
      document
        .querySelector(".tourExecution__container__origins")
        .querySelectorAll(".transportation__img")
        .forEach((e) => {
          if (e.dataset.id !== "") {
            ids.push(e.dataset.id);
          }
        });
      if (ids.length > 0) {
        $bc.setSource("db.airlinesOriginsGallery", { ids: ids, run: true });
      }
    }
  } catch (err) {
    console.error(
      "onrenderedExecutionOrigins=" + err.lineNumber + "," + err.message
    );
  }
};

const onrenderedExecutionDestinations = async () => {
  try {
    const destinationElement = document.querySelector(
      ".tourExecution__container__destinations .execution__details__path__item .details__city"
    );
    if (destinationElement) {
      let destination = destinationElement.textContent;
      console.log(destination);

      let ids = [];
      document
        .querySelector(".tourExecution__container__destinations")
        .querySelectorAll(".transportation__img")
        .forEach((e) => {
          ids.push(e.dataset.id);
        });
      if (ids.length > 0) {
        $bc.setSource("db.airlinesDestinationsGallery", {
          ids: ids,
          run: true,
        });
      }
    }
  } catch (err) {
    console.error(
      "onrenderedExecutionDestinations=" + err.lineNumber + "," + err.message
    );
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const breadcrumbContainer = document.querySelector(".breadcrumb");
  const items = breadcrumbContainer.querySelectorAll("li");
  const uniqueLinks = new Map();

  items.forEach((li) => {
    const link = li.querySelector("a");
    if (link) {
      const text = link.textContent.trim();
      if (!uniqueLinks.has(text)) {
        uniqueLinks.set(text, li);
      } else {
        li.remove();
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  function toPersianOrdinal(num) {
    const map = {
      1: "اول",
      2: "دوم",
      3: "سوم",
      4: "چهارم",
      5: "پنجم",
      6: "ششم",
      7: "هفتم",
      8: "هشتم",
      9: "نهم",
      10: "دهم",
      11: "یازدهم",
      12: "دوازدهم",
      13: "سیزدهم",
      14: "چهاردهم",
      15: "پانزدهم",
      16: "شانزدهم",
      17: "هفدهم",
      18: "هجدهم",
      19: "نوزدهم",
      20: "بیستم",
    };
    return map[num] || num + "‌ام";
  }

  const wrappers = document.querySelectorAll(".travel-wrapper");

  wrappers.forEach((wrapper, index) => {
    const title = wrapper.querySelector(".travel-title");
    if (title) {
      title.textContent = `روز ${toPersianOrdinal(index + 1)}`;
    }
  });
});

document.querySelectorAll("nav li[data-target]").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = item.getAttribute("data-target");
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      const yOffset = -100;
      const y =
        targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  });
});


// filter-hotel-card
function initializeHotelFilters() {
  const normalizeText = (text) =>
    text ? text.replace(/\s|\./g, "").normalize("NFKD").toLowerCase() : "";

  const selectedStars = new Set();
  const selectedServices = new Set();
  let hotelNameQuery = "";

  const hotelNameInput = document.querySelector(".hotel-name-input");
  const starInputs = document.querySelectorAll(".star-hotel-input");
  const serviceInputs = document.querySelectorAll(".filter-hotel-services");
  const minRange = document.getElementById("hotel-minRange");
  const maxRange = document.getElementById("hotel-maxRange");
  const minValueSpan = document.getElementById("hotel-minValue");
  const maxValueSpan = document.getElementById("hotel-maxValue");
  const rangeTrack = document.getElementById("hotel-rangeTrack");

  const hotelCards = document.querySelectorAll(".hotel-card");

  const formatPrice = (val) => val.toLocaleString("fa-IR");

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
    if (
      !minRange ||
      !maxRange ||
      !minValueSpan ||
      !maxValueSpan ||
      !rangeTrack
    ) {
      return;
    }

    const rawMin = parseInt(minRange.value) || 0;
    const rawMax = parseInt(maxRange.value) || 0;

    realMin = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * rawMin) / 100);
    realMax = Math.floor(REAL_MIN + ((REAL_MAX - REAL_MIN) * rawMax) / 100);

    minValueSpan.textContent = formatPrice(Math.min(realMin, realMax));
    maxValueSpan.textContent = formatPrice(Math.max(realMin, realMax));

    const right = Math.min(rawMin, rawMax);
    const width = Math.abs(rawMax - rawMin);

    rangeTrack.style.right = `${right}%`;
    rangeTrack.style.width = `${width}%`;

    filterCardsExtended();
  }

  if (minRange) {
    minRange.value = minRange.value || "0";
    minRange.addEventListener("input", updatePriceValues);
  }
  if (maxRange) {
    maxRange.value = maxRange.value || "100";
    maxRange.addEventListener("input", updatePriceValues);
  }

  setTimeout(updatePriceValues, 100);
  filterCardsExtended();
}

const waitUntilHotelCardsLoaded = (callback, maxTries = 20, interval = 300) => {
  let tries = 0;
  const timer = setInterval(() => {
    const cards = document.querySelectorAll(".hotel-card");
    if (cards.length > 0) {
      clearInterval(timer);
      callback();
    } else {
      tries++;
      if (tries >= maxTries) {
        clearInterval(timer);
      }
    }
  }, interval);
};

waitUntilHotelCardsLoaded(() => {
  initializeHotelFilters(); 
});