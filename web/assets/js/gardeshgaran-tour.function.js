const callbackSourceExecutionPlanTypesView = async (args) => {
  try {
    const resultJson = args.source?.rows;

    const originsSourceArray = new Array();
    const destinationsSourceArray = new Array();
    let originsRownumber = 1;
    let destinationsRownumber = 1;
    if (resultJson[0]) {
      document.querySelector('.tourExecution__container').classList.remove('hidden');
      for (const element of resultJson[0].execution.origins) {
        const sourceObj = new Object();
        sourceObj['rownumber'] = originsRownumber;
        sourceObj['info'] = element;
        sourceObj['len'] = resultJson[0].execution.origins.length;
        originsSourceArray.push(sourceObj);
        originsRownumber++;
      }
      for (const element of resultJson[0].execution.destinations) {
        const sourceObj = new Object();
        sourceObj['rownumber'] = destinationsRownumber;
        sourceObj['info'] = element;
        sourceObj['len'] = resultJson[0].execution.destinations.length;
        destinationsSourceArray.push(sourceObj);
        destinationsRownumber++;
      }
    }

    setTimeout(() => {
      $bc.setSource('refresh.executionPlanTypesOrigins', originsSourceArray);
      $bc.setSource('refresh.executionPlanTypesDestinations', destinationsSourceArray);
    }, '10');
  } catch (err) {
    console.error('callbackSourceExecutionPlanTypesView=' + err.lineNumber + ',' + err.message);
  }
};

const renderInventoryView = async (element, day, from, to) => {
  try {
  
    document.querySelectorAll('.swiper-tour-date .swiper-slide').forEach(e => {
      e.querySelector('.group')?.classList.remove('border-primary-400');
      e.querySelector('.tour-dates')?.classList.remove('text-primary-500');
    });

    
    $bc.setSource('db.inventoryViewSpecificDate', {
      from: from,
      to: to,
      day: day,
    });

    
    element.querySelector('.group')?.classList.add('border-primary-400');
    element.querySelector('.tour-dates')?.classList.add('text-primary-500');

  
    window.scroll({
      top: document.querySelector('#hotels').offsetTop,
      behavior: 'smooth',
    });
  } catch (err) {
    console.error('renderInventoryView=' + err.lineNumber + ',' + err.message);
  }
};

const onProcessedHotelsImg = async (args) => {
  try {
    const response = args.response;
    if (response.status === 200) {
      const responseJson = await response.json();
      if (!responseJson) return;

      document.querySelectorAll('.tourInventory__details__item__img').forEach((img) => {
        const pageName = img.dataset.pagename;
        const hotelId = parseInt(img.dataset.id);

        const matched = responseJson.find((item) => parseInt(item.usedforid) === hotelId);

        if (!matched) {
          console.warn(`No matched image for hotelId ${hotelId}`);
          return;
        }

        img.src = `/${matched.originalImage}`;
      });
    }
  } catch (err) {
    console.error('onProcessedHotelsImg=' + (err.lineNumber || '-') + ',' + err.message);
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
    console.error('renderTransportationName=' + err.lineNumber + ',' + err.message);
  }
};

const onProcessedAirlinesOriginsImg = async (args) => {
  const response = args.response;
  if (response.status == 200) {
    const responseJson = await response.json();
    if (responseJson) {
      document
        .querySelector('.tourExecution__container__origins')
        .querySelectorAll('.transportation__img')
        .forEach((e) => {
          for (const item of responseJson) {
            if (parseInt(e.dataset.id) == parseInt(item.usedforid)) {
              e.setAttribute('src', `/${item.originalImage}`);
            }
          }
        });
    }
  }
};

let swiperTourDate = null;

if (document.querySelector('.swiper-tour-date')) {
  swiperTourDate = new Swiper('.swiper-tour-date', {
    slidesPerView: 1.5,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
  });
}

const initSwiper = (loop) => {
  swiperTourDate = new Swiper('.swiper-tour-date', {
    slidesPerView: 1.5,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: loop,
  });
};

const onProcessedTourDates = async (args) => {
  const response = args.response;

  if (response.status === 200) {
    const responseJson = await response.json();
    const data = responseJson.sources?.[0]?.data || [];

    const startDateEl = document.querySelector(".date__details .start__date");
    const endDateEl = document.querySelector(".date__details .end__date");

    if (data.length > 0) {
      const firstItem = data[0];
      if (startDateEl) startDateEl.textContent = firstItem.start.date;
      if (endDateEl) endDateEl.textContent = firstItem.end.date;
    }

    const swiperWrapper = document.querySelector(".swiper-tour-date .swiper-wrapper");
    if (!swiperWrapper) return;

    swiperWrapper.innerHTML = "";

    if (data.length === 0) {
      swiperWrapper.innerHTML = `
        <li class="swiper-slide text-center py-6 text-gray-500">
          در حال حاضر تاریخ دیگری وجود ندارد
        </li>
      `;
    } else {
      data.forEach(item => {
        const li = document.createElement("li");
        li.className = "swiper-slide cursor-pointer";
        li.setAttribute(
          "onclick",
          `renderInventoryView(this,${item.day},${item.start.dateid},${item.end.dateid})`
        );
        li.innerHTML = `
          <div class="group border border-gray-50 w-[230px] bg-white rounded-lg py-4 px-6 transition-all duration-300 hover:border-primary-400">
            <h3 class="text-gray-500 font-light mb-1">تاریخ رفت و برگشت:</h3>
            <div class="tour-dates flex items-center justify-between text-sm font-semibold text-gray-500 transition-all duration-300 group-hover:text-primary-500">
              <span class="start__date" data-date="${item.start.date}">${item.start.date}</span>
              تا
              <span class="end__date" data-date="${item.end.date}">${item.end.date}</span>
            </div>
          </div>
        `;
        swiperWrapper.appendChild(li);
      });
    }

    if (swiperTourDate) {
      swiperTourDate.destroy(true, true);
      swiperTourDate = null;
    }

    requestAnimationFrame(() => {
      initSwiper(data.length > 1);
    });
  }
};


const onProcessedAirlinesDestinationsImg = async (args) => {
  const response = args.response;
  if (response.status == 200) {
    const responseJson = await response.json();
    if (responseJson) {
      document
        .querySelector('.tourExecution__container__destinations')
        .querySelectorAll('.transportation__img')
        .forEach((e) => {
          for (const item of responseJson) {
            if (parseInt(e.dataset.id) == parseInt(item.usedforid)) {
              e.setAttribute('src', `/${item.originalImage}`);
            }
          }
        });
    }
  }
};

const onrenderedInventoryView = async () => {
  try {
    let ids = [];
    document.querySelectorAll('.tourInventory__details__item__img').forEach((e) => {
      if (e.dataset.id !== '') {
        ids.push(e.dataset.id);
      }
    });
    if (ids.length > 0) {
      $bc.setSource('db.hotelGallery', {
        ids: ids,
        run: true,
      });
    }
  } catch (err) {
    console.error('onrenderedInventoryView=' + err.lineNumber + ',' + err.message);
  }
};

const renderHotels = async (element, type) => {
  try {
    if (element) {
      let output = '';
      let index = 0;
      const escapeHtml = (unsafe) => {
        return (unsafe || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      for (const item of element.hotelinfo[0].hotels) {
        let img = `/common/images/img-symbol-sign.jpg`;
        if (document.querySelector('.layout__body__container').dataset.noimgsign.length > 0) {
          img = `/images/${document.querySelector('.layout__body__container').dataset.noimgsign}`;
        }

        const hotel = item.hotel;
        const cleanHotelName = (() => {
          const div = document.createElement('div');
          div.innerHTML = hotel.hotelname;
          return div.textContent || div.innerText || '';
        })();

        const pageName = escapeHtml(document.querySelector('.layout__body__container').dataset.pagenameinventory);

        const hotelStar = item.hotel.star === '' ? 0 : item.hotel.star;
        const serviceHTML = await renderServiceHotel(hotel);

        const isMobile = window.innerWidth <= 1024;
        if (isMobile) {
          output += `
                          <div class="" data-index="${index}">
                    <div class="flex flex-col items-center">
                        <div class="w-full shadow-card-shadow mb-4">
                            <img src="${img}" data-id="${hotel.hotelid}" data-pageName="${pageName}"
                                class="tourInventory__details__item__img w-full h-40 object-cover rounded-xl" alt="" width="320" height="160"
                                loading="lazy" />
                        </div>
                        <h2 class="font-extrabold text-center mb-3 hotel-card-title">${escapeHtml(cleanHotelName)}
                        </h2>
                        <div class="tourInventory__details__item__service flex items-center gap-3 mb-4">
                            <div class="flex flex-col gap-2 items-center bg-gray-50 p-2 rounded-lg">
                                <span class="font-semibold text-sm hotel-card-service" data-value="${escapeHtml(
                                  hotel.service.vid
                                )}">${escapeHtml(serviceHTML.service)}</span>
                                <span class="text-xs font-light">${escapeHtml(serviceHTML.english)}</span>
                            </div>
                            <div class="flex items-center gap-3 text-sm font-bold">
                                <span class="hotel-card-star" data-value="${hotelStar}">${hotelStar} ستاره</span>
                                <span class="flex items-center">${await renderHotelRate(hotel)}</span>
                            </div>
                        </div>
                        <a href="/${pageName}?id=${hotel.hotelid}" data-id="${
            hotel.hotelid
          }" data-pageName="${pageName}"
                            class="group flex items-center justify-center gap-2 font-extrabold border border-gray-100 rounded-xl w-full h-[73px] transition-all duration-300 hover:bg-primary-500 hover:text-white hover:shadow-btn-shadow">
                            جزئیات هتل
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path class="transition-all duration-300 group-hover:stroke-white"
                                    d="M17 6.5L11 12.5L17 18.5" stroke="#1E2128" stroke-width="2" />
                                <path class="transition-all duration-300 group-hover:stroke-white" d="M6 7.5V17.5"
                                    stroke="#1E2128" stroke-width="2" />
                            </svg>
                        </a>
                    </div>
                    </div>`;
          index++;
        } else {
          output += `
          <div class="flex items-stretch justify-between w-full" data-index="${index}">
            <div class="flex items-center gap-6">
              <div class="shadow-card-shadow">
                <img src="${img}" data-id="${hotel.hotelid}" data-pageName="${pageName}"
                  class="tourInventory__details__item__img h-40 object-cover rounded-xl" alt="" width="253" height="164"
                  loading="lazy" />
              </div>
              <div class="flex flex-col gap-3">
                <h2 class="font-extrabold hotel-card-title">${escapeHtml(cleanHotelName)}</h2>
                <div class="flex items-center gap-3 text-sm font-bold">
                  <span class="hotel-card-star" data-value="${hotelStar}">
                    ${hotelStar} ستاره
                  </span>
                  <div class="flex items-center">${await renderHotelRate(hotel)}</div>
                </div>
                <div class="tourInventory__details__item__service flex items-center gap-3">
                  <div class="flex flex-col gap-2 items-center bg-gray-50 p-2 rounded-lg">
                    <span class="font-semibold text-sm hotel-card-service" data-value="${escapeHtml(
                      hotel.service.vid
                    )}">${escapeHtml(serviceHTML.service)}</span>
                    <span class="text-xs font-light">${escapeHtml(serviceHTML.english)}</span>
                  </div>
                  <span class="text-xs font-light w-2/5 leading-5">
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
              <a href="/${pageName}?id=${hotel.hotelid}" data-id="${hotel.hotelid}" data-pageName="${pageName}"
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
      }

      return output;
    }
  } catch (err) {
    console.error('renderHotels=' + err.lineNumber + ',' + err.message);
  }
};

function renderPriceInfo(element, type) {
  if (!element || !element.priceinfo || !type) return '';

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 1024;
  const priceTypes = {
    doublecost: { costKey: 'doublecostf', unitKey: 'doubleunit' },
    singlecost: { costKey: 'singlecostf', unitKey: 'singleunit' },
    childwithbed: { costKey: 'childwithbedf', unitKey: 'childwithbedunit' },
    childwithoutbed: { costKey: 'childwithoutbedf', unitKey: 'childwithoutbedunit' },
  };

  const config = priceTypes[type];
  if (!config || !element.priceinfo[type]) return '';

  const items = element.priceinfo[type];
  const formatPrice = (value) => new Intl.NumberFormat('fa-IR').format(value);

  const generatePriceHTML = (item, index, isMobile) => {
    const cost = item[type][config.costKey];
    const unit = item[type][config.unitKey] || '';
    const dataPriceAttr = index === 0 ? `data-price="${cost}"` : '';

    if (items.length === 2 && index === 1) {
      return `
        <div class="flex items-center gap-1 text-sm font-bold ${
          isMobile ? 'text-primary-500 hotel-card-price-mobile' : ''
        }">
          <span class="tourInventory__details__item__price text-xl font-extrabold text-primary-500 hotel-card-price">
            ${formatPrice(cost)}
          </span>
          ${unit ? `<span class="text-sm text-zinc-900 tourInventory__details__item__unit">${unit}</span>` : ''}
        </div>`;
    }

    return `
      <div class="${
        isMobile
          ? 'text-sm font-bold text-primary-500 hotel-card-price-mobile flex flex-col items-center gap-1'
          : 'flex flex-col items-center gap-1 text-sm font-bold'
      }" ${dataPriceAttr}>
        <span class="tourInventory__details__item__price text-xl font-extrabold text-primary-500 hotel-card-price">
          ${formatPrice(cost)}
        </span>
        ${unit ? `<span class="text-sm text-zinc-900 tourInventory__details__item__unit">${unit}</span>` : ''}
      </div>`;
  };

  return items.length === 2
    ? items
        .map((item, index) => generatePriceHTML(item, index, isMobile))
        .join(
          '<div class="relative w-full flex justify-center items-center -my-2"><hr class="w-full" /><span class="leading-4 font-IRANYekanMobileBoldFA text-2xl text-primary-900 bg-white px-3 mx-auto inline-block">+</span><hr class="w-full" /></div>'
        )
    : items.map((item) => generatePriceHTML(item, 0, isMobile)).join('');
}

const serviceDefinitions = {
  0: { code: '-', titleFa: '', titleEn: '' },
  1654: { code: 'O.R', titleFa: 'بدون وعده غذایی', titleEn: 'Room Only' },
  1655: {
    code: 'B.B',
    titleFa: 'همراه یک وعده صبحانه در روز',
    titleEn: 'Breakfast & Bed',
  },
  1656: {
    code: 'H.B',
    titleFa: 'همراه دو وعده غذایی صبحانه و شام',
    titleEn: 'Breakfast & Dinner',
  },
  1657: {
    code: 'F.B',
    titleFa: 'همراه سه وعده غذایی صبحانه و ناهار و شام',
    titleEn: 'Breakfast, Lunch & Dinner',
  },
  1658: {
    code: 'ALL',
    titleFa: 'تمام وعده‌های غذایی و امکانات هتل',
    titleEn: 'All Inclusive',
  },
  1659: {
    code: 'U.ALL',
    titleFa: 'تمام وعده‌های غذایی و امکانات هتل در هر زمان از اقامت بدون محدودیت',
    titleEn: 'Ultra All Inclusive',
  },
  1660: {
    code: 'Maximum All Inclusive',
    titleFa: 'تمام وعده‌های غذایی و امکانات هتل در هر زمان از اقامت بدون محدودیت',
    titleEn: 'Maximum All Inclusive',
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
      service: '-',
      title: '',
      english: '',
    };
  } catch (err) {
    console.error('renderServiceHotel=' + err.lineNumber + ',' + err.message);
    return {
      service: '-',
      title: '',
      english: '',
    };
  }
};

const renderHotelRate = async (element) => {
  try {
    if (element) {
      let output = '';
      let i = 0;
      for (; i < element.star == '' ? 0 : element.star; ) {
        output += `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.3075 7.21986C10.9496 5.61918 11.2706 4.81883 11.7922 4.70791C11.9293 4.67874 12.0711 4.67874 12.2082 4.70791C12.7298 4.81883 13.0508 5.61918 13.6929 7.21986C14.058 8.13014 14.2406 8.58528 14.5822 8.89485C14.678 8.98168 14.782 9.05901 14.8928 9.12576C15.2876 9.36374 15.7805 9.40788 16.7663 9.49617C18.4351 9.64562 19.2695 9.72034 19.5243 10.1961C19.577 10.2946 19.6129 10.4013 19.6304 10.5117C19.7149 11.0447 19.1015 11.6028 17.8747 12.7189L17.534 13.0288C16.9605 13.5506 16.6737 13.8115 16.5078 14.1372C16.4083 14.3325 16.3416 14.5428 16.3104 14.7598C16.2582 15.1215 16.3422 15.5 16.5102 16.2569L16.5702 16.5274C16.8714 17.8849 17.022 18.5637 16.834 18.8973C16.6651 19.197 16.3541 19.3889 16.0105 19.4053C15.6279 19.4236 15.089 18.9844 14.011 18.106C13.3008 17.5273 12.9457 17.2379 12.5515 17.1249C12.1912 17.0216 11.8092 17.0216 11.4489 17.1249C11.0547 17.2379 10.6996 17.5273 9.98941 18.106C8.91144 18.9844 8.37245 19.4236 7.98993 19.4053C7.64633 19.3889 7.33528 19.197 7.16642 18.8973C6.97842 18.5637 7.12902 17.8849 7.43022 16.5274L7.49023 16.2569C7.65818 15.5 7.74216 15.1215 7.69004 14.7598C7.65878 14.5428 7.59207 14.3325 7.49257 14.1372C7.32669 13.8115 7.03992 13.5506 6.46637 13.0288L6.1257 12.7189C4.89891 11.6028 4.28552 11.0447 4.36999 10.5117C4.38749 10.4013 4.42337 10.2946 4.47614 10.1961C4.73094 9.72034 5.56532 9.64562 7.23408 9.49617C8.21986 9.40788 8.71276 9.36374 9.1076 9.12576C9.21834 9.05901 9.32236 8.98168 9.41818 8.89485C9.75979 8.58528 9.94236 8.13014 10.3075 7.21986Z" fill="#FFBC2C" stroke="#FFBC2C" stroke-width="2"/>
</svg>
`;
        i++;
      }
      let j = 0;
      for (; j < 5 - parseInt(element.star == '' ? 0 : element.star); ) {
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
    console.error('renderHotelRate=' + err.lineNumber + ',' + err.message);
  }
};

const onrenderedExecutionOrigins = async () => {
  try {
    const originElement = document.querySelector(
      '.tourExecution__container__origins .execution__details__path__item .details__city'
    );
    if (originElement) {
      let origin = originElement.textContent.trim();

      document.querySelector('.tourExecution__container__origins .origins__city').textContent = origin;
      document.getElementById('destination-departure-tour').textContent = origin;

      let ids = [];
      document
        .querySelector('.tourExecution__container__origins')
        .querySelectorAll('.transportation__img')
        .forEach((e) => {
          if (e.dataset.id !== '') {
            ids.push(e.dataset.id);
          }
        });
      if (ids.length > 0) {
        $bc.setSource('db.airlinesOriginsGallery', { ids: ids, run: true });
      }
    }
  } catch (err) {
    console.error('onrenderedExecutionOrigins=' + err.lineNumber + ',' + err.message);
  }
};

const onrenderedExecutionDestinations = async () => {
  try {
    const destinationElement = document.querySelector(
      '.tourExecution__container__destinations .execution__details__path__item .details__city'
    );
    if (destinationElement) {
      let destination = destinationElement.textContent;

      document.querySelector('.tourExecution__container__destinations .destinations__city').textContent = destination;
      document.getElementById('origin-departure-tour').textContent = destination;

      let ids = [];
      document
        .querySelector('.tourExecution__container__destinations')
        .querySelectorAll('.transportation__img')
        .forEach((e) => {
          ids.push(e.dataset.id);
        });
      if (ids.length > 0) {
        $bc.setSource('db.airlinesDestinationsGallery', { ids: ids, run: true });
      }
    }
  } catch (err) {
    console.error('onrenderedExecutionDestinations=' + err.lineNumber + ',' + err.message);
  }
};

// dont repeat breadcrumb
document.addEventListener('DOMContentLoaded', function () {
  const breadcrumbContainer = document.querySelector('.breadcrumb');
  const items = breadcrumbContainer.querySelectorAll('li');
  const uniqueLinks = new Map();

  items.forEach((li) => {
    const link = li.querySelector('a');
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

document.addEventListener('DOMContentLoaded', () => {
  function toPersianOrdinal(num) {
    const map = {
      1: 'اول',
      2: 'دوم',
      3: 'سوم',
      4: 'چهارم',
      5: 'پنجم',
      6: 'ششم',
      7: 'هفتم',
      8: 'هشتم',
      9: 'نهم',
      10: 'دهم',
      11: 'یازدهم',
      12: 'دوازدهم',
      13: 'سیزدهم',
      14: 'چهاردهم',
      15: 'پانزدهم',
      16: 'شانزدهم',
      17: 'هفدهم',
      18: 'هجدهم',
      19: 'نوزدهم',
      20: 'بیستم',
    };
    return map[num] || num + '‌ام';
  }

  const wrappers = document.querySelectorAll('.travel-wrapper');

  wrappers.forEach((wrapper, index) => {
    const title = wrapper.querySelector('.travel-title');
    if (title) {
      title.textContent = `روز ${toPersianOrdinal(index + 1)}`;
    }
  });
});

const renderTourInstallmentForm = async (element) => {
  let service = '-';
  switch (
    parseInt(
      element.closest('.hotel-card').querySelector('.tourInventory__details__item__service .hotel-card-service').dataset
        .value
    )
  ) {
    case 0:
      service = '-';
      break;
    case 1654:
      service = 'O.R';
      break;
    case 1655:
      service = 'B.B';
      break;
    case 1656:
      service = 'H.B';
      break;
    case 1657:
      service = 'F.B';
      break;
    case 1658:
      service = 'ALL';
      break;
    case 1659:
      service = 'U.ALL';
      break;
    case 1660:
      service = 'Maximum All Inclusive';
      break;
  }
  $bc.setSource('db.tourBookingFormIns', {
    run: false,
  });

  $bc.setSource('db.tourFormInstallmentplan', {
    hotelName: element.closest('.hotel-card').querySelector('.hotel-card-title').textContent,
    hotelRate: element.closest('.hotel-card').querySelector('.hotel-card-star').dataset.value,
    hotelService: service,
    tourName: document.querySelector('.tour-name').textContent,
    doubleP: element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__double')[0]
      .querySelector('.tourInventory__details__item__price').textContent,
    singleP: element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__single')[0]
      .querySelector('.tourInventory__details__item__price').textContent,
    wBedP: element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__wBed')[0]
      .querySelector('.tourInventory__details__item__price').textContent,
    woBedP: element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__woBed')[0]
      .querySelector('.tourInventory__details__item__price').textContent,
    doubleU: element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__double')[0]
      .querySelector('.tourInventory__details__item__unit')
      ? element
          .closest('.hotel-card-wrapper')
          .querySelectorAll('.tourInventory__details__item__double')[0]
          .querySelector('.tourInventory__details__item__unit').textContent
      : ` `,
    singleU: element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__single')[0]
      .querySelector('.tourInventory__details__item__unit')
      ? element
          .closest('.hotel-card-wrapper')
          .querySelectorAll('.tourInventory__details__item__single')[0]
          .querySelector('.tourInventory__details__item__unit').textContent
      : ` `,
    wBedU: element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__wBed')[0]
      .querySelector('.tourInventory__details__item__unit')
      ? element
          .closest('.hotel-card-wrapper')
          .querySelectorAll('.tourInventory__details__item__wBed')[0]
          .querySelector('.tourInventory__details__item__unit').textContent
      : ` `,
    woBedU: element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__woBed')[0]
      .querySelector('.tourInventory__details__item__unit')
      ? element
          .closest('.hotel-card-wrapper')
          .querySelectorAll('.tourInventory__details__item__woBed')[0]
          .querySelector('.tourInventory__details__item__unit').textContent
      : ` `,
    run: true,
  });

  (FormhotelName = element.closest('.hotel-card').querySelector('.hotel-card-title').textContent),
    (FormhotelRate = element.closest('.hotel-card').querySelector('.hotel-card-star').dataset.value),
    (FormhotelService = service),
    (FormtourName = document.querySelector('.tour-name').textContent),
    (FormdoubleP = element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__double')[0]
      .querySelector('.tourInventory__details__item__price').textContent),
    (FormsingleP = element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__single')[0]
      .querySelector('.tourInventory__details__item__price').textContent),
    (FormwBedP = element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__wBed')[0]
      .querySelector('.tourInventory__details__item__price').textContent),
    (FormwoBedP = element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__woBed')[0]
      .querySelector('.tourInventory__details__item__price').textContent),
    (FormdoubleU = element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__double')[0]
      .querySelector('.tourInventory__details__item__unit')
      ? element
          .closest('.hotel-card-wrapper')
          .querySelectorAll('.tourInventory__details__item__double')[0]
          .querySelector('.tourInventory__details__item__unit').textContent
      : ` `),
    (FormsingleU = element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__single')[0]
      .querySelector('.tourInventory__details__item__unit')
      ? element
          .closest('.hotel-card-wrapper')
          .querySelectorAll('.tourInventory__details__item__single')[0]
          .querySelector('.tourInventory__details__item__unit').textContent
      : ` `),
    (FormwBedU = element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__wBed')[0]
      .querySelector('.tourInventory__details__item__unit')
      ? element
          .closest('.hotel-card-wrapper')
          .querySelectorAll('.tourInventory__details__item__wBed')[0]
          .querySelector('.tourInventory__details__item__unit').textContent
      : ` `),
    (FormwoBedU = element
      .closest('.hotel-card-wrapper')
      .querySelectorAll('.tourInventory__details__item__woBed')[0]
      .querySelector('.tourInventory__details__item__unit')
      ? element
          .closest('.hotel-card-wrapper')
          .querySelectorAll('.tourInventory__details__item__woBed')[0]
          .querySelector('.tourInventory__details__item__unit').textContent
      : ` `);
};

const renderReserveTourInstallmentForm = async (element) => {
  document.getElementById('white-modal').classList.add('hidden');

  $bc.setSource('db.tourBookingFormIns', {
    run: false,
  });

  let sd2 = document.querySelector('.tour-dates .start__date')?.textContent || '';

  let ed2 = document.querySelector('.tour-dates .end__date')?.textContent || '';

  $bc.setSource('db.tourFormInstallment', {
    hotelName: FormhotelName,
    hotelRate: FormhotelRate,
    hotelService: FormhotelService,
    tourName: FormtourName,
    doubleP: FormdoubleP,
    singleP: FormsingleP,
    wBedP: FormwBedP,
    woBedP: FormwoBedP,
    doubleU: FormdoubleU,
    singleU: FormsingleU,
    wBedU: FormwBedU,
    woBedU: FormwoBedU,

    adultCount: parseInt(document.getElementById('adult-installment').value),
    childCount: parseInt(document.getElementById('child-bed-installment').value),
    infantCount:
      parseInt(document.getElementById('child-installment').value) +
      parseInt(document.getElementById('infant-installment').value),

    //origins__start__day
    startDate: sd2,
    // destinations__start__day
    endDate: ed2,

    // origins__start__weekday
    // weekdayStartDate: document
    //   .querySelector('.tourExecution__container__origins')
    //   .querySelector('.origins__start__weekday').textContent,
    // destinations__start__weekday
    // weekdayEndDate: document
    //   .querySelector('.tourExecution__container__destinations')
    //   .querySelector('.destinations__start__weekday').textContent,

    departureName: document.querySelector('.tourExecution__container__origins').querySelector('.origins__city')
      .textContent,
    destinationName: document
      .querySelector('.tourExecution__container__destinations')
      .querySelector('.destinations__city').textContent,

    // __times__start
    startTime: document
      .querySelector('.execution__details__path__origins')
      .querySelectorAll('.execution__details__path__item')[0]
      .querySelector('.__times__start').textContent,
    // __times__start
    endTime: document
      .querySelector('.execution__details__path__destinations')
      .querySelectorAll('.execution__details__path__item')[0]
      .querySelector('.__times__start').textContent,

    totalAmountINS: document.getElementById('white-modal').querySelector('.total-amount').innerText,
    totalAmountFacilityINS: document.getElementById('white-modal').querySelector('.Total-amount-facilities').innerText,
    totalAdvancePaymentINS: document.getElementById('white-modal').querySelector('.Total-advance-payment').innerText,
    amountEachInstallmentINS: document.getElementById('white-modal').querySelector('.amount-each-installment')
      .innerText,

    run: true,
  });
};

const closeModalContainer = (element, event, closed, className, type) => {
  try {
    if (type == 'parent') {
      if (!event.target.closest('.modal__content')) {
        element.closest(`.${closed}`).classList.add(`${className}`);
      }
    } else {
      element.closest(`.${closed}`).classList.add(`${className}`);
    }
  } catch (err) {
    console.error('closeModalContainer=' + err.lineNumber + ',' + err.message);
  }
};

function closeModalForm(element, container) {
  document.getElementById(container).classList.add('hidden');
}

const renderCaptchaCode = async (element, event) => {
  try {
    fetch(`tour-captcha.bc`, {
      method: `get`,
    })
      .then((response) => response.text())
      .then((text) => {
        element.closest('form').querySelector('.captcha__content').innerHTML = text;
      })
      .catch((error) => console.error(error));
  } catch (err) {
    console.error('renderCaptchaCode=' + err.lineNumber + ',' + err.message);
  }
};
const onrenderedFormSchema = async () => {
  try {
  } catch (err) {
    console.error('onrenderedFormSchema=' + err.lineNumber + ',' + err.message);
  }
};

const toggleCount = (element, type, limit, passenger) => {
  try {
    let currentCount = parseInt(element.closest('li').querySelector('.count__container').textContent);
    type == 'plus' ? currentCount++ : currentCount--;
    if (currentCount < limit) return false;
    element.closest('li').querySelector('.count__container').textContent = currentCount;
    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector(`.${passenger}-count`)
      .querySelector('input').value = currentCount;
  } catch (err) {
    console.error('toggleCount=' + err.lineNumber + ',' + err.message);
  }
};

const renderTourForm = async (element) => {
  // تبدیل مقدار سرویس
  let service = '-';
  switch (parseInt(element.closest('.hotel-card').querySelector('.hotel-card-service').dataset.value)) {
    case 1654:
      service = 'O.R';
      break;
    case 1655:
      service = 'B.B';
      break;
    case 1656:
      service = 'H.B';
      break;
    case 1657:
      service = 'F.B';
      break;
    case 1658:
      service = 'ALL';
      break;
    case 1659:
      service = 'U.ALL';
      break;
    case 1660:
      service = 'Maximum All Inclusive';
      break;
  }

  $bc.setSource('db.tourBookingForm', {
    run: false,
  });

  const normalizeText = (text) => text.replace(/ي/g, 'ی').replace(/ك/g, 'ک');

  let sd = '';
  let ed = '';

  const sdEl = document.querySelector('.date__details .start__date');
  const edEl = document.querySelector('.date__details .end__date');

  if (sdEl) sd = normalizeText(sdEl.textContent);
  if (edEl) ed = normalizeText(edEl.textContent);

  const wrapper = element.closest('.hotel-card-wrapper');

  $bc.setSource('db.tourForm', {
    hotelName: element.closest('.hotel-card').querySelector('.hotel-card-title').textContent,
    hotelRate: element.closest('.hotel-card').querySelector('.hotel-card-star').dataset.value,
    hotelService: service,
    tourName: document.querySelector('.tour-name').textContent,

    doubleP: wrapper.querySelector('.tourInventory__details__item__double .tourInventory__details__item__price')
      .textContent,
    singleP: wrapper.querySelector('.tourInventory__details__item__single .tourInventory__details__item__price')
      .textContent,
    wBedP: wrapper.querySelector('.tourInventory__details__item__wBed .tourInventory__details__item__price')
      .textContent,
    woBedP: wrapper.querySelector('.tourInventory__details__item__woBed .tourInventory__details__item__price')
      .textContent,

    doubleU:
      wrapper.querySelector('.tourInventory__details__item__double .tourInventory__details__item__unit')?.textContent ||
      ' ',
    singleU:
      wrapper.querySelector('.tourInventory__details__item__single .tourInventory__details__item__unit')?.textContent ||
      ' ',
    wBedU:
      wrapper.querySelector('.tourInventory__details__item__wBed .tourInventory__details__item__unit')?.textContent ||
      ' ',
    woBedU:
      wrapper.querySelector('.tourInventory__details__item__woBed .tourInventory__details__item__unit')?.textContent ||
      ' ',

    startDate: sd,
    endDate: ed,

    // weekdayStartDate: document.querySelector('.origins__start__weekday')?.textContent || ' ',
    // weekdayEndDate: document.querySelector('.destinations__start__weekday')?.textContent || ' ',

    departureName: document.querySelector('.origins__city')?.textContent || ' ',
    destinationName: document.querySelector('.destinations__city')?.textContent || ' ',

    startTime:
      document.querySelector('.execution__details__path__origins .execution__details__path__item .__times__start')
        ?.textContent || ' ',
    endTime:
      document.querySelector('.execution__details__path__destinations .execution__details__path__item .__times__start')
        ?.textContent || ' ',

    run: true,
  });
};

const onrenderedSchmaTourBookingFormIns = async () => {
  try {
    const containerIns = document.querySelector('.tour__booking__form__modal__container_Ins');
    if (!containerIns) return;

    const formContainer = containerIns.querySelector('.tour__booking__form__container');
    const whiteModal = document.querySelector('#white-modal');

    const setInputValue = (root, inputSelector, textSelector) => {
      const input = root.querySelector(inputSelector);
      const textEl = root.querySelector(textSelector);
      if (input && textEl) input.value = textEl.textContent.trim();
    };

    const setInputFromExternal = (inputRoot, textRoot, inputSelector, textSelector) => {
      const input = inputRoot.querySelector(inputSelector);
      const textEl = textRoot?.querySelector(textSelector);
      if (input && textEl) input.value = textEl.textContent.trim();
    };

    const setPlaceholder = (root, inputSelector, placeholderText) => {
      const input = root.querySelector(inputSelector);
      if (input) input.placeholder = placeholderText;
    };

    // از containerIns
    setInputValue(containerIns, '.adult-count input', '.adult__count__container');
    setInputValue(containerIns, '.child-count input', '.child__count__container');
    setInputValue(containerIns, '.infant-count input', '.infant__count__container');
    setInputValue(containerIns, '.hotel-name input', '.hotel__name__container');
    setInputValue(containerIns, '.hotel-service input', '.hotel__service__container');
    setInputValue(containerIns, '.hotel-rate input', '.hotel__rate__container');
    setInputValue(containerIns, '.tour-name input', '.tour__name__container');

    // مقادیر مالی از white-modal
    setInputFromExternal(formContainer, whiteModal, '.total-amountF input', '.total-amount');
    setInputFromExternal(formContainer, whiteModal, '.total-advanceF input', '.Total-amount-facilities');
    setInputFromExternal(formContainer, whiteModal, '.amount-facilitiesF input', '.Total-advance-payment');
    setInputFromExternal(formContainer, whiteModal, '.amount-eachF input', '.amount-each-installment');

    // Placeholder ها
    setPlaceholder(containerIns, '.first-last-name input', 'نام و نام خانوادگی');
    setPlaceholder(containerIns, '.phone input', 'شماره تماس');
    setPlaceholder(containerIns, '.message input', 'توضیحات');
  } catch (err) {
    console.error('onrenderedSchmaTourBookingForm:', err.message);
  }
};

const onrenderedSchmaTourBookingForm = async (args) => {
  try {
    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.adult-count')
      .querySelector('input').value = document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.adult__count__container').textContent;
    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.child-count')
      .querySelector('input').value = document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.child__count__container').textContent;
    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.infant-count')
      .querySelector('input').value = document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.infant__count__container').textContent;
    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.hotel-name')
      .querySelector('input').value = document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.hotel__name__container').textContent;
    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.hotel-service')
      .querySelector('input').value = document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.hotel__service__container').textContent;
    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.hotel-rate')
      .querySelector('input').value = document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.hotel__rate__container').textContent;
    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.tour-name')
      .querySelector('input').value = document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.tour__name__container').textContent;

    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('.first-last-name input').placeholder = 'نام و نام خانوادگی';
    document.querySelector('.tour__booking__form__modal__container').querySelector('.phone input').placeholder =
      'شماره تماس';
    document.querySelector('.tour__booking__form__modal__container').querySelector('.message input').placeholder =
      'توضیحات';
  } catch (err) {
    console.error('onrenderedSchmaTourBookingForm=' + err.lineNumber + ',' + err.message);
  }
};
const callbackSourceTourBookingForm = async (args) => {
  try {
    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('button')
      .classList.add('button--loading');
    $bc.setSource('db.tourBookingForm', {
      value: JSON.stringify(args.source?.rows[0]),
      captcha: document.querySelector('.tour__booking__form__modal__container').querySelector("input[name='captcha']")
        .value,
      captchaid: document
        .querySelector('.tour__booking__form__modal__container')
        .querySelector("input[name='captchaid']").value,
      run: true,
    });
  } catch (err) {
    console.error('callbackSourceTourBookingForm=' + err.lineNumber + ',' + err.message);
  }
};
const OnProcessedTourBookingForm = async (args) => {
  try {
    var response = args.response;
    var json = await response.json();
    var errorid = json.errorid;
    document
      .querySelector('.tour__booking__form__modal__container')
      .querySelector('button')
      .classList.remove('button--loading');
    if (errorid == '6') {
      document
        .querySelector('.tour__booking__form__modal__container')
        .querySelector('.message__action__container').innerHTML = 'درخواست شما با موفقیت ثبت شد';
    } else {
      document
        .querySelector('.tour__booking__form__modal__container')
        .querySelector('.message__action__container').innerHTML = 'خطایی رخ داده, لطفا مجدد اقدام کنید';
    }
    setTimeout(function () {
      document
        .querySelector('.tour__booking__form__modal__container')
        .querySelector('.message__action__container').innerHTML = '';
      setTimeout(function () {
        document.querySelector('.tour__booking__form__modal__container').classList.add('hidden');
      }, 2000);
    }, 3000);
  } catch (err) {
    console.error('OnProcessedTourBookingForm=' + err.lineNumber + ',' + err.message);
  }
};

const callbackSourceTourBookingFormIns = async (args) => {
  try {
    document
      .querySelector('.tour__booking__form__modal__container_Ins')
      .querySelector('button')
      .classList.add('button--loading');
    $bc.setSource('db.tourBookingFormIns', {
      value: JSON.stringify(args.source?.rows[0]),
      captcha: document
        .querySelector('.tour__booking__form__modal__container_Ins')
        .querySelector("input[name='captcha']").value,
      captchaid: document
        .querySelector('.tour__booking__form__modal__container_Ins')
        .querySelector("input[name='captchaid']").value,
      run: true,
    });
  } catch (err) {
    console.error('callbackSourcetourBookingFormIns=' + err.lineNumber + ',' + err.message);
  }
};
const OnProcessedTourBookingFormIns = async (args) => {
  try {
    var response = args.response;
    var json = await response.json();
    var errorid = json.errorid;
    document
      .querySelector('.tour__booking__form__modal__container_Ins')
      .querySelector('button')
      .classList.remove('button--loading');
    if (errorid == '6') {
      document
        .querySelector('.tour__booking__form__modal__container_Ins')
        .querySelector('.message__action__container').innerHTML = 'درخواست شما با موفقیت ثبت شد';
    } else {
      document
        .querySelector('.tour__booking__form__modal__container_Ins')
        .querySelector('.message__action__container').innerHTML = 'خطایی رخ داده, لطفا مجدد اقدام کنید';
    }
    setTimeout(function () {
      document
        .querySelector('.tour__booking__form__modal__container_Ins')
        .querySelector('.message__action__container').innerHTML = '';
      setTimeout(function () {
        document.querySelector('.tour__booking__form__modal__container_Ins').classList.add('hidden');
      }, 2000);
    }, 3000);
  } catch (err) {
    console.error('OnProcessedtourBookingFormIns=' + err.lineNumber + ',' + err.message);
  }
};

document.querySelectorAll('nav li[data-target]').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = item.getAttribute('data-target');
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      const yOffset = -100;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// filter-hotel-card
function initializeHotelFilters() {
  const normalizeText = (text) => (text ? text.replace(/\s|\./g, '').normalize('NFKD').toLowerCase() : '');

  const selectedStars = new Set();
  const selectedServices = new Set();
  let hotelNameQuery = '';

  const hotelNameInput = document.querySelector('.hotel-name-input');
  const starInputs = document.querySelectorAll('.star-hotel-input');
  const serviceInputs = document.querySelectorAll('.filter-hotel-services');
  const minRange = document.getElementById('hotel-minRange');
  const maxRange = document.getElementById('hotel-maxRange');
  const minValueSpan = document.getElementById('hotel-minValue');
  const maxValueSpan = document.getElementById('hotel-maxValue');
  const rangeTrack = document.getElementById('hotel-rangeTrack');

  const hotelCards = document.querySelectorAll('.hotel-card');

  const formatPrice = (val) => val.toLocaleString('fa-IR');

  const parsePrice = (text) => parseInt(text, 10) || 0;

  const allPrices = Array.from(hotelCards)
    .map((card) => {
      const priceContainer = card.querySelector('[data-price]');
      return priceContainer ? parsePrice(priceContainer.getAttribute('data-price')) : 0;
    })
    .filter((p) => p > 0);

  const REAL_MIN = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const REAL_MAX = allPrices.length > 0 ? Math.max(...allPrices) : 0;

  let realMin = REAL_MIN;
  let realMax = REAL_MAX;

  function updateFilterCount() {
    const filterCountEl = document.getElementById('filterBtnCountHotel');
    const filterBtn = document.getElementById('filterBtnHotel');
    const filterIcon = document.getElementById('filterIconHotel');

    if (!filterCountEl || !filterBtn || !filterIcon) return;

    let count = 0;

    if (selectedStars.size > 0) count++;
    if (selectedServices.size > 0) count++;
    if (realMin > REAL_MIN || realMax < REAL_MAX) count++;
    if (hotelNameQuery.trim() !== '') count++;

    if (count > 0) {
      filterCountEl.classList.remove('hidden');
      filterCountEl.classList.add('flex');
      filterCountEl.textContent = count;

      filterBtn.classList.remove('bg-white');
      filterBtn.classList.add('bg-primary-500', 'shadow-small-btn-shadow', 'text-white');

      filterIcon.querySelectorAll('path, ellipse').forEach((el) => {
        el.setAttribute('stroke', '#11C086');
      });
    } else {
      filterCountEl.classList.add('hidden');
      filterCountEl.classList.remove('flex');
      filterCountEl.textContent = '';

      filterBtn.classList.remove('bg-primary-500', 'shadow-small-btn-shadow', 'text-white');
      filterBtn.classList.add('bg-white');

      filterIcon.querySelectorAll('path, ellipse').forEach((el) => {
        el.setAttribute('stroke', '#33363F');
      });
    }
  }

  function filterCardsExtended() {
    hotelCards.forEach((card) => {
      const starElems = card.querySelectorAll('.hotel-card-star');
      const serviceElems = card.querySelectorAll('.hotel-card-service');
      const hotelNameElem = card.querySelector('.hotel-card-title');
      const priceContainer = card.querySelector('[data-price]');

      const cardStars = Array.from(starElems).map((el) => normalizeText(el.textContent));
      const cardServices = Array.from(serviceElems).map((el) => normalizeText(el.textContent));
      const cardHotelName = normalizeText(hotelNameElem?.textContent);
      const cardPrice = priceContainer ? parsePrice(priceContainer.getAttribute('data-price')) : 0;

      const starMatch = selectedStars.size === 0 || cardStars.some((star) => selectedStars.has(star));
      const serviceMatch = selectedServices.size === 0 || cardServices.some((service) => selectedServices.has(service));
      const nameMatch = !hotelNameQuery || cardHotelName.includes(normalizeText(hotelNameQuery));
      const priceMatch = cardPrice >= realMin && cardPrice <= realMax;

      card.style.display = starMatch && serviceMatch && nameMatch && priceMatch ? 'flex' : 'none';
    });

    updateFilterCount();
  }

  starInputs.forEach((el) => {
    el.addEventListener('click', () => {
      const wrapper = el.closest('.star-hotel-wrapper');
      const rawText = wrapper?.querySelector('.star-hotel')?.textContent || '';
      const match = normalizeText(rawText).match(/(\d+)ستاره/);
      const label = match ? match[0] : '';

      if (!label) return;

      const isActive = selectedStars.has(label);
      el.classList.toggle('bg-primary-500', !isActive);
      el.classList.toggle('border-primary-500', !isActive);

      isActive ? selectedStars.delete(label) : selectedStars.add(label);
      filterCardsExtended();
    });
  });

  serviceInputs.forEach((el) => {
    el.addEventListener('click', () => {
      const labelElem = el.querySelector('.filter-hotel-services-name');
      const label = normalizeText(labelElem ? labelElem.textContent : el.textContent);

      const isActive = selectedServices.has(label);
      el.classList.toggle('text-primary-500', !isActive);
      el.classList.toggle('border-primary-500', !isActive);

      isActive ? selectedServices.delete(label) : selectedServices.add(label);
      filterCardsExtended();
    });
  });

  if (hotelNameInput) {
    hotelNameInput.addEventListener('input', () => {
      hotelNameQuery = hotelNameInput.value;
      filterCardsExtended();
    });
  }

  function updatePriceValues() {
    if (!minRange || !maxRange || !minValueSpan || !maxValueSpan || !rangeTrack) {
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
    minRange.value = minRange.value || '0';
    minRange.addEventListener('input', updatePriceValues);
  }
  if (maxRange) {
    maxRange.value = maxRange.value || '100';
    maxRange.addEventListener('input', updatePriceValues);
  }

  setTimeout(updatePriceValues, 100);
  filterCardsExtended();
}

const waitUntilHotelCardsLoaded = (callback, maxTries = 20, interval = 300) => {
  let tries = 0;
  const timer = setInterval(() => {
    const cards = document.querySelectorAll('.hotel-card');
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

// TOUR INSTALLMENT
// var limitrange = 150;
// var rangeInput = document.getElementById('myRange');
// var amountInput = document.getElementById('amount');
// rangeInput.addEventListener('input', updateRangeBackground);
// var loanAmount = 8;
// var loanMonths = 4;
// var interestRate = 5;
// var totalprice = 0;

// var adultCountF = 1;
// var childbedCountF = 0;
// var childwobedCountF = 0;
// var infantCountF = 0;

// function selectPlanInstallment(el, plan, monthplan, limitinstallment, lm, ir) {
//   loanMonths = lm;
//   interestRate = ir;

//   document.querySelectorAll('.plan-radio').forEach((element) => {
//     element.addEventListener('click', function (ele) {
//       document.querySelectorAll('.plan-container').forEach((div) => {
//         div.querySelector('label').classList.remove('bg-primary-500');
//         div.querySelector('label').classList.remove('text-white');
//         div.querySelector('label').classList.add('text-neutralcolor-900');
//         div.querySelector('label').classList.add('bg-gray-100');
//       });
//     });
//   });

//   el.querySelector('label').classList.add('bg-primary-500');
//   el.querySelector('label').classList.remove('bg-gray-100');
//   el.querySelector('label').classList.add('text-white');
//   el.querySelector('label').classList.remove('text-neutralcolor-900');

//   limitrange = limitinstallment;
//   rangeInput.setAttribute('max', limitrange);
//   document.getElementById('limit-range').innerText = limitrange;

//   document
//     .getElementById('month-list')
//     .querySelectorAll('li')
//     .forEach((element) => {
//       element.classList.add('hidden');
//     });

//   document.querySelectorAll(`.${monthplan}`).forEach((element) => {
//     element.classList.remove('hidden');
//   });

//   updateRangeBackground();
//   calculateInstallments();
// }

// function updateRangeBackground() {
//   const value = parseFloat(rangeInput.value);
//   const min = parseFloat(rangeInput.min);
//   const max = parseFloat(rangeInput.max);
//   const percentage = ((value - min) / (max - min)) * 100;
//   rangeInput.style.background = `linear-gradient(to right, #2e58d1 ${percentage}%, #e5e7eb ${percentage}%)`;
// }

// window.addEventListener('DOMContentLoaded', () => {
//   updateRangeBackground();
// });

// function updateLoanAmount(amount) {
//   loanAmount = amount;
//   document.getElementById('myRange').value = amount;
//   updateRangeBackground();
//   calculateInstallments();
// }

// function updateLoanFromRange(amount) {
//   loanAmount = amount;
//   document.getElementById('amount').value = amount;
//   updateRangeBackground();
//   calculateInstallments();
// }

// function increase(element) {
//   loanAmount = Math.min(parseInt(loanAmount) + 1, limitrange);
//   document.getElementById('amount').value = loanAmount;
//   document.getElementById('myRange').value = loanAmount;
//   calculateInstallments();
//   updateRangeBackground();
// }

// function decrease() {
//   loanAmount = Math.max(parseInt(loanAmount) - 1, 8);
//   document.getElementById('amount').value = loanAmount;
//   document.getElementById('myRange').value = loanAmount;
//   calculateInstallments();
//   updateRangeBackground();
// }

// function calculateMonth(months, interestrate, element) {
//   const allTabs = document.querySelectorAll('#month-list li');
//   allTabs.forEach(function (tab) {
//     tab.classList.remove('bg-primary-500');
//     tab.classList.add('bg-gray-100');

//     tab.classList.add('text-neutralcolor-900');
//     tab.classList.remove('text-white');
//   });

//   element.classList.remove('text-neutralcolor-900');
//   element.classList.add('text-white');

//   element.classList.remove('bg-gray-100');
//   element.classList.add('bg-primary-500');

//   loanMonths = months;
//   interestRate = interestrate;
//   calculateInstallments();
// }

// function calculateInstallments() {
//   const toEnglishNumber = (str) => {
//     return str.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٬,]/g, '');
//   };

//   const safeParse = (id) => {
//     const el = document.getElementById(id);
//     if (!el) {
//       console.warn(`⛔ عنصر ${id} پیدا نشد: ${id}`);
//       return 0;
//     }
//     return parseFloat(toEnglishNumber(el.value || '0')) || 0;
//   };

//   const inpHDNdoubleP = safeParse('inphidden-doubleP');
//   const inpHDNsingleP = safeParse('inphidden-singleP');
//   const inpHDNwBedP = safeParse('inphidden-wBedP');
//   const inpHDNwoBedP = safeParse('inphidden-woBedP');

//   document.getElementById('adult-installment').disabled = inpHDNdoubleP === 0 && inpHDNsingleP === 0;
//   document.getElementById('child-bed-installment').disabled = inpHDNwBedP === 0;
//   document.getElementById('child-installment').disabled = inpHDNwoBedP === 0;
//   document.getElementById('infant-installment').disabled = inpHDNwoBedP === 0;

//   adultCountF = parseInt(document.getElementById('adult-installment')?.value || '0');
//   childbedCountF = parseInt(document.getElementById('child-bed-installment')?.value || '0');
//   childwobedCountF = parseInt(document.getElementById('child-installment')?.value || '0');
//   infantCountF = parseInt(document.getElementById('infant-installment')?.value || '0');

//   if (adultCountF === 1) {
//     totalprice =
//       adultCountF * inpHDNsingleP +
//       childwobedCountF * inpHDNwoBedP +
//       infantCountF * inpHDNwoBedP +
//       childbedCountF * inpHDNwBedP;
//   } else {
//     totalprice =
//       adultCountF * inpHDNdoubleP +
//       childwobedCountF * inpHDNwoBedP +
//       infantCountF * inpHDNwoBedP +
//       childbedCountF * inpHDNwBedP;
//   }

//   const totalAmount = (parseFloat(loanAmount) || 0) * 1_000_000;

//   const totalAdvancePayment = totalprice - totalAmount;

//   if (totalAmount <= 0) {
//     document.querySelector('.total-amount').textContent = totalprice.toLocaleString();
//     document.querySelector('.Total-amount-facilities').textContent = totalprice.toLocaleString();
//     document.querySelector('.Total-advance-payment').textContent = totalprice.toLocaleString();
//     document.querySelector('.amount-each-installment').textContent = '0';
//     return;
//   }

//   const totalInterest = interestRate * loanMonths * 1_000_000;

//   const totalAmountWithFacilities = totalInterest + totalAmount;

//   const installmentAmount = totalAmountWithFacilities / loanMonths;

//   document.querySelector('.total-amount').textContent = totalprice.toLocaleString();
//   document.querySelector('.Total-amount-facilities').textContent = totalAmountWithFacilities.toLocaleString();
//   document.querySelector('.Total-advance-payment').textContent = totalAdvancePayment.toLocaleString();
//   document.querySelector('.amount-each-installment').textContent = installmentAmount.toLocaleString();
// }

// updateRangeBackground();
// calculateInstallments();

// function closeModalContainerForm(event) {
//   if (event.target === event.currentTarget) {
//     event.currentTarget.classList.add('hidden');
//   }
// }
