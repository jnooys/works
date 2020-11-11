export default function isIE() {
  const agent = navigator.userAgent.toLowerCase();

  if (
    (navigator.appName == 'Netscape' &&
      navigator.userAgent.search('Trident') != -1) ||
    agent.indexOf('msie') != -1
  ) {
    const wrap = document.querySelector('#wrap');
    let alertElement = document.createElement('div');

    alertElement.setAttribute(
      'style',
      'left:0;right:0;top:0;height:24px;line-height:24px;position: fixed;z-index: 1001;background-color:#f5d562;text-align: center;color:#000',
    );
    alertElement.innerHTML = `현재 사용 중인 브라우저는 YouTube영상 재생이 원활하지 않습니다. [권장 브라우저 Chrome, Safari ]<button type="button" style="position: absolute;top:0;right:0;z-index:1002;width: 24px;height: 24px;background:none;">X</button>`;
    wrap.append(alertElement);

    alertElement.addEventListener('click', function () {
      this.remove();
      alertElement = null;
    });
  }
}
