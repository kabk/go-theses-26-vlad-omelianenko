document.addEventListener("DOMContentLoaded", () => {
  renderDoubleText("intro-body", "intro-source");
  renderDoubleText("following-body", "following-source");
  renderDoubleText("page-body", "page-source");
  renderDoubleText("publishing-body", "publishing-source");
  renderDoubleText("conclusion-body", "conclusion-source");
  renderDoubleText("bibliography-body", "bibliography-source");
  renderBracketTooltips();
  initInteractiveTooltips();
  initImageLightbox();
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

function renderBracketTooltips() {
  document
    .querySelectorAll(".annotated-text")
    .forEach((block) => {
      block.innerHTML = block.innerHTML.replace(
        /(\S+)\s*\[([^\]]+)\]/g,
        (_, word, tip) => `
        <span class="tooltip-wrap">
          <button type="button" class="tooltip-trigger">${word}</button>
          <span class="tooltip-text">${tip}</span>
        </span>
      `,
      );
    });
}

function positionTooltip(wrap) {
  const trigger = wrap.querySelector(".tooltip-trigger");
  const tooltip = wrap.querySelector(".tooltip-text");
  if (!trigger || !tooltip) return;

  const gap = 8;
  const margin = 12;

  tooltip.style.left = "0px";
  tooltip.style.top = "0px";

  const triggerRect = trigger.getBoundingClientRect();

  const oldVisibility = tooltip.style.visibility;
  const oldOpacity = tooltip.style.opacity;

  tooltip.style.visibility = "hidden";
  tooltip.style.opacity = "1";

  const tooltipRect = tooltip.getBoundingClientRect();
  const tooltipWidth = tooltipRect.width;
  const tooltipHeight = tooltipRect.height;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = triggerRect.right + gap;
  let top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;

  if (left + tooltipWidth > viewportWidth - margin) {
    left = triggerRect.left - tooltipWidth - gap;
  }

  if (left < margin) {
    left = margin;
  }

  if (top < margin) {
    top = margin;
  }

  if (top + tooltipHeight > viewportHeight - margin) {
    top = viewportHeight - tooltipHeight - margin;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;

  tooltip.style.visibility = oldVisibility;
  tooltip.style.opacity = oldOpacity;
}

function initInteractiveTooltips() {
  const desktopHover = window.matchMedia("(hover: hover) and (pointer: fine)");

  function closeAll(except = null) {
    document
      .querySelectorAll(".right-column .tooltip-wrap.is-open")
      .forEach((wrap) => {
        if (wrap !== except) {
          wrap.classList.remove("is-open");
        }
      });
  }

  document.querySelectorAll(".right-column .tooltip-wrap").forEach((wrap) => {
    const trigger = wrap.querySelector(".tooltip-trigger");

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();

      if (desktopHover.matches) return;

      const isOpen = wrap.classList.contains("is-open");
      closeAll();

      if (!isOpen) {
        wrap.classList.add("is-open");
        positionTooltip(wrap);
      }
    });

    if (desktopHover.matches) {
      wrap.addEventListener("mouseenter", () => {
        positionTooltip(wrap);
      });

      trigger.addEventListener("focus", () => {
        positionTooltip(wrap);
      });
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".right-column .tooltip-wrap")) {
      closeAll();
    }
  });

  window.addEventListener("resize", () => {
    document
      .querySelectorAll(".right-column .tooltip-wrap.is-open")
      .forEach((wrap) => {
        positionTooltip(wrap);
      });
  });

  window.addEventListener(
    "scroll",
    () => {
      document
        .querySelectorAll(".right-column .tooltip-wrap.is-open")
        .forEach((wrap) => {
          positionTooltip(wrap);
        });
    },
    true,
  );
}

function initImageLightbox() {
  const lightbox = document.getElementById("image-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");

  if (!lightbox || !lightboxImage) return;

  document.addEventListener("click", (event) => {
    const clickedImage = event.target.closest("img");

    if (clickedImage && !lightbox.contains(clickedImage)) {
      if (clickedImage.classList.contains("hidden-image")) return;

      lightboxImage.src = clickedImage.currentSrc || clickedImage.src;
      lightboxImage.alt = clickedImage.alt || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      return;
    }

    if (!lightbox.hidden) {
      lightbox.hidden = true;
      lightboxImage.src = "";
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      lightbox.hidden = true;
      lightboxImage.src = "";
      document.body.style.overflow = "";
    }
  });
}