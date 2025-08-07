const main = () => {
  const url = new URL(location.href);
  const variation = url.searchParams.get("variation") || "a";
  let h1Content = "";
  switch (variation) {
    case "a":
    default:
      h1Content =
        "<OLD>, Good morning! This is a new Day by <CHANGEABLE_CONTENT>.";
      break;
    case "b":
      h1Content =
        "<OLD>, Good afternoon! This is a new Day by <CHANGEABLE_CONTENT>.";
      break;
    case "c":
      h1Content =
        "<OLD>, Good evening! This is a new Day by <CHANGEABLE_CONTENT>.";
      break;
    case "d":
      h1Content =
        "<OLD>, Good night! Tomorrow will be a new Day by <CHANGEABLE_CONTENT>.";
      break;
  }
  let h1 = document.querySelector("h1");
  if (!h1) {
    h1 = document.createElement("h1");
    h1.className = "variation-header";
    h1.textContent = "Loading...";
    document.body.prepend(h1);
  }
  h1.textContent = h1Content.replace(
    "<OLD>",
    h1.textContent?.toLocaleLowerCase()?.includes("loading")
      ? "Gorgeous"
      : h1.textContent || "Hello",
  );
};
main();
const observer = new MutationObserver(() => {
  const allHOnes = document.querySelectorAll("h1");
  if (allHOnes.length > 1) {
    // delete the custom one and run main
    const customH1 = document.querySelector(".variation-header");
    if (customH1) {
      customH1.remove();
    }
    main();
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
