export default class ScrollActive {

	constructor (target, options) {
		this.targetList = [];
		this.options = {
			distance : 0,
			invisible: false,
			reverse: false,
			activeClass: 'on',
			activePoint: {},
		}
		Object.assign(this.options, options);

		this.event(target);
	}

	static getBCR ($target) {
		const clientRect = $target.getBoundingClientRect();
		return {top: clientRect.top, bottom: clientRect.bottom};
	}

 	getPoint ($target, i) {
		const documentHeight = document.documentElement.scrollHeight;
		const pageYOffset = window.pageYOffset;
		const lastScroll = Math.max(documentHeight - window.innerHeight, 0);
		const elementRect = this.constructor.getBCR($target);
		const point = {};
		point.from = Math.min(Math.floor(pageYOffset + elementRect.top - this.options.distance), lastScroll);
		point.to = (!this.options.reverse || point.from == lastScroll || i == this.targetLength - 1) ? documentHeight : Math.min(Math.floor(pageYOffset + elementRect.bottom - this.options.distance), lastScroll);
		return Object.assign({}, point, this.options.activePoint);
  }

	init(target) {
		this.targetElement = document.querySelectorAll(target);
		this.targetLength = this.targetElement.length;
		this.targetList = Array.from(this.targetElement).map(($el, i) => {
			return { $el, ...this.getPoint($el, i)};
		});
	}

	scroll (scrollTop) {
		this.targetList.forEach(el => {
			if(scrollTop >= el.to) {
				el.$el.classList.remove(this.options.activeClass);
				return;
			} 
			if(scrollTop >= el.from) {
				el.$el.classList.add(this.options.activeClass);
				return;
			} 
			if(this.options.invisible) {
				if(scrollTop <= Math.max(el.from - innerHeight, 0)) {
					el.$el.classList.remove(this.options.activeClass);
				}
				return;
			}
			el.$el.classList.remove(this.options.activeClass);
		})
	}

	resize () {
		this.targetList = this.targetList.map((el, i) => {
			return { ...el, ...this.getPoint(el.$el, i)};
		});
	}

	event (target) {
		let isThrolling = false;

		window.addEventListener('load', () => {
			this.init(target);
		})

		window.addEventListener('scroll', () => {
			const scrollTop = window.pageYOffset;
			this.scroll(scrollTop);
		})

		window.addEventListener('resize', () => {
			if(isThrolling) {return;}
			isThrolling = true;
			setTimeout(() => {
				this.resize();
				isThrolling = false;
			}, 150);
			
		})
	}
}

class NavActive extends ScrollActive {

	constructor(target, options) {
		super(target, options);
	}

	init (target) {
		super.init(target);
		this.options.reverse = true;
		this.getTargetPoint();
	}

	resize () {
		super.resize();
		this.getTargetPoint();
	}
	getTargetPoint () {
		this.targetList = this.targetList.reduce((acc, el, i) => {
			const $target = document.querySelector(this.targetElement[i].firstChild.getAttribute('href'));
			const point = {...el, ...this.getPoint($target, i)};
			
			acc.push(point);
			return acc;
		}, []);
	}
}

export { NavActive };