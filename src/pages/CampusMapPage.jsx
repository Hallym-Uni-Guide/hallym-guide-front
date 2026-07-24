import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AiChat from "../components/AiChat";
import { loadKakaoMaps } from "../utils/kakaoMapLoader";
import "../styles/CampusMapPage.css";

const CENTER = { lat: 37.887276057685504, lng: 127.73810348572077 };

const BUILDINGS = [
  { id: 1, name: "공학관", lat: 37.8862833, lng: 127.7357539 },
  { id: 3, name: "대학본부·인문1관", lat: 37.8865564, lng: 127.7379519 },
  { id: 4, name: "일송기념도서관", lat: 37.8847446, lng: 127.7373753 },
  { id: 5, name: "한림레크리에이션센터", lat: 37.884472, lng: 127.738752 },
  { id: 6, name: "사회·경영1관", lat: 37.888249, lng: 127.7382402 },
  { id: 7, name: "산학협력관", lat: 37.8873447, lng: 127.7380824 },
  { id: 8, name: "의료·바이오융합연구원", lat: 37.8860317, lng: 127.7376958 },
  { id: 9, name: "Campus Life Center", lat: 37.8866482, lng: 127.7401316 },
  { id: 10, name: "도헌글로벌스쿨", lat: 37.8845504, lng: 127.7365123 },
  { id: 11, name: "학생생활관1관", lat: 37.8856017, lng: 127.7407599 },
  { id: 12, name: "사색의 길", lat: 37.8866389, lng: 127.7387415 },
  { id: 13, name: "생명의 숲", lat: 37.8856483, lng: 127.7369931 },
  { id: 14, name: "일송정원", lat: 37.88629, lng: 127.73576 },
  { id: 15, name: "의학관", lat: 37.8859923, lng: 127.7372844 },
  { id: 16, name: "인문 2관", lat: 37.886404, lng: 127.7373424 },
  { id: 17, name: "대학본부별관", lat: 37.8866389, lng: 127.7387415 },
  { id: 18, name: "실험동물센터", lat: 37.8863177, lng: 127.7368978 },
  { id: 19, name: "자연과학관", lat: 37.8856483, lng: 127.736993 },
  { id: 20, name: "생명과학관", lat: 37.8852212, lng: 127.7358836 },
  { id: 21, name: "일송아트홀", lat: 37.8868706, lng: 127.7369695 },
  { id: 22, name: "창업보육센터", lat: 37.8848524, lng: 127.7356978 },
  { id: 23, name: "사회·경영2관", lat: 37.8878495, lng: 127.7383674 },
  { id: 24, name: "국제관", lat: 37.8867035, lng: 127.7409426 },
  { id: 25, name: "국제회의관", lat: 37.8840526, lng: 127.738365 },
  { id: 26, name: "기초교육관", lat: 37.8885021, lng: 127.738082 },
  { id: 27, name: "학군단", lat: 37.8883152, lng: 127.7390657 },
  { id: 28, name: "실내테니스장", lat: 37.8875156, lng: 127.7410965 },
  { id: 30, name: "학생생활관 2관", lat: 37.885947, lng: 127.7406717 },
  { id: 31, name: "학생생활관 3관", lat: 37.8859383, lng: 127.7411126 },
  { id: 32, name: "학생생활관 4관", lat: 37.8862749, lng: 127.7408323 },
  { id: 33, name: "학생생활관 5관", lat: 37.8863693, lng: 127.741353 },
  { id: 34, name: "학생생활관 6관", lat: 37.8861447, lng: 127.741808 },
  { id: 35, name: "학생생활관 7관", lat: 37.8866681, lng: 127.7415582 },
  { id: 36, name: "학생생활관 8관", lat: 37.887138, lng: 127.7413094 },
  { id: 37, name: "체육 기자재실", lat: 37.8872547, lng: 127.7388404 },
  { id: 38, name: "H Stadium (골프장, 테니스장, 농구장, 풋살장)", lat: 37.8878522, lng: 127.7367704 },
  { id: 39, name: "ILSONG Stadium", lat: 37.8876564, lng: 127.739872 },
  { id: 40, name: "씨름장", lat: 37.8876471, lng: 127.7407857 },
  { id: 41, name: "온실", lat: 37.886631, lng: 127.735636 },
  { id: 42, name: "한림대학교 춘천성심병원", lat: 37.8839706, lng: 127.7398959 },
  { id: 44, name: "주차장", lat: 37.88756271674385, lng: 127.73692694395514 },
  { id: 45, name: "농구장", lat: 37.88796110450456, lng: 127.73768971566736 },
  { id: 46, name: "풋살장", lat: 37.888064045487845, lng: 127.73707688041723 },
  { id: 47, name: "테니스장", lat: 37.88816607962512, lng: 127.73732799001434 },
];

const CampusMapPage = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const infoWindowRef = useRef(null);
  const currentLocationOverlayRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [keyword, setKeyword] = useState("");

  const filteredBuildings = useMemo(() => {
    if (!keyword.trim()) return BUILDINGS;
    const lower = keyword.trim().toLowerCase();
    return BUILDINGS.filter((building) => building.name.toLowerCase().includes(lower));
  }, [keyword]);

  const focusBuilding = useCallback((building) => {
    const map = mapRef.current;
    const marker = markersRef.current[building.id];
    if (!map || !marker) return;

    const position = new window.kakao.maps.LatLng(building.lat, building.lng);
    map.panTo(position);
    infoWindowRef.current.setContent(
      `<div style="padding:6px 10px;font-size:13px;">${building.name}</div>`
    );
    infoWindowRef.current.open(map, marker);
    setSelectedId(building.id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled) return;

        const map = new kakao.maps.Map(mapContainerRef.current, {
          center: new kakao.maps.LatLng(CENTER.lat, CENTER.lng),
          level: 4,
        });
        map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
        mapRef.current = map;
        infoWindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });

        BUILDINGS.forEach((building) => {
          const position = new kakao.maps.LatLng(building.lat, building.lng);
          const marker = new kakao.maps.Marker({ position, map, title: building.name });
          kakao.maps.event.addListener(marker, "click", () => focusBuilding(building));
          markersRef.current[building.id] = marker;
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const currentPosition = new kakao.maps.LatLng(
                pos.coords.latitude,
                pos.coords.longitude
              );
              map.setCenter(currentPosition);
              map.setLevel(3);

              const content = document.createElement("div");
              content.className = "current_location_marker";
              content.innerHTML =
                '<span class="current_location_pulse"></span><span class="current_location_dot"></span>';

              currentLocationOverlayRef.current = new kakao.maps.CustomOverlay({
                position: currentPosition,
                content,
                xAnchor: 0.5,
                yAnchor: 0.5,
                zIndex: 2,
              });
              currentLocationOverlayRef.current.setMap(map);
            },
            () => {},
            { enableHighAccuracy: true, timeout: 8000 }
          );
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [focusBuilding]);

  return (
    <div className="campus_page">
      <Header />
      <div className="campus_body">
        <aside className="campus_sidebar">
          <h3 className="campus_sidebar_title">학교 건물</h3>
          <div className="building_search">
            <input
              type="text"
              placeholder="건물명을 입력하세요."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>
          <ul className="building_list">
            {filteredBuildings.map((building) => (
              <li key={building.id}>
                <button
                  className={`building_item ${selectedId === building.id ? "building_item_active" : ""}`}
                  type="button"
                  onClick={() => focusBuilding(building)}
                >
                  <span className="icon icon_pin" aria-hidden="true" />
                  {building.name}
                </button>
              </li>
            ))}
            {filteredBuildings.length === 0 && (
              <li className="building_empty">검색 결과가 없습니다.</li>
            )}
          </ul>
        </aside>
        <div className="campus_map_container">
          {loadError ? (
            <div className="campus_map_error">
              지도를 불러오지 못했습니다. VITE_KAKAO_MAP_KEY 설정을 확인해주세요.
            </div>
          ) : (
            <div className="kakao_map_canvas" ref={mapContainerRef} />
          )}
        </div>
      </div>
      <AiChat />
      <Footer />
    </div>
  );
};

export default CampusMapPage;
