export default function scrollToAnchor() {
  const link = Array.from(document.querySelectorAll('a')).filter((v) => /^#/.test(v.getAttribute('href')));
  let isMoving = false;

  function scrollToY(element, duration = 600) {
    const offset = getOffset(element);

    // cancel if already on target position
    if (window.pageYOffset === offset) return;

    const cosParameter = (window.pageYOffset - offset) / 2;
    let scrollCount = 0,
      oldTimestamp = null;

    function getOffset(el) {
      const element = document.querySelector(el);
      return element.getBoundingClientRect().top + pageYOffset;
    }

    function step(newTimestamp) {
      isMoving = true;

      if (oldTimestamp !== null) {
        // if duration is 0 scrollCount will be Infinity
        scrollCount += (Math.PI * (newTimestamp - oldTimestamp)) / duration;
        if (scrollCount >= Math.PI) {
          isMoving = false;
          return window.scrollTo(0, offset);
        }
        window.scrollTo(
          0,
          cosParameter + offset + cosParameter * Math.cos(scrollCount),
        );
      }
      oldTimestamp = newTimestamp;
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  link.forEach((v) => {
    v.addEventListener('click', function (e) {
      e.preventDefault();
      const moveTo = this.getAttribute('href');
      if (isMoving) return;
      scrollToY(moveTo);
    });
  });
}