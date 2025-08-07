(function () {
  const loadScript = () => {
    const url = new URL(location.href);
    let variation = url.searchParams.get("variation");
    /**
     * @type {string[]}
     */
    const ignoredPaths = [];
    //if url contains any of the ignored paths, do not load the script
    for (const path of ignoredPaths) {
      if (location.pathname.includes(path)) {
        return;
      }
    }
    if (!variation) {
      const hour = new Date().getHours();
      if (hour >= 4 && hour <= 12) variation = "a";
      else if (hour >= 13 && hour <= 17) variation = "b";
      else if (hour >= 18 && hour <= 21) variation = "c";
      else variation = "d";

      url.searchParams.set("variation", variation);
      location.href = url.toString();
    } else {
      const path = location.pathname;
      const script = document.createElement("script");
      script.src =
        "http://localhost:6969/scripts/<PROJECT_ID>.js?variation=" +
        variation +
        "&from=" +
        encodeURIComponent(path);
      document.head.appendChild(script);
    }
  };

  const hookRouter = () => {
    const _pushState = history.pushState;
    history.pushState = function (...args) {
      _pushState.apply(this, args);
      window.dispatchEvent(new Event("pushstate"));
      window.dispatchEvent(new Event("locationchange"));
    };

    const _replaceState = history.replaceState;
    history.replaceState = function (...args) {
      _replaceState.apply(this, args);
      window.dispatchEvent(new Event("replacestate"));
      window.dispatchEvent(new Event("locationchange"));
    };

    window.addEventListener("popstate", () => {
      window.dispatchEvent(new Event("locationchange"));
    });

    window.addEventListener("locationchange", () => {
      const existing = document.querySelector("script[data-loader]");
      if (existing) existing.remove();
      loadScript();
    });
  };

  hookRouter();
  loadScript();
})();
