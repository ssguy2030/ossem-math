import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { ACADEMY } from './lib/site';

// 기본 공유 이미지(카톡·SNS 미리보기). 빌드 시 1회 생성된다.
export const alt = '김천 율곡동 수학학원 오쌤수학';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const fontDir = join(process.cwd(), 'node_modules/pretendard/dist/public/static');
  const [bold, regular] = await Promise.all([
    readFile(join(fontDir, 'Pretendard-ExtraBold.otf')),
    readFile(join(fontDir, 'Pretendard-Regular.otf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0e1f44 0%, #16306b 100%)',
          color: 'white',
          fontFamily: 'Pretendard',
        }}
      >
        <div style={{ fontSize: 34, color: '#f26b1d' }}>김천 혁신도시 율곡동 · 초등 · 중등 · 고등</div>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, marginTop: 24 }}>
          오쌤수학학원<span style={{ color: '#f26b1d' }}>.</span>
        </div>
        <div style={{ fontSize: 40, marginTop: 24, opacity: 0.95 }}>
          {`${ACADEMY.classSize} 소수정예 · 1:1 맨투맨 · 김천 ${ACADEMY.years}년`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Pretendard', data: bold, weight: 800, style: 'normal' },
        { name: 'Pretendard', data: regular, weight: 400, style: 'normal' },
      ],
    },
  );
}
