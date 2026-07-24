import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadKakaoMaps } from "../utils/kakaoMapLoader";
import "../styles/MiniCampusMap.css";

const CENTER = { lat: 37.887276057685504, lng: 127.73810348572077 };

const MiniCampusMap = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled) return;

        new kakao.maps.Map(mapContainerRef.current, {
          center: new kakao.maps.LatLng(CENTER.lat, CENTER.lng),
          level: 4,
          draggable: false,
          scrollwheel: false,
        });
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mini_campus_map">
      {loadError ? (
        <div className="mini_campus_map_error">지도를 불러오지 못했습니다.</div>
      ) : (
        <div className="mini_campus_map_canvas" ref={mapContainerRef} />
      )}
      <button
        type="button"
        className="mini_campus_map_zoom_btn"
        aria-label="캠퍼스맵 크게 보기"
        onClick={(event) => {
          event.stopPropagation();
          navigate("/campus-map");
        }}
      >
        <span className="icon icon_search" aria-hidden="true" />
      </button>
    </div>
  );
};

export default MiniCampusMap;
