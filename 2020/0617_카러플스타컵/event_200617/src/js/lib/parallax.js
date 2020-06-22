export default class Parallax {
  
  constructor(elementArray) {
    this.duration = 1000;
    this.elementList = [];
    this.prevScroll = pageYOffset;
    this.prevTime = 0;
    this.nowTime;

    this.init(elementArray);
  }
  
  static getPoint = ($target) => {
		const pageYOffset = window.pageYOffset;
		const getRect = (target) => {
			const clientRect = target.getBoundingClientRect();
			return {top: clientRect.top, bottom: clientRect.bottom, width: clientRect.width, height: clientRect.height};
		}
    const elementRect = getRect($target);
    return {
      top: pageYOffset + elementRect.top,
      bottom: pageYOffset + elementRect.bottom,
      height: elementRect.height
    }
  }

  init(elementArray) {
    this.add(elementArray);
    this.animation();
    this.event();
  }

  add(elementArray) {
    const documentHeight = document.body.scrollHeight - innerHeight;
    const newElement = elementArray.reduce((a, v) => {
      const elementFlat = Array.from(document.querySelectorAll(v.element)).map(element => {
        const elementRect = this.constructor.getPoint(element);
        const center = elementRect.height > innerHeight ?  elementRect.top - innerHeight * 0.5 : elementRect.top - (innerHeight - elementRect.height) * 0.5;
        return { distance: v.distance, element, center: Math.min(center, documentHeight), ...elementRect};
      });
      a.push(...elementFlat);
      return a;
    }, []);
    this.elementList = [...this.elementList, ...newElement];
  }

  move(scrollTop) {
    this.elementList.forEach(el => {
      const distance = (el.center - scrollTop) * el.distance;
      el.element.style.transform = `translateY(${distance}px)`;
    })
  }

  scroll(time) {
    if(Math.abs(this.prevScroll - window.pageYOffset) < 0.5){
      return window.pageYOffset;
    }
    const ease = Math.min((time - this.prevTime) / this.duration, 1);
    const easeScroll = this.prevScroll * (1 - ease) + window.pageYOffset * ease;
    this.prevScroll = easeScroll;
    this.prevTime = time;
    return easeScroll;
  }

  resize() {
    const documentHeight = document.body.scrollHeight - innerHeight;
    this.elementList = this.elementList.map( v => {
      const center = v.height > innerHeight ? v.top - innerHeight * 0.5 : v.top - (innerHeight - v.height) * 0.5;
      return {...v, center: Math.min(center, documentHeight)};
    })
  }

  event () {
		window.addEventListener('resize', () => {
			this.resize();
		})
  }

  animation() {
    const loop = (time) => {

      this.move(this.scroll(time));
      window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
  }
}

