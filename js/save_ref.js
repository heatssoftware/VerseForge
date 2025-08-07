document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (!ref) return;

  document.querySelectorAll("a[href]").forEach(link => {
    const url = new URL(link.href, window.location.origin);

    if (url.origin === window.location.origin) {
      url.searchParams.set("ref", ref);
      link.href = url.toString();
    }
  });
});