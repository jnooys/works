import ActiveElement from './activeElement';

export default class ActiveNav extends ActiveElement {
  constructor(...arg) {
    super(...arg);
  }

  getPosition() {
    const distance =
      typeof this.distance === 'function' ? this.distance() : this.distance;
    const { scrollHeight } = document.documentElement;
    this.element.forEach((v, i) => {
      const point = {};
      const link = document.querySelector(v?.getAttribute('href') ? v.getAttribute('href') : v.children[0].getAttribute('href'));
      const offset = this.getBCR(link);
      point.active = Math.max(0, offset.active - distance);
      point.deactive = offset.deactive >= scrollHeight ? scrollHeight : offset.deactive - distance;
      this.positions[i] = point;
    });
  }
}
