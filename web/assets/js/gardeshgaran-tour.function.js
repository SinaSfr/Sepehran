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

// const onProcessedHotelsImg = async (args) => {
//   console.log(args);
//   try {
//     const response = args.response;
//     if (response.status === 200) {
//       const responseJson = await response.json();
//       if (!responseJson) return;

//       document
//         .querySelectorAll(".tourInventory__details__item__img")
//         .forEach((img) => {
//           const pageName = img.dataset.pagename;
//           const hotelId = parseInt(img.dataset.id);

//           console.log(`Checking hotelId: ${hotelId}`);

//           const matched = responseJson.find(
//             (item) => parseInt(item.usedforid) === hotelId
//           );

//           if (!matched) {
//             console.warn(`No matched image for hotelId ${hotelId}`);
//             return;
//           }

//           console.log(`Matched image for ${hotelId}:`, matched);

//           // آپدیت تصویر
//           img.src = `/${matched.originalImage}`;

//           // اگر والد مستقیم تصویر لینک نیست، wrap کنیم
//           if (img.parentElement.tagName.toLowerCase() !== "a") {
//             const figure = img.closest("figure");
//             const figcaption = figure
//               ? figure.querySelector("figcaption")
//               : null;

//             const imgClone = img.cloneNode(true);
//             const a = document.createElement("a");
//             a.href = `/${pageName}?id=${hotelId}`;
//             a.appendChild(imgClone);
//             if (figcaption) a.appendChild(figcaption.cloneNode(true));

//             figure.innerHTML = "";
//             figure.appendChild(a);

//             // const a = document.createElement("a");
//             // a.href = `/${pageName}?id=${hotelId}`;

//             // a.appendChild(img);
//             // if (figcaption) a.appendChild(figcaption);

//             // if (figure) {
//             //     figure.innerHTML = "";
//             //     figure.appendChild(a);
//             // }
//           }
//         });
//     }
//   } catch (err) {
//     console.error(
//       "onProcessedHotelsImg=" + (err.lineNumber || "-") + "," + err.message
//     );
//   }
// };

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
                <img src="${img}"
                  class="h-40 object-cover rounded-xl" alt="" width="253" height="164"
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
                    <span class="font-semibold text-sm hotel-card-service">B.B</span>
                    <span class="text-xs font-light">breakfast &amp; bed</span>
                  </div>
                  <span class="text-xs font-light w-2/5 leading-5" data-value="${escapeHtml(
                    hotel.service.vid
                  )}">
                    ${escapeHtml(serviceHTML)}
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

const renderServiceHotel = async (element) => {
  try {
    if (element) {
      switch (parseInt(element.service.vid)) {
        case 0:
          sevice = "-";
          title = "";
          break;

        case 1654:
          sevice = "O.R";
          title = "بدون وعده غذایی";
          break;

        case 1655:
          sevice = "B.B";
          title = "همراه یک وعده صبحانه در روز";
          break;

        case 1656:
          sevice = "H.B";
          title = "همراه دو وعده غذایی صبحانه و شام ";
          break;

        case 1657:
          sevice = "F.B";
          title = "همراه سه وعده غذایی صبحانه و ناهار و شام";
          break;

        case 1658:
          sevice = "ALL";
          title = "تمام وعده های غذایی و امکانات هتل";
          break;

        case 1659:
          sevice = "U.ALL";
          title =
            "تمام وعده های غذایی و امکانات هتل در هر زمان از اقامت بدون محدودیت";
          break;

        case 1660:
          sevice = "Maximum All Inclusive";
          title =
            "تمام وعده های غذایی و امکانات هتل در هر زمان از اقامت بدون محدودیت";
          break;
      }
      return `${sevice}${title}`;
    }
  } catch (err) {
    console.error("renderServiceHotel=" + err.lineNumber + "," + err.message);
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
    if (
      document
        .querySelector(".tourExecution__container__origins")
        .querySelectorAll(".execution__details__path__item")[0]
    ) {
      document
        .querySelector(".tourExecution__container__origins")
        .querySelector(".origins__city").textContent = document
        .querySelector(".tourExecution__container__origins")
        .querySelectorAll(".execution__details__path__item")[0]
        .querySelector(".details__city").textContent;
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
        $bc.setSource("db.airlinesOriginsGallery", {
          ids: ids,
          run: true,
        });
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
    if (
      document
        .querySelector(".tourExecution__container__destinations")
        .querySelectorAll(".execution__details__path__item")[0]
    ) {
      document
        .querySelector(".tourExecution__container__destinations")
        .querySelector(".destinations__city").textContent = document
        .querySelector(".tourExecution__container__destinations")
        .querySelectorAll(".execution__details__path__item")[0]
        .querySelector(".details__city").textContent;
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
