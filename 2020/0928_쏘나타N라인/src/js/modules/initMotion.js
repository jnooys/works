export default function initMotion(dir, files) {
  loadImage();

  const domain = `https://nxm-mt.akamaized.net/Contents/kartrush.nexon.com/event_200928/images_328F3B4383060A5B/${dir}/`;
  const basename = [...files];

  const imagePromise = basename.map((v) => new Promise((reslove, reject) => {
      const image = new Image();
      image.onload = () => {
        reslove();
      };
      image.onerror = () => {
        reject();
      };
      image.src = `${domain}${v}`;
    }),
  );

  function motion() {
    const main = document.querySelector('main');
    const screen = document.querySelector('#screen');
    screen.classList.add('hide');

    setTimeout(() => {
      main.classList.add('load');
    }, 300);

    setTimeout(() => {
      screen.remove();
    }, 500);
  }

  function loadImage() {
    Promise.all(imagePromise)
    .then(() => {
      motion();
    })
    .catch(() => {
      setTimeout(() => {
        motion();
      }, 500);
    });
  }
};