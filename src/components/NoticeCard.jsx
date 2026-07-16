import { useEffect, useState } from "react";

export default function NoticeCard() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getNotices() {
      try {
        const response = await fetch("/api/notices?limit=9");

        if (!response.ok) {
          throw new Error("공지사항을 불러오지 못했습니다.");
        }

        const result = await response.json();
        setNotices(result.data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getNotices();
  }, []);

  return (
    <section>
      <div className="notice-head">
        <h2>공지사항</h2>

        <a
          href="https://www.hallym.ac.kr/hallym/1134/subview.do"
          target="_blank"
          rel="noreferrer"
        >
          더보기
        </a>
      </div>

      {isLoading ? (
        <p>공지사항을 불러오는 중입니다.</p>
      ) : notices.length === 0 ? (
        <p>등록된 공지사항이 없습니다.</p>
      ) : (
        <ul>
          {notices.map((notice) => (
            <li key={notice.url}>
              <a
                href={notice.url}
                target="_blank"
                rel="noreferrer"
                title={notice.title}
              >
                {notice.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}