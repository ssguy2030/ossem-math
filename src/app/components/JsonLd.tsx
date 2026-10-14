/**
 * JSON-LD 출력. 글 제목처럼 DB에서 온 값이 들어가므로, `</script>`로 태그를 닫고
 * 스크립트를 끼워 넣지 못하도록 `<`·`>`·`&`와 줄 구분 문자(U+2028/2029)를 유니코드 이스케이프한다.
 */
const UNSAFE = new RegExp('[<>&\\u2028\\u2029]', 'g');
const escapeJson = (data: object) =>
  JSON.stringify(data).replace(UNSAFE, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));

export default function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJson(d) }} />
      ))}
    </>
  );
}
