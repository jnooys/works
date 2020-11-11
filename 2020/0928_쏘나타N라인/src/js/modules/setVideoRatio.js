
export default function setVideoRatio() {
  const ratio = 16 / 9;
  const video = document.querySelector('video');
  const size = getSize(document.documentElement.clientWidth, window.innerHeight);

  video.width = size.width;
  video.height = size.height;
  video.style.marginLeft = `${parseInt(size.width * -0.5)}px`;

  function getSize(w, h) {
    let width = w;
    let height = h;

    if(w > h) {
      height = Math.round(w / ratio);
    } else {
      width = Math.round(h * ratio);
    }
    return {width, height};
  }
}