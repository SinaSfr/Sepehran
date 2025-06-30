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

// const onrenderedInventoryView = async () => {
//   try {
//     // بررسی اینکه آیا المان‌هایی با کلاس tourInventory__details__item__img وجود دارند
//     if (
//       document.querySelectorAll(".tourInventory__details__item__img").length ===
//       0
//     ) {
//       // HTML مورد نظر برای درج
//       const newHtml = `
//         <div class="w-full max-lg:mt-5">
//             <a href="tel:${
//               document.querySelector(".company__info__tel").innerText
//             }"
//                 class="bg-white text-primary border border-solid border-primary rounded-md text-sm py-3 block text-center md:w-full mb-3 hover:bg-primary hover:text-white">
//                 ${
//                   page_lang === "fa"
//                     ? "مشاوره تلفنی"
//                     : page_lang === "en"
//                     ? "Phone Consultation"
//                     : page_lang === "ar"
//                     ? "استشارة هاتفية"
//                     : "Phone Consultation"
//                 }
//             </a>
//             <button type="button" onclick="renderTourForm(this)"
//                 class="group bg-black text-white rounded-md text-sm w-full h-11 relative">
//                 <svg class="transition-all absolute left-3 top-4 group-hover:left-2"
//                     width="11" height="12"
//                     viewBox="0 0 11 12" fill="none"
//                     xmlns="http://www.w3.org/2000/svg">
//                     <path
//                         d="M0.46967 5.46967C0.176777 5.76256 0.176777 6.23744 0.46967 6.53033L5.24264 11.3033C5.53553 11.5962 6.01041 11.5962 6.3033 11.3033C6.59619 11.0104 6.59619 10.5355 6.3033 10.2426L2.06066 6L6.3033 1.75736C6.59619 1.46447 6.59619 0.989593 6.3033 0.696699C6.01041 0.403806 5.53553 0.403806 5.24264 0.696699L0.46967 5.46967ZM11 5.25L1 5.25V6.75L11 6.75V5.25Z"
//                         fill="white" />
//                 </svg><span
//                     class="bg-primary py-3 px-3 rounded-md md:w-36 absolute top-0 right-0">
//                     ${
//                       page_lang === "fa"
//                         ? "رزرو آنلاین"
//                         : page_lang === "en"
//                         ? "Online Booking"
//                         : page_lang === "ar"
//                         ? "الحجز عبر الإنترنت"
//                         : "Online Booking"
//                     }
//                 </span></button>
//         </div>`;

//       const tourContactInfo = document.querySelector(".tour_contact_info");

//       if (tourContactInfo) {
//         tourContactInfo.insertAdjacentHTML("beforebegin", newHtml);
//       }
//     }

//     let ids = [];
//     document
//       .querySelectorAll(".tourInventory__details__item__img")
//       .forEach((e) => {
//         if (e.dataset.id !== "") {
//           ids.push(e.dataset.id);
//         }
//       });
//     if (ids.length > 0) {
//       $bc.setSource("db.hotelGallery", {
//         ids: ids,
//         run: true,
//       });
//     }
//   } catch (err) {
//     console.error(
//       "onrenderedInventoryView=" + err.lineNumber + "," + err.message
//     );
//   }
// };

const renderHotels = async (element, type) => {
  try {
    if (element) {
      let output = "";
      let index = 0;
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
        output += `  <div class="flex items-stretch justify-between" data-index="${index}">
                                                 <div class="flex items-center gap-6">
                                                                                     <div class="shadow-card-shadow">
                                        <img src="${img}"
                                            class="h-40 object-cover rounded-xl" alt="" width="253" height="164"
                                            loading="lazy" data-pageName="${
          document.querySelector(".layout__body__container").dataset
            .pagenameinventory
        }">
                                    </div>                     
                                        <div class="flex flex-col gap-3">
                                        <h2 class="font-extrabold hotel-card-title">${item.hotel.hotelname}</h2>
                                        <div class="flex items-center gap-3 text-sm font-bold">
                                            <span class="hotel-card-star" data-value="${item.hotel.star == "" ? 0 : item.hotel.star}">${await renderHotelRate(item.hotel)}</span>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M10.3075 7.21986C10.9496 5.61918 11.2706 4.81883 11.7922 4.70791C11.9293 4.67874 12.0711 4.67874 12.2082 4.70791C12.7298 4.81883 13.0508 5.61918 13.6929 7.21986C14.058 8.13014 14.2406 8.58528 14.5822 8.89485C14.678 8.98168 14.782 9.05901 14.8928 9.12576C15.2876 9.36374 15.7805 9.40788 16.7663 9.49617C18.4351 9.64562 19.2695 9.72034 19.5243 10.1961C19.577 10.2946 19.6129 10.4013 19.6304 10.5117C19.7149 11.0447 19.1015 11.6028 17.8747 12.7189L17.534 13.0288C16.9605 13.5506 16.6737 13.8115 16.5078 14.1372C16.4083 14.3325 16.3416 14.5428 16.3104 14.7598C16.2582 15.1215 16.3422 15.5 16.5102 16.2569L16.5702 16.5274C16.8714 17.8849 17.022 18.5637 16.834 18.8973C16.6651 19.197 16.3541 19.3889 16.0105 19.4053C15.6279 19.4236 15.089 18.9844 14.011 18.106C13.3008 17.5273 12.9457 17.2379 12.5515 17.1249C12.1912 17.0216 11.8092 17.0216 11.4489 17.1249C11.0547 17.2379 10.6996 17.5273 9.98941 18.106C8.91144 18.9844 8.37245 19.4236 7.98993 19.4053C7.64633 19.3889 7.33528 19.197 7.16642 18.8973C6.97842 18.5637 7.12902 17.8849 7.43022 16.5274L7.49023 16.2569C7.65818 15.5 7.74216 15.1215 7.69004 14.7598C7.65878 14.5428 7.59207 14.3325 7.49257 14.1372C7.32669 13.8115 7.03992 13.5506 6.46637 13.0288L6.1257 12.7189C4.89891 11.6028 4.28552 11.0447 4.36999 10.5117C4.38749 10.4013 4.42337 10.2946 4.47614 10.1961C4.73094 9.72034 5.56532 9.64562 7.23408 9.49617C8.21986 9.40788 8.71276 9.36374 9.1076 9.12576C9.21834 9.05901 9.32236 8.98168 9.41818 8.89485C9.75979 8.58528 9.94236 8.13014 10.3075 7.21986Z"
                                                    fill="#FFBC2C" stroke="#FFBC2C" stroke-width="2" />
                                            </svg>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <div class="flex flex-col gap-2 items-center bg-gray-50 p-2 rounded-lg">
                                                <span class="font-semibold text-sm hotel-card-service">B.B</span>
                                                <span class="text-xs font-light">breakfast & bed</span>
                                            </div>
                                            <span class="text-xs font-light w-2/5 leading-5" data-value="${item.hotel.service.vid}">${await renderServiceHotel(item.hotel,element.booking)} </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col justify-center gap-2 w-40">
                                    <div class="text-xs font-light text-center">
                                        برای دریافت اطاعات هتل
                                        میتوانید با شماره
                                        <span class="text-sm font-bold">021-91009292</span> تماس بگیرید
                                    </div>
                                    <a href="" data-id="${item.hotel.hotelid}"
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
                                </div>`;
        index++;
      }

      return output;
    }
  } catch (err) {
    console.error("renderHotels=" + err.lineNumber + "," + err.message);
  }
};

// const renderPriceInfo = async (element, type) => {
//   try {
//     if (element) {
//       if (type == "doublecost") {
//         let output = "";
//         for (const item of element.priceinfo.doublecost) {
//           output += `<div class="tourInventory__details__item__double text-module-gray-4">
//                                 <span class="tourInventory__details__item__price sm:text-xl font-bold">${new Intl.NumberFormat().format(
//                                   item.doublecost.doublecostf
//                                 )}</span>
//                                 ${
//                                   item.doublecost.doubleunit.length == 0
//                                     ? ``
//                                     : `<span class="tourInventory__details__item__unit sm:text-base max-sm:text-sm mr-1">${item.doublecost.doubleunit}</span>`
//                                 }</div>`;
//         }

//         return output;
//       } else if (type == "singlecost") {
//         let output = "";
//         for (const item of element.priceinfo.singlecost) {
//           output += `<div class="tourInventory__details__item__single text-module-gray-4">
//                                 <span class="tourInventory__details__item__price sm:text-xl font-bold">${new Intl.NumberFormat().format(
//                                   item.singlecost.singlecostf
//                                 )}</span>
//                                 ${
//                                   item.singlecost.singleunit.length == 0
//                                     ? ``
//                                     : `<span class="tourInventory__details__item__unit sm:text-base max-sm:text-sm mr-1">${item.singlecost.singleunit}</span>`
//                                 }</div>`;
//         }

//         return output;
//       } else if (type == "childwithbed") {
//         let output = "";
//         for (const item of element.priceinfo.childwithbed) {
//           output += `<div class="tourInventory__details__item__wBed text-module-gray-4">
//                                 <span class="tourInventory__details__item__price sm:text-xl font-bold">${new Intl.NumberFormat().format(
//                                   item.childwithbed.childwithbedf
//                                 )}</span>
//                                 ${
//                                   item.childwithbed.childwithbedunit.length == 0
//                                     ? ``
//                                     : `<span class="tourInventory__details__item__unit sm:text-base max-sm:text-sm mr-1">${item.childwithbed.childwithbedunit}</span>`
//                                 }</div>`;
//         }

//         return output;
//       } else if (type == "childwithoutbed") {
//         let output = "";
//         for (const item of element.priceinfo.childwithoutbed) {
//           output += `<div class="tourInventory__details__item__woBed text-module-gray-4">
//                                 <span class="tourInventory__details__item__price sm:text-xl font-bold">${new Intl.NumberFormat().format(
//                                   item.childwithoutbed.childwithoutbedf
//                                 )}</span>
//                                 ${
//                                   item.childwithoutbed.childwithoutbedunit
//                                     .length == 0
//                                     ? ``
//                                     : `<span class="tourInventory__details__item__unit sm:text-base max-sm:text-sm mr-1">${item.childwithoutbed.childwithoutbedunit}</span>`
//                                 }</div>`;
//         }

//         return output;
//       }
//     }
//   } catch (err) {
//     console.error("renderPriceInfo=" + err.lineNumber + "," + err.message);
//   }
// };

const renderPriceInfo = async (element, type) => {
  try {
    if (!element) return "";

    const renderBlock = (label, value, unitClass, unitText) => {
      return `
        <li class="relative flex flex-col gap-8 items-center vertical-border">
          <span class="text-sm font-semibold">${label}</span>
          <span class="flex items-center gap-2 text-sm font-bold">
            <span class="text-[36px] font-extrabold text-primary-500 hotel-card-price">${new Intl.NumberFormat().format(
              value
            )}</span>
            ${
              unitText
                ? `<span class="${unitClass}">${unitText}</span>`
                : "دلار"
            }
          </span>
        </li>`;
    };

    let output = "";

    switch (type) {
      case "doublecost":
        for (const item of element.priceinfo.doublecost) {
          output += renderBlock(
            "دوتخته",
            item.doublecost.doublecostf,
            "text-sm font-bold",
            item.doublecost.doubleunit || ""
          );
        }
        break;

      case "singlecost":
        for (const item of element.priceinfo.singlecost) {
          output += renderBlock(
            "تک تخته",
            item.singlecost.singlecostf,
            "text-sm font-bold",
            item.singlecost.singleunit || ""
          );
        }
        break;

      case "childwithbed":
        for (const item of element.priceinfo.childwithbed) {
          output += renderBlock(
            "کودک با تخت",
            item.childwithbed.childwithbedf,
            "text-sm font-bold",
            item.childwithbed.childwithbedunit || ""
          );
        }
        break;

      case "childwithoutbed":
        for (const item of element.priceinfo.childwithoutbed) {
          output += renderBlock(
            "کودک بدون تخت",
            item.childwithoutbed.childwithoutbedf,
            "text-sm font-bold",
            item.childwithoutbed.childwithoutbedunit || ""
          );
        }
        break;

      default:
        break;
    }

    return output;
  } catch (err) {
    console.error("renderPriceInfo=" + err.lineNumber + "," + err.message);
    return "";
  }
};

// const renderServiceHotel = async (element, booking) => {
//   try {
//     if (element) {
//       switch (parseInt(element.service.vid)) {
//         case 0:
//           sevice = "-";
//           title = "";
//           img = "";
//           break;
//         case 1654:
//           sevice = "O.R";
//           if (page_lang === "fa") {
//             title = "بدون وعده غذایی";
//           } else if (page_lang === "en") {
//             title = "No meal";
//           } else if (page_lang === "ar") {
//             title = "لا وجبة";
//           }

//           img = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path fill-rule="evenodd" clip-rule="evenodd" d="M4.23498 10.6181H7.32728C7.42925 10.6181 7.51163 10.5354 7.51004 10.4335C7.5045 10.0774 7.49625 9.7038 7.63651 9.3765C7.83682 8.90758 8.26513 8.53927 8.80975 8.36481C9.12821 8.2725 9.45316 8.2725 10.1002 8.2725H12.3092C12.9562 8.2725 13.2812 8.2725 13.5876 8.36112C14.1461 8.54019 14.5735 8.9085 14.7729 9.37835C14.913 9.70463 14.9042 10.0782 14.8984 10.4335C14.8968 10.5354 14.9792 10.6181 15.0812 10.6181H18.1753C18.4301 10.6181 18.6369 10.4113 18.6369 10.1565V7.13712C18.6369 6.41158 18.6369 6.04881 18.5122 5.70819C18.3036 5.12296 17.8439 4.65865 17.2375 4.42881C16.895 4.3125 16.5322 4.3125 15.8085 4.3125H6.60175C5.87713 4.3125 5.51436 4.3125 5.15805 4.43435C4.56636 4.65865 4.10759 5.12204 3.89713 5.70635C3.77344 6.04881 3.77344 6.4125 3.77344 7.13712V10.1565C3.77344 10.4113 3.98021 10.6181 4.23498 10.6181Z" fill="black"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M19.8537 12.8387C19.6562 12.2876 19.2306 11.8593 18.6796 11.6627C18.3639 11.5547 18.0353 11.5547 17.3799 11.5547H5.018C4.36353 11.5547 4.034 11.5547 3.71276 11.6655C3.16907 11.8584 2.74261 12.2858 2.54415 12.8368C2.42969 13.1535 2.42969 13.483 2.42969 14.1393V15.4233C2.42969 16.0851 2.42969 16.4175 2.54415 16.7341C2.74076 17.2796 3.16723 17.7042 3.70261 17.8935C3.86692 17.9553 4.034 17.9867 4.24353 18.0015V18.9947C4.24353 19.3768 4.55369 19.687 4.93584 19.687C5.318 19.687 5.62815 19.3768 5.62815 18.9947V18.0162H16.7706V18.9947C16.7706 19.3768 17.0808 19.687 17.4629 19.687C17.8451 19.687 18.1553 19.3768 18.1553 18.9947V18.0015C18.3629 17.9867 18.5273 17.9571 18.6851 17.8962C19.2325 17.7033 19.658 17.2787 19.8528 16.735C19.9682 16.4175 19.9682 16.0851 19.9682 15.4233V14.1393C19.9682 13.4821 19.9682 13.1535 19.8537 12.8387Z" fill="black"/>
// </svg>`;
//           break;
//         case 1655:
//           sevice = "B.B";
//           if (page_lang === "fa") {
//             title = "همراه یک وعده صبحانه در روز";
//           } else if (page_lang === "en") {
//             title = "No meal";
//           } else if (page_lang === "ar") {
//             title = "مع وجبة إفطار واحدة في اليوم";
//           }

//           img = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M7.85145 3.1977C8.12544 2.92371 8.12544 2.47949 7.85145 2.20549C7.57746 1.9315 7.13323 1.9315 6.85925 2.20549C6.05734 3.00739 6.05734 4.30619 6.85925 5.10809C7.11226 5.36062 7.11343 5.77208 6.85925 6.02626C6.58525 6.30025 6.58525 6.74448 6.85925 7.01847C7.13323 7.29246 7.57746 7.29246 7.85145 7.01847C8.65293 6.21699 8.65377 4.91717 7.85145 4.11588C7.59777 3.86194 7.59761 3.45154 7.85145 3.1977Z" fill="black"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0167 6.95312C10.9047 6.95312 10.0054 7.85416 10.0054 8.96439C10.0054 9.2702 10.0736 9.56014 10.1958 9.81975C8.81665 10.1922 7.60023 11.0085 6.71972 12.1018L6.72541 12.1096C6.50607 12.3912 6.24818 12.7972 6.0095 13.2938C5.65049 14.0406 5.33494 14.9922 5.25934 16.0327C5.22768 16.4686 5.23812 16.9201 5.30511 17.3786L5.3194 17.4016C5.38058 17.7931 5.47538 18.1737 5.60076 18.5403C5.61978 18.5917 5.63964 18.6431 5.66036 18.6945C5.66325 18.7017 5.66616 18.7089 5.66909 18.7161C5.71254 18.8226 5.7512 18.9237 5.78533 19.0195C6.14257 19.8511 6.66146 20.5978 7.30231 21.2185C7.8317 21.7302 8.53963 22.0022 9.26139 22.0022H14.7792C15.4886 22.0022 16.1946 21.7408 16.7231 21.2315C17.4273 20.5534 17.9859 19.7236 18.3458 18.795C19.4484 18.3829 20.4518 17.5437 21.101 16.5265C21.8226 15.3958 22.1596 13.9521 21.5843 12.5626C21.0846 11.3563 20.0273 10.7414 18.9343 10.6056C18.06 10.497 17.1272 10.6863 16.3495 11.1382C15.623 10.5363 14.7691 10.0833 13.835 9.82492C13.9587 9.56402 14.0279 9.27226 14.0279 8.96439C14.0279 7.85381 13.1272 6.95312 12.0167 6.95312ZM7.45377 13.4842C8.20711 12.2892 9.43202 11.4036 10.8407 11.1074C12.7435 10.7077 14.5221 11.3063 15.7454 12.4781C15.7774 12.517 15.8127 12.5515 15.8506 12.5817C16.121 12.8553 16.3621 13.1578 16.5689 13.4842H7.45377ZM18.8009 16.3522C18.8009 14.7812 18.2678 13.3394 17.3742 12.1936C17.811 12.0125 18.3008 11.9409 18.7614 11.9981C19.4495 12.0836 20.0159 12.4431 20.2879 13.0995C20.6409 13.9522 20.4678 14.9104 19.9182 15.7715C19.6159 16.2452 19.2157 16.6614 18.7719 16.9821C18.7911 16.7747 18.8009 16.5646 18.8009 16.3522ZM11.4086 8.96439C11.4086 8.62841 11.6804 8.35633 12.0167 8.35633C12.3523 8.35633 12.6247 8.62877 12.6247 8.96439C12.6247 9.29999 12.3523 9.57243 12.0167 9.57243C11.6804 9.57243 11.4086 9.30034 11.4086 8.96439Z" fill="black"/>
// <path d="M4.2771 15.7161C4.39856 14.6335 4.743 13.643 5.09624 12.8656C5.21297 12.6087 5.33066 12.375 5.44159 12.169L4.15319 11.4981C4.08649 11.4634 4.01239 11.4453 3.93718 11.4453H2.46773C2.29797 11.4453 2.14154 11.5373 2.059 11.6856C1.97647 11.834 1.98079 12.0154 2.0703 12.1596L4.2771 15.7161Z" fill="black"/>
// <path d="M4.43209 6.0258C4.15809 5.75181 3.71387 5.75181 3.43987 6.0258C3.16588 6.2998 3.16588 6.74402 3.43987 7.01801C3.69379 7.27193 3.69379 7.68227 3.43987 7.93619C3.16588 8.21018 3.16588 8.65442 3.43987 8.92841C3.71387 9.2024 4.15809 9.2024 4.43209 8.92841C5.23399 8.12651 5.23399 6.82771 4.43209 6.0258Z" fill="black"/>
// </svg>`;
//           break;
//         case 1656:
//           sevice = "H.B";
//           if (page_lang === "fa") {
//             title = "همراه دو وعده غذایی صبحانه و شام ";
//           } else if (page_lang === "en") {
//             title = "with two meals, breakfast and dinner";
//           } else if (page_lang === "ar") {
//             title = "مع وجبتين، الإفطار والعشاء";
//           }

//           img = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M6.15667 3.03914C6.17828 2.48728 5.74844 2.02239 5.19658 2.00078C4.64472 1.97917 4.17983 2.40903 4.15822 2.96089L3.95389 8.17889C3.95338 8.19192 3.95312 8.20497 3.95312 8.21801C3.95312 10.2194 5.33799 11.8969 7.20095 12.3464L7.20171 21.0001C7.20177 21.5524 7.64953 22.0001 8.20181 22C8.7541 22 9.20176 21.5522 9.20171 20.9999L9.20096 12.3465C11.0644 11.8969 12.4486 10.2193 12.4486 8.21801C12.4486 8.20503 12.4483 8.19205 12.4478 8.17907L12.2445 2.96107C12.223 2.40921 11.7582 1.97927 11.2063 2.00077C10.6544 2.02228 10.2245 2.48709 10.246 3.03896L10.4485 8.23573C10.439 9.46827 9.43701 10.4648 8.20088 10.4648C6.96555 10.4648 5.96276 9.46812 5.9532 8.23582L6.15667 3.03914Z" fill="black"/>
// <path d="M9.20312 3C9.20312 2.44772 8.75541 2 8.20312 2C7.65084 2 7.20312 2.44772 7.20312 3V7.78893C7.20312 8.34121 7.65084 8.78893 8.20312 8.78893C8.75541 8.78893 9.20312 8.34121 9.20312 7.78893V3Z" fill="black"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0407 3.02381C20.0401 2.49876 19.6348 2.06874 19.1203 2.02823C19.0906 2.02506 19.0603 2.02344 19.0297 2.02344C18.9574 2.02344 18.8872 2.03249 18.8202 2.04951C18.3735 2.15006 18.0401 2.54946 18.0407 3.0264C18.0415 3.62889 18.0422 4.6085 18.0427 5.80408C18.0427 5.80408 18.0509 6.11794 18.0429 6.2748C18.0345 6.43906 17.996 6.52596 17.9476 6.5886C17.8521 6.65404 17.7557 6.71799 17.6591 6.78179C17.4323 6.93166 17.1345 7.12576 16.8333 7.32126C16.6276 7.4548 16.4146 7.59262 16.2221 7.71723L16.213 7.72312C15.8767 7.94072 15.6045 8.1169 15.5451 8.15757L15.543 8.15899C14.7008 8.74097 14.1762 9.55956 14.0886 10.6948L14.0882 10.7004C14.0878 10.7056 14.0875 10.7107 14.0872 10.7159C14.0871 10.7184 14.0869 10.7209 14.0868 10.7234C13.8886 14.8133 14.6362 17.5181 15.5393 19.2492C15.9895 20.1122 16.4738 20.7241 16.8862 21.1379C17.0917 21.344 17.2813 21.5029 17.4423 21.6199C17.5665 21.7101 17.759 21.8391 17.9587 21.9027C18.5183 22.0811 19.1062 21.953 19.5224 21.539C19.8999 21.1635 20.0397 20.6542 20.0407 20.1947C20.0445 18.8117 20.0448 11.1035 20.0429 6.28688C20.0445 6.22546 20.0444 6.16413 20.0428 6.10299C20.0423 4.77075 20.0416 3.67618 20.0407 3.02381ZM18.0427 5.80408C18.0427 5.80408 18.0509 6.11794 18.0429 6.2748L18.0427 5.80408Z" fill="black"/>
// </svg>`;
//           break;
//         case 1657:
//           sevice = "F.B";
//           if (page_lang === "fa") {
//             title = "همراه سه وعده غذایی صبحانه و ناهار و شام";
//           } else if (page_lang === "en") {
//             title = "With three meals, breakfast, lunch and dinner";
//           } else if (page_lang === "ar") {
//             title = "مع ثلاث وجبات، الإفطار والغداء والعشاء";
//           }

//           img = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M6.15667 3.03914C6.17828 2.48728 5.74844 2.02239 5.19658 2.00078C4.64472 1.97917 4.17983 2.40903 4.15822 2.96089L3.95389 8.17889C3.95338 8.19192 3.95312 8.20497 3.95312 8.21801C3.95312 10.2194 5.33799 11.8969 7.20095 12.3464L7.20171 21.0001C7.20177 21.5524 7.64953 22.0001 8.20181 22C8.7541 22 9.20176 21.5522 9.20171 20.9999L9.20096 12.3465C11.0644 11.8969 12.4486 10.2193 12.4486 8.21801C12.4486 8.20503 12.4483 8.19205 12.4478 8.17907L12.2445 2.96107C12.223 2.40921 11.7582 1.97927 11.2063 2.00077C10.6544 2.02228 10.2245 2.48709 10.246 3.03896L10.4485 8.23573C10.439 9.46827 9.43701 10.4648 8.20088 10.4648C6.96555 10.4648 5.96276 9.46812 5.9532 8.23582L6.15667 3.03914Z" fill="black"/>
//                     <path d="M9.20312 3C9.20312 2.44772 8.75541 2 8.20312 2C7.65084 2 7.20312 2.44772 7.20312 3V7.78893C7.20312 8.34121 7.65084 8.78893 8.20312 8.78893C8.75541 8.78893 9.20312 8.34121 9.20312 7.78893V3Z" fill="black"/>
//                     <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0407 3.02381C20.0401 2.49876 19.6348 2.06874 19.1203 2.02823C19.0906 2.02506 19.0603 2.02344 19.0297 2.02344C18.9574 2.02344 18.8872 2.03249 18.8202 2.04951C18.3735 2.15006 18.0401 2.54946 18.0407 3.0264C18.0415 3.62889 18.0422 4.6085 18.0427 5.80408C18.0427 5.80408 18.0509 6.11794 18.0429 6.2748C18.0345 6.43906 17.996 6.52596 17.9476 6.5886C17.8521 6.65404 17.7557 6.71799 17.6591 6.78179C17.4323 6.93166 17.1345 7.12576 16.8333 7.32126C16.6276 7.4548 16.4146 7.59262 16.2221 7.71723L16.213 7.72312C15.8767 7.94072 15.6045 8.1169 15.5451 8.15757L15.543 8.15899C14.7008 8.74097 14.1762 9.55956 14.0886 10.6948L14.0882 10.7004C14.0878 10.7056 14.0875 10.7107 14.0872 10.7159C14.0871 10.7184 14.0869 10.7209 14.0868 10.7234C13.8886 14.8133 14.6362 17.5181 15.5393 19.2492C15.9895 20.1122 16.4738 20.7241 16.8862 21.1379C17.0917 21.344 17.2813 21.5029 17.4423 21.6199C17.5665 21.7101 17.759 21.8391 17.9587 21.9027C18.5183 22.0811 19.1062 21.953 19.5224 21.539C19.8999 21.1635 20.0397 20.6542 20.0407 20.1947C20.0445 18.8117 20.0448 11.1035 20.0429 6.28688C20.0445 6.22546 20.0444 6.16413 20.0428 6.10299C20.0423 4.77075 20.0416 3.67618 20.0407 3.02381ZM18.0427 5.80408C18.0427 5.80408 18.0509 6.11794 18.0429 6.2748L18.0427 5.80408Z" fill="black"/>
//                     </svg>`;
//           break;
//         case 1658:
//           sevice = "ALL";
//           if (page_lang === "fa") {
//             title = "تمام وعده های غذایی و امکانات هتل";
//           } else if (page_lang === "en") {
//             title = "All meals and hotel facilities";
//           } else if (page_lang === "ar") {
//             title = "جميع الوجبات ومرافق الفندق";
//           }

//           img = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M6.15667 3.03914C6.17828 2.48728 5.74844 2.02239 5.19658 2.00078C4.64472 1.97917 4.17983 2.40903 4.15822 2.96089L3.95389 8.17889C3.95338 8.19192 3.95312 8.20497 3.95312 8.21801C3.95312 10.2194 5.33799 11.8969 7.20095 12.3464L7.20171 21.0001C7.20177 21.5524 7.64953 22.0001 8.20181 22C8.7541 22 9.20176 21.5522 9.20171 20.9999L9.20096 12.3465C11.0644 11.8969 12.4486 10.2193 12.4486 8.21801C12.4486 8.20503 12.4483 8.19205 12.4478 8.17907L12.2445 2.96107C12.223 2.40921 11.7582 1.97927 11.2063 2.00077C10.6544 2.02228 10.2245 2.48709 10.246 3.03896L10.4485 8.23573C10.439 9.46827 9.43701 10.4648 8.20088 10.4648C6.96555 10.4648 5.96276 9.46812 5.9532 8.23582L6.15667 3.03914Z" fill="black"/>
//                     <path d="M9.20312 3C9.20312 2.44772 8.75541 2 8.20312 2C7.65084 2 7.20312 2.44772 7.20312 3V7.78893C7.20312 8.34121 7.65084 8.78893 8.20312 8.78893C8.75541 8.78893 9.20312 8.34121 9.20312 7.78893V3Z" fill="black"/>
//                     <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0407 3.02381C20.0401 2.49876 19.6348 2.06874 19.1203 2.02823C19.0906 2.02506 19.0603 2.02344 19.0297 2.02344C18.9574 2.02344 18.8872 2.03249 18.8202 2.04951C18.3735 2.15006 18.0401 2.54946 18.0407 3.0264C18.0415 3.62889 18.0422 4.6085 18.0427 5.80408C18.0427 5.80408 18.0509 6.11794 18.0429 6.2748C18.0345 6.43906 17.996 6.52596 17.9476 6.5886C17.8521 6.65404 17.7557 6.71799 17.6591 6.78179C17.4323 6.93166 17.1345 7.12576 16.8333 7.32126C16.6276 7.4548 16.4146 7.59262 16.2221 7.71723L16.213 7.72312C15.8767 7.94072 15.6045 8.1169 15.5451 8.15757L15.543 8.15899C14.7008 8.74097 14.1762 9.55956 14.0886 10.6948L14.0882 10.7004C14.0878 10.7056 14.0875 10.7107 14.0872 10.7159C14.0871 10.7184 14.0869 10.7209 14.0868 10.7234C13.8886 14.8133 14.6362 17.5181 15.5393 19.2492C15.9895 20.1122 16.4738 20.7241 16.8862 21.1379C17.0917 21.344 17.2813 21.5029 17.4423 21.6199C17.5665 21.7101 17.759 21.8391 17.9587 21.9027C18.5183 22.0811 19.1062 21.953 19.5224 21.539C19.8999 21.1635 20.0397 20.6542 20.0407 20.1947C20.0445 18.8117 20.0448 11.1035 20.0429 6.28688C20.0445 6.22546 20.0444 6.16413 20.0428 6.10299C20.0423 4.77075 20.0416 3.67618 20.0407 3.02381ZM18.0427 5.80408C18.0427 5.80408 18.0509 6.11794 18.0429 6.2748L18.0427 5.80408Z" fill="black"/>
//                     </svg>`;
//           break;
//         case 1659:
//           sevice = "U.ALL";
//           if (page_lang === "fa") {
//             title =
//               "تمام وعده های غذایی و امکانات هتل در هر زمان از اقامت بدون محدودیت";
//           } else if (page_lang === "en") {
//             title =
//               "All meals and hotel facilities at any time of the stay without restrictions";
//           } else if (page_lang === "ar") {
//             title =
//               "جميع الوجبات ومرافق الفندق في أي وقت من فترة الإقامة دون قيود";
//           }

//           img = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M8.66941 2.51654C8.37651 2.22365 7.90164 2.22365 7.60875 2.51654C7.31585 2.80944 7.31585 3.28431 7.60875 3.57721C7.78321 3.75167 7.78241 4.03337 7.6093 4.20612C6.84966 4.96576 6.84831 6.19862 7.6093 6.95802C7.9025 7.25061 8.37737 7.25011 8.66996 6.95691C8.96255 6.66371 8.96205 6.18884 8.66885 5.89625C8.49574 5.7235 8.49494 5.4418 8.66941 5.26734C9.42984 4.50789 9.42886 3.276 8.66941 2.51654Z" fill="black"/>
// <path d="M18.5525 5.8897C18.8454 5.59681 18.8454 5.12194 18.5525 4.82904C18.2596 4.53615 17.7848 4.53615 17.4919 4.82904C16.7322 5.58868 16.7314 6.82099 17.4924 7.58039C17.7856 7.87298 18.2605 7.87248 18.5531 7.57928C18.8457 7.28608 18.8452 6.81121 18.552 6.51862C18.3789 6.34587 18.3781 6.06417 18.5525 5.8897Z" fill="black"/>
// <path d="M4.2022 6.51654C3.90931 6.22365 3.43443 6.22365 3.14154 6.51654C2.84865 6.80944 2.84865 7.28431 3.14154 7.57721C3.316 7.75167 3.31521 8.03337 3.14209 8.20612C2.8489 8.49871 2.8484 8.97358 3.14099 9.26678C3.43358 9.55998 3.90845 9.56048 4.20165 9.26789C4.96263 8.50849 4.96184 7.27618 4.2022 6.51654Z" fill="black"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9998 6.26562C10.8542 6.26562 9.92752 7.19468 9.92752 8.33887V9.02028C6.1404 9.82322 3.29742 12.7751 3.51132 16.3344C3.52719 16.5984 3.74593 16.8044 4.01042 16.8044H19.9901C20.2546 16.8044 20.4734 16.5984 20.4892 16.3343C20.7022 12.7749 17.8589 9.82294 14.0721 9.02016V8.33887C14.0721 7.19432 13.1441 6.26562 11.9998 6.26562ZM12.5721 8.82055V8.33887C12.5721 8.02203 12.315 7.76562 11.9998 7.76562C11.6841 7.76562 11.4276 8.02167 11.4276 8.33887V8.82059C11.617 8.80987 11.808 8.80443 12.0003 8.80443C12.1922 8.80443 12.3829 8.80986 12.5721 8.82055Z" fill="black"/>
// <path d="M2.80133 18.0844C3.00334 17.9222 3.25079 17.8594 3.50324 17.8594H20.5032C20.7557 17.8594 21.0031 17.9222 21.2052 18.0844C21.4075 18.2468 21.5092 18.4647 21.5535 18.6706C21.6361 19.0548 21.5406 19.4911 21.4256 19.8366C21.1035 20.8027 20.1981 21.4553 19.1794 21.4553H4.82711C3.80834 21.4553 2.90303 20.803 2.58099 19.8368C2.46599 19.4913 2.37035 19.0548 2.45296 18.6706C2.49723 18.4647 2.599 18.2468 2.80133 18.0844Z" fill="black"/>
// </svg>`;
//           break;
//         case 1660:
//           sevice = "Maximum All Inclusive";
//           if (page_lang === "fa") {
//             title =
//               "تمام وعده های غذایی و امکانات هتل در هر زمان از اقامت بدون محدودیت";
//           } else if (page_lang === "en") {
//             title =
//               "All meals and hotel facilities at any time of the stay without restrictions";
//           } else if (page_lang === "ar") {
//             title =
//               "جميع الوجبات ومرافق الفندق في أي وقت من فترة الإقامة دون قيود";
//           }

//           img = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M8.66941 2.51654C8.37651 2.22365 7.90164 2.22365 7.60875 2.51654C7.31585 2.80944 7.31585 3.28431 7.60875 3.57721C7.78321 3.75167 7.78241 4.03337 7.6093 4.20612C6.84966 4.96576 6.84831 6.19862 7.6093 6.95802C7.9025 7.25061 8.37737 7.25011 8.66996 6.95691C8.96255 6.66371 8.96205 6.18884 8.66885 5.89625C8.49574 5.7235 8.49494 5.4418 8.66941 5.26734C9.42984 4.50789 9.42886 3.276 8.66941 2.51654Z" fill="black"/>
// <path d="M18.5525 5.8897C18.8454 5.59681 18.8454 5.12194 18.5525 4.82904C18.2596 4.53615 17.7848 4.53615 17.4919 4.82904C16.7322 5.58868 16.7314 6.82099 17.4924 7.58039C17.7856 7.87298 18.2605 7.87248 18.5531 7.57928C18.8457 7.28608 18.8452 6.81121 18.552 6.51862C18.3789 6.34587 18.3781 6.06417 18.5525 5.8897Z" fill="black"/>
// <path d="M4.2022 6.51654C3.90931 6.22365 3.43443 6.22365 3.14154 6.51654C2.84865 6.80944 2.84865 7.28431 3.14154 7.57721C3.316 7.75167 3.31521 8.03337 3.14209 8.20612C2.8489 8.49871 2.8484 8.97358 3.14099 9.26678C3.43358 9.55998 3.90845 9.56048 4.20165 9.26789C4.96263 8.50849 4.96184 7.27618 4.2022 6.51654Z" fill="black"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9998 6.26562C10.8542 6.26562 9.92752 7.19468 9.92752 8.33887V9.02028C6.1404 9.82322 3.29742 12.7751 3.51132 16.3344C3.52719 16.5984 3.74593 16.8044 4.01042 16.8044H19.9901C20.2546 16.8044 20.4734 16.5984 20.4892 16.3343C20.7022 12.7749 17.8589 9.82294 14.0721 9.02016V8.33887C14.0721 7.19432 13.1441 6.26562 11.9998 6.26562ZM12.5721 8.82055V8.33887C12.5721 8.02203 12.315 7.76562 11.9998 7.76562C11.6841 7.76562 11.4276 8.02167 11.4276 8.33887V8.82059C11.617 8.80987 11.808 8.80443 12.0003 8.80443C12.1922 8.80443 12.3829 8.80986 12.5721 8.82055Z" fill="black"/>
// <path d="M2.80133 18.0844C3.00334 17.9222 3.25079 17.8594 3.50324 17.8594H20.5032C20.7557 17.8594 21.0031 17.9222 21.2052 18.0844C21.4075 18.2468 21.5092 18.4647 21.5535 18.6706C21.6361 19.0548 21.5406 19.4911 21.4256 19.8366C21.1035 20.8027 20.1981 21.4553 19.1794 21.4553H4.82711C3.80834 21.4553 2.90303 20.803 2.58099 19.8368C2.46599 19.4913 2.37035 19.0548 2.45296 18.6706C2.49723 18.4647 2.599 18.2468 2.80133 18.0844Z" fill="black"/>
// </svg>`;

//           break;
//       }
//       return `${img}<span>${sevice}</span><span>${title}</span>${await renderHotelBooking(
//         booking
//       )}`;
//     }
//   } catch (err) {
//     console.error("renderServiceHotel=" + err.lineNumber + "," + err.message);
//   }
// };

function renderServiceHotel(service) {
  let serviceText = "-";
  let serviceCode = "-";

  if (service) {
    switch (service.vid) {
      case 0:
        serviceCode = "-";
        serviceText = "-";
        break;
      case 1654:
        serviceCode = "O.R";
        serviceText = "بدون وعده غذایی";
        break;
      case 1655:
        serviceCode = "B.B";
        serviceText = "یک وعده صبحانه در روز";
        break;
      case 1656:
        serviceCode = "H.B";
        serviceText = "دو وعده: صبحانه و شام";
        break;
      case 1657:
        serviceCode = "F.B";
        serviceText = "سه وعده: صبحانه، ناهار و شام";
        break;
      case 1658:
        serviceCode = "ALL";
        serviceText = "همه وعده‌ها و امکانات هتل";
        break;
      case 1659:
        serviceCode = "U.ALL";
        serviceText = "همه وعده‌ها و امکانات بدون محدودیت زمانی";
        break;
      case 1660:
        serviceCode = "Maximum All Inclusive";
        serviceText = "همه وعده‌ها و امکانات بدون هیچ محدودیت زمانی";
        break;
    }
  }

  return `
      <div style="display: flex; align-items: center; gap: 5px;">
        <span style="
          font-weight: bold;
          background-color: #eee;
          border-radius: 3px;
          padding: 3px 5px;
          font-size: 12px;
          display: inline-block;
          min-width: 30px;
          text-align: center;
        ">${serviceCode}</span>
        <span>${serviceText}</span>
      </div>
    `;
}

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
