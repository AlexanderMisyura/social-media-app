if (document.querySelector(".js-tab-trigger")) {
  const tabTriggers = document.querySelectorAll(".js-tab-trigger");
  const tabContentBlocks = document.querySelectorAll(".tab");

  const updateTabs = (newActiveTabTrigger) => {
    tabTriggers.forEach((tabTrigger) =>
      tabTrigger.classList.remove("is-active")
    );
    newActiveTabTrigger.classList.add("is-active");
  };

  const updateContent = (activeTrigger) => {
    const activeContentBlock = document.getElementById(
      activeTrigger.dataset.tab
    );
    tabContentBlocks.forEach((block) => {
      block.classList.add("is-hidden");
    });
    activeContentBlock.classList.remove("is-hidden");
  };

  tabTriggers.forEach((tabTrigger) => {
    tabTrigger.addEventListener("click", (e) => {
      updateTabs(e.currentTarget);
      updateContent(e.currentTarget);
    });
  });
}
