// typing.js
(() => {
  const el = document.querySelector(".typing-text");
  if (!el) return;

  const text = "to my portfolio";
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 90);
    }
  }

 document.addEventListener("DOMContentLoaded", () => {
  el.textContent = "";
  setTimeout(type, 500);
});

})();
