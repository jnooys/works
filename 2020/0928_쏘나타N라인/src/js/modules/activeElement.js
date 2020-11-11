
export default class ActiveElement {

  constructor (element, options) {
    this.init(element, options);
  }

  init (element, options) {
    
    const init = () => {
      this.element = Array.from(document.querySelectorAll(element)).map((v) => v);
      this.getPosition();
    }

    const scroll = (pageYOffset) => {
      if(!this.element) return;
      this.scroll(pageYOffset);
    }

    const resize = () => {
      if(!this.element) return;
      this.resize();
    }
    
    this.throttle = false;
    this.timer = 50;

    this.className = options.className;
    this.distance = options.distance || 0;
    this.reverse = options.reverse || false;
    this.hide = options.hide || false;
    this.positions = [];
    
    window.addEventListener('load', function() {
      init();
      scroll(window.pageYOffset);
    })

    window.addEventListener('scroll', function() {
      scroll(window.pageYOffset);
    });

    window.addEventListener('resize', function() {
      resize();
    })
  }

  getBCR(el) {
    const rect = el.getBoundingClientRect();
    const { pageYOffset } = window;

    return {
      active: rect.top + pageYOffset,
      deactive: rect.bottom + pageYOffset,
    };
  }
  
  getPosition () {
    const distance = typeof this.distance === 'function' ? this.distance() : this.distance;
    const { scrollHeight } =  document.documentElement;
    this.element.forEach((v, i) => {
      const point = {};
      const offset = this.getBCR(v);
      point.active = Math.max(0, offset.active - distance);
      point.deactive = offset.deactive >= scrollHeight ? scrollHeight : offset.deactive - distance;
      if(this.hide) {
        point.hide = Math.max(0, offset.active - window.innerHeight);
      }
      this.positions[i] = point;
    });
  }

  scroll (pageYOffset) {
    if(!this.element || this.throttle) return;
    this.throttle = true;
    this.positions.forEach((v, i) => {
      const element = this.element.find((val, idx) => i === idx);

      if(pageYOffset >= v.active) {
        !element.classList.contains(this.className) && element.classList.add(this.className);
      } 
      if((v.hide && pageYOffset < v.hide) || (this.reverse && (pageYOffset >= v.deactive || pageYOffset < v.active))) {
        element.classList.contains(this.className) && element.classList.remove(this.className);
      }
    });

    setTimeout(() => {
      this.throttle = false;
    }, this.timer);
  }

  resize () {
    this.getPosition();
  }
};
