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

          // آپدیت تصویر
          img.src = `/${matched.originalImage}`;

          // اگر والد مستقیم تصویر لینک نیست، wrap کنیم
          if (img.parentElement.tagName.toLowerCase() !== "a") {
            const figure = img.closest("figure");
            const figcaption = figure
              ? figure.querySelector("figcaption")
              : null;

            const imgClone = img.cloneNode(true);
            const a = document.createElement("a");
            a.href = `/${pageName}?id=${hotelId}`;
            a.appendChild(imgClone);
            if (figcaption) a.appendChild(figcaption.cloneNode(true));

            figure.innerHTML = "";
            figure.appendChild(a);

            // const a = document.createElement("a");
            // a.href = `/${pageName}?id=${hotelId}`;

            // a.appendChild(img);
            // if (figcaption) a.appendChild(figcaption);

            // if (figure) {
            //     figure.innerHTML = "";
            //     figure.appendChild(a);
            // }
          }
        });
    }
  } catch (err) {
    console.error(
      "onProcessedHotelsImg=" + (err.lineNumber || "-") + "," + err.message
    );
  }
};
