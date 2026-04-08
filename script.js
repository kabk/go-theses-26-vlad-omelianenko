document.addEventListener("DOMContentLoaded", () => {
  renderChapterOne();
  renderTooltips();
  initBooklet();
});

function renderDoubleText(containerId, templateId) {
  const container = document.getElementById(containerId);
  const template = document.getElementById(templateId);

  if (!container || !template) return;

  function buildColumn(side, className) {
    const wrapper = document.createElement("div");
    wrapper.className = `column ${className}`;

    const fragment = template.content.cloneNode(true);

    fragment.querySelectorAll("[data-left], [data-right]").forEach((el) => {
      const classString = side === "left" ? el.dataset.left : el.dataset.right;
      if (!classString) return;

      classString
        .split(" ")
        .filter(Boolean)
        .forEach((cls) => el.classList.add(cls));
    });

    wrapper.appendChild(fragment);
    return wrapper;
  }

  container.appendChild(buildColumn("left", "left-column"));
  container.appendChild(buildColumn("right", "right-column"));
}

renderDoubleText("intro-body", "intro-source");
renderDoubleText("following-body", "following-source");
renderDoubleText("page-body", "page-source");
renderDoubleText("publishing-body", "publishing-source");
renderDoubleText("conclusion-body", "conclusion-source");
renderDoubleText("bibliography-body", "bibliography-source");

function initBooklet() {
  const leftPage = document.querySelector(".left-page");
  const rightPage = document.querySelector(".right-page");
  const leftPageImg = document.querySelector(".left-page img");
  const rightPageImg = document.querySelector(".right-page img");

  if (!leftPage || !rightPage || !leftPageImg || !rightPageImg) return;

  const totalPages = 8;

  function pagePath(pageNumber) {
    const padded = String(pageNumber).padStart(2, "0");
    return `./Issue/IssuePage_${padded}.jpg`;
  }

  const spreads = [{ left: null, right: 1 }];

  for (let p = 2; p <= totalPages; p += 2) {
    if (p === totalPages) {
      spreads.push({ left: p, right: null });
    } else {
      spreads.push({ left: p, right: p + 1 });
    }
  }

  let currentSpread = 0;

  function renderPage(container, img, pageNumber) {
    if (pageNumber === null) {
      img.style.visibility = "hidden";
      container.classList.add("is-empty");
    } else {
      img.src = pagePath(pageNumber);
      img.style.visibility = "visible";
      container.classList.remove("is-empty");
    }
  }

  function renderSpread() {
    const spread = spreads[currentSpread];
    renderPage(leftPage, leftPageImg, spread.left);
    renderPage(rightPage, rightPageImg, spread.right);
  }

  function nextSpread() {
    if (currentSpread < spreads.length - 1) {
      currentSpread += 1;
      renderSpread();
    }
  }

  function previousSpread() {
    if (currentSpread > 0) {
      currentSpread -= 1;
      renderSpread();
    }
  }

  rightPage.addEventListener("click", nextSpread);
  leftPage.addEventListener("click", previousSpread);

  renderSpread();
}
