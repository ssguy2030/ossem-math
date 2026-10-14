'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { SmartLink } from '../lib/tiptapLink';
import { supabase } from '../lib/supabase';
import { COLUMN_CATEGORIES } from '../lib/categories';
import { postPath, type Post, type PostType } from '../lib/posts';
import { revalidate } from './useAdmin';

const TYPE_LABEL: Record<PostType, string> = { notice: '공지사항', column: '칼럼', review: '후기' };
const LIST_PATH: Record<PostType, string> = { notice: '/news/notice', column: '/news/column', review: '/review' };

/** 제목 → 한글 slug 제안: 한글·영문·숫자만 남기고 공백은 하이픈 */
export const suggestSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^0-9a-z가-힣\s-]/g, ' ')
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 8)
    .join('-');

const SLUG_RE = /^[0-9a-z가-힣]+(-[0-9a-z가-힣]+)*$/;

async function uploadImage(file: File): Promise<string> {
  if (!supabase) throw new Error('supabase not configured');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('images').upload(path, file, { cacheControl: '31536000' });
  if (error) throw error;
  return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
}

function Btn({ onClick, active, disabled, title, children }: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`rounded border border-gray-200 px-2 py-1 text-sm font-medium ${active ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} ${disabled ? 'opacity-40' : ''}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onImage, uploading }: { editor: Editor | null; onImage: () => void; uploading: boolean }) {
  if (!editor) return null;
  const c = () => editor.chain().focus();
  return (
    <div className="sticky top-16 z-40 flex flex-wrap gap-1 rounded-t-xl border border-b-0 border-gray-300 bg-gray-50 p-2">
      <Btn title="제목 2 (FAQ: ?로 끝나면 자동 FAQ 스키마)" onClick={() => c().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>H2</Btn>
      <Btn title="제목 3" onClick={() => c().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>H3</Btn>
      <span className="mx-1 w-px bg-gray-300" />
      <Btn title="굵게" onClick={() => c().toggleBold().run()} active={editor.isActive('bold')}><b>B</b></Btn>
      <Btn title="기울임" onClick={() => c().toggleItalic().run()} active={editor.isActive('italic')}><i>I</i></Btn>
      <Btn title="밑줄" onClick={() => c().toggleUnderline().run()} active={editor.isActive('underline')}><u>U</u></Btn>
      <Btn title="인용" onClick={() => c().toggleBlockquote().run()} active={editor.isActive('blockquote')}>❝</Btn>
      <span className="mx-1 w-px bg-gray-300" />
      <Btn title="왼쪽 정렬" onClick={() => c().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })}>≡←</Btn>
      <Btn title="가운데 정렬" onClick={() => c().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}>≡</Btn>
      <span className="mx-1 w-px bg-gray-300" />
      <Btn title="글머리 목록" onClick={() => c().toggleBulletList().run()} active={editor.isActive('bulletList')}>• 목록</Btn>
      <Btn title="번호 목록" onClick={() => c().toggleOrderedList().run()} active={editor.isActive('orderedList')}>1. 목록</Btn>
      <span className="mx-1 w-px bg-gray-300" />
      <Btn title="링크" onClick={() => { const url = window.prompt('링크 URL (내부 링크는 /classes/middle 처럼 입력)'); if (url) c().setLink({ href: url }).run(); }} active={editor.isActive('link')}>🔗 링크</Btn>
      <Btn title="이미지" onClick={onImage} disabled={uploading}>🖼 이미지</Btn>
      <Btn title="유튜브" onClick={() => { const url = window.prompt('유튜브 URL'); if (url) editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 }); }}>▶ 유튜브</Btn>
      <Btn title="표" onClick={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>⊞ 표</Btn>
      <span className="mx-1 w-px bg-gray-300" />
      <Btn title="되돌리기" onClick={() => c().undo().run()} disabled={!editor.can().undo()}>↩</Btn>
      <Btn title="다시실행" onClick={() => c().redo().run()} disabled={!editor.can().redo()}>↪</Btn>
    </div>
  );
}

export default function PostEditor({ initial }: { initial?: Post }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [type, setType] = useState<PostType>(initial?.type ?? 'column');
  const [category, setCategory] = useState(
    initial?.type === 'column' && initial.category ? initial.category : COLUMN_CATEGORIES[0].slug,
  );
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [summary, setSummary] = useState(initial?.summary ?? '');
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? '');
  const [publishedAt, setPublishedAt] = useState(initial?.published_at ?? new Date().toISOString().slice(0, 10));
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleTitle = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(suggestSlug(value));
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      TextStyle,
      Color,
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { class: 'editor-image' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      SmartLink.configure({ openOnClick: false }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initial?.content ?? '',
    editorProps: { attributes: { class: 'prose max-w-none min-h-[420px] p-4 focus:outline-none' } },
  });

  const pickImage = useCallback(
    (onUrl: (url: string) => void) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
          onUrl(await uploadImage(file));
        } catch (e) {
          console.error(e);
          alert('이미지 업로드에 실패했습니다.');
        } finally {
          setUploading(false);
        }
      };
      input.click();
    },
    [],
  );

  const insertImage = () =>
    pickImage((url) => {
      const alt = window.prompt('이미지 설명(대체 텍스트)을 입력하세요. 예: 율곡중 2학년 중간고사 시험지 분석') || '';
      editor?.chain().focus().setImage({ src: url, alt }).run();
      if (!thumbnail) setThumbnail(url);
    });

  const handleSave = async () => {
    if (!supabase || !editor) return;
    const content = editor.getHTML();
    const s = slug.trim().toLowerCase();
    if (!title.trim() || editor.isEmpty) return alert('제목과 본문을 입력해 주세요.');
    if (!SLUG_RE.test(s)) return alert('URL은 한글·영문 소문자·숫자와 하이픈(-)만 쓸 수 있습니다.');
    if (type === 'column' && !category) return alert('칼럼 카테고리(학교)를 선택해 주세요.');

    const row = {
      type,
      category: type === 'column' ? category : null,
      slug: s,
      title: title.trim(),
      summary: summary.trim(),
      content,
      thumbnail: thumbnail || null,
      published_at: publishedAt,
      is_published: isPublished,
    };

    setSaving(true);
    const res = isEdit
      ? await supabase.from('posts').update(row).eq('id', initial!.id).select().single()
      : await supabase.from('posts').insert(row).select().single();
    setSaving(false);

    if (res.error) {
      alert(res.error.code === '23505' ? '같은 URL을 쓰는 글이 이미 있습니다. URL을 바꿔 주세요.' : `저장 실패: ${res.error.message}`);
      return;
    }
    const saved = res.data as Post;
    const paths = [postPath(saved), LIST_PATH[saved.type]];
    if (saved.type === 'column' && saved.category) paths.push(`/news/column/${saved.category}`);
    if (initial && postPath(initial) !== postPath(saved)) paths.push(postPath(initial));
    await revalidate(paths);
    router.push(isPublished ? postPath(saved) : '/admin');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!supabase || !initial || !confirm('이 글을 삭제할까요? 되돌릴 수 없습니다.')) return;
    const { error } = await supabase.from('posts').delete().eq('id', initial.id);
    if (error) return alert(`삭제 실패: ${error.message}`);
    await revalidate([
      postPath(initial),
      LIST_PATH[initial.type],
      ...(initial.type === 'column' && initial.category ? [`/news/column/${initial.category}`] : []),
    ]);
    router.push('/admin');
    router.refresh();
  };

  const previewPath = postPath({ type, category: type === 'column' ? category : null, slug: slug || '…' });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{isEdit ? '글 수정' : '새 글 쓰기'}</h1>
          <a href="/admin" className="text-sm text-gray-500 hover:text-brand-primary">← 관리자 목록</a>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-gray-700">글 종류</span>
            <select value={type} onChange={(e) => setType(e.target.value as PostType)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
              {(Object.keys(TYPE_LABEL) as PostType[]).map((t) => (
                <option key={t} value={t}>{TYPE_LABEL[t]}</option>
              ))}
            </select>
          </label>
          {type === 'column' && (
            <label className="block">
              <span className="mb-1 block text-sm font-bold text-gray-700">카테고리(학교)</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                {COLUMN_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-gray-700">
              {type === 'review' ? '정렬 기준일' : '게시일'}
              {type === 'review' && <span className="font-normal text-gray-400"> (화면에 표시 안 됨)</span>}
            </span>
            <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-gray-700">제목 <span className="font-normal text-gray-400">(검색 제목이 됩니다 — 학교명·학년·시험을 앞쪽에)</span></span>
          <input value={title} onChange={(e) => handleTitle(e.target.value)} placeholder="예: 율곡중 2학년 2학기 중간고사 수학 분석" className="w-full rounded-lg border border-gray-300 px-4 py-3" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-gray-700">URL <span className="font-normal text-gray-400">(제목에서 자동 생성 · 짧게 다듬어도 됩니다)</span></span>
          <input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm"
          />
          <span className="mt-1 block text-xs text-gray-500">주소: {previewPath}</span>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-gray-700">한 줄 요약 <span className="font-normal text-gray-400">(검색결과 설명·AI 인용용, 1~2문장)</span></span>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
        </label>

        <div>
          <span className="mb-1 block text-sm font-bold text-gray-700">본문</span>
          <p className="mb-2 text-xs text-gray-500">💡 H2 제목을 &quot;?&quot;로 끝내고 바로 아래 문단에 답을 쓰면 FAQ로 검색엔진에 표시될 수 있어요.</p>
          {uploading && <p className="mb-2 rounded bg-blue-50 px-3 py-2 text-sm text-brand-primary">이미지 업로드 중…</p>}
          <Toolbar editor={editor} onImage={insertImage} uploading={uploading} />
          <div className="rounded-b-xl border border-gray-300">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-bold text-gray-700">대표 이미지</span>
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt="" className="h-16 w-24 rounded object-cover" />
          ) : (
            <span className="text-sm text-gray-400">없음 (본문 첫 이미지가 자동 지정)</span>
          )}
          <button type="button" onClick={() => pickImage(setThumbnail)} className="rounded border border-gray-300 px-3 py-1 text-sm">변경</button>
          {thumbnail && <button type="button" onClick={() => setThumbnail('')} className="text-sm text-gray-500">지우기</button>}
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          <span className="text-sm">공개 (체크 해제 시 임시저장 — 홈페이지에 안 보임)</span>
        </label>

        <div className="flex justify-between border-t pt-6">
          {isEdit ? (
            <button type="button" onClick={handleDelete} className="rounded-lg px-4 py-3 font-bold text-red-600 hover:bg-red-50">삭제</button>
          ) : <span />}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="rounded-lg bg-brand-primary px-8 py-3 font-bold text-white disabled:bg-gray-400"
          >
            {saving ? '저장 중…' : isEdit ? '수정 저장' : '발행하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
