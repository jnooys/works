export default class ScrollActive {
  constructor(target, options) {
    this.targetList = [];
    this.options = {
      distance: 0,
      invisible: false,
      reverse: false,
      activeClass: 'on',
      activePoint: {},
    };
    Object.assign(this.options, options);

    this.event(target);
  }

  static getBCR($target) {
    const clientRect = $target.getBoundingClientRect();
    return { top: clientRect.top, bottom: clientRect.bottom };
  }

  getPoint($target, i) {
    const documentHeight = document.documentElement.scrollHeight;
    const { pageYOffset } = window;
    const lastScroll = Math.max(documentHeight - window.innerHeight, 0);
    const elementRect = this.constructor.getBCR($target);
    const distance = typeof this.options.distance === 'function' ? this.options.distance() : this.options.distance;
    const activePoint = Object.entries(this.options.activePoint).reduce((a, v) => {
      const [key, value] = v;
      a[key] = typeof value === 'function' ? value() : value;
      return a;
    }, {});
    const point = {};
    point.from = Math.max(Math.min(Math.floor(pageYOffset + elementRect.top - distance), lastScroll), 0);
    point.to = (!this.options.reverse || point.from === lastScroll) ? documentHeight : i === this.targetLength - 1 ? pageYOffset + elementRect.bottom : Math.min(Math.floor(pageYOffset + elementRect.bottom - distance), lastScroll);
    return { ...point, ...activePoint };
  }

  init(target) {
    this.targetElement = document.querySelectorAll(target);
    this.targetLength = this.targetElement.length;
    this.targetList = Array.from(this.targetElement).map(($el, i) => ({ $el, ...this.getPoint($el, i) }));
  }

  scroll(scrollTop) {
    this.targetList.forEach((el) => {
      if (scrollTop >= el.to) {
        el.$el.classList.remove(this.options.activeClass);
        return;
      }
      if (scrollTop >= el.from) {
        el.$el.classList.add(this.options.activeClass);
        return;
      }
      if (this.options.invisible) {
        if (scrollTop <= Math.max(el.from - window.innerHeight, 0)) {
          el.$el.classList.remove(this.options.activeClass);
        }
        return;
      }
      el.$el.classList.remove(this.options.activeClass);
    });
  }

  resize() {
    this.targetList = this.targetList.map((el, i) => ({ ...el, ...this.getPoint(el.$el, i) }));
  }

  event(target) {
    let isThrolling = false;

    window.addEventListener('load', () => {
      this.init(target);
    });

    window.addEventListener('scroll', () => {
      const { pageYOffset } = window;
      this.scroll(pageYOffset);
    });

    window.addEventListener('resize', () => {
      if (isThrolling) { return; }
      isThrolling = true;
      setTimeout(() => {
        this.resize();
        isThrolling = false;
      }, 150);
    });
  }
}

export class NavActive extends ScrollActive {
  init(target) {
    super.init(target);
    this.options.reverse = true;
    this.getTargetPoint();
  }

  resize() {
    super.resize();
    this.getTargetPoint();
  }

  getTargetPoint() {
    this.targetList = this.targetList.reduce((acc, el, i) => {
      const $target = document.querySelector(this.targetElement[i].getAttribute('href'));
      const point = { ...el, ...this.getPoint($target, i) };

      acc.push(point);
      return acc;
    }, []);
  }
}
