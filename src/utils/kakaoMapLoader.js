const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

let loadPromise = null;

export const loadKakaoMaps = () => {
  if (!KAKAO_MAP_KEY) {
    return Promise.reject(new Error("VITE_KAKAO_MAP_KEY is not set"));
  }

  if (window.kakao && window.kakao.maps) {
    return Promise.resolve(window.kakao);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao));
    };
    script.onerror = (error) => {
      loadPromise = null;
      reject(error);
    };
    document.head.appendChild(script);
  });

  return loadPromise;
};
