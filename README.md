# art — 포트폴리오 사이트 관리 가이드

한국어/영어 병기 포트폴리오 사이트예요. 코드는 건드리지 않고, 대부분 **`data/exhibitions.json`** 하나만 고치면 됩니다.

## 폴더 구조

```
index.html           메인 (전시 아카이브)
info.html            소개 / 연락처 / 이력
style.css            디자인
app.js               동작 (JSON을 읽어서 화면을 그림)
data/exhibitions.json  전시 내용 ← 가장 자주 고치는 파일
assets/              사진
CNAME                도메인 연결용 (지우거나 바꾸지 마세요)
```

---

## 1. 새 전시 추가하기

### ① 사진 준비
- 긴 변을 약 2000px로 줄이기 (squoosh.app, 맥은 미리보기 → 도구 → 크기 조절)
- 파일 이름은 영문, 숫자, 하이픈만: `2026-12-install-01.jpg` (한글, 띄어쓰기 X)

### ② 사진 올리기 (GitHub 웹)
1. 레포에서 `assets` 폴더 클릭
2. **Add file → Upload files** → 사진을 끌어다 놓기 (전시별 폴더째 올려도 됨 → 경로 `assets/폴더이름/사진.jpg`)
3. **Commit changes**

### ③ 내용 적기
`data/exhibitions.json` 열기 → 연필 아이콘(Edit) → `"exhibitions": [` 바로 다음 줄에 아래 전시 한 덩어리를 붙여넣고, 맨 끝 쉼표(`,`)를 확인 → **Commit changes**

```json
{
  "id": "2026-12-solo",
  "date": "2026-12-27",
  "venue": { "ko": "장소 이름", "en": "Venue name" },
  "city": { "ko": "서울, 한국", "en": "Seoul, Korea" },
  "kind": { "ko": "개인전", "en": "solo exhibition" },
  "title": { "ko": "전시 제목", "en": "Exhibition title" },
  "credits": [
    { "ko": "사진: 이름", "en": "photo: Name" }
  ],
  "images": [
    ...여기에 사진, 글, 줄 나누기를 넣기 (아래 2번)...
  ]
},
```

- 전시는 `date` 기준으로 최신순 자동 정렬돼요. 위치는 상관없어요.
- `credits`는 없어도 돼요 (그 줄을 통째로 지우기).
- 맨 위 한 줄 표시는 `날짜  장소, 도시, 형식, 《제목》` 순서로 만들어져요.

---

## 2. `images` 안에 넣을 수 있는 3가지

들어간 순서대로 화면에 나와요. 항목 사이에는 쉼표(`,`), 맨 마지막 항목 뒤에는 쉼표 없음.

### 사진
```json
{
  "src": "assets/2026-12-install-01.jpg",
  "caption": {
    "ko": "전경; 2026; 장소, 서울; 사진: 이름",
    "en": "installation view; 2026; Venue, Seoul; photo: Name"
  }
}
```
- 썸네일 밑에 캡션이 보이고(3줄까지), 누르면 큰 사진과 전체 캡션이 떠요.
- 사진이 많아 로딩이 느리면 작은 썸네일 파일을 따로 만들어 `"thumb": "assets/.../작은파일.jpg"`를 추가할 수 있어요.

### 글 박스
```json
{
  "type": "text",
  "title": { "ko": "작가 노트", "en": "Artist's note" },
  "body": {
    "ko": "첫 문단.\n\n둘째 문단.",
    "en": "First paragraph.\n\nSecond paragraph."
  },
  "caption": { "ko": "작가 노트", "en": "artist's note" }
}
```
- 썸네일에는 글 앞부분이 사진과 같은 크기로 보이고, 누르면 전체 글을 스크롤해서 읽어요.
- **본문은 반드시 한 줄로** 쓰고, 문단 나눔은 `\n\n` (역슬래시 한 개)
- 글 안에 큰따옴표(`"`)를 쓰려면 `\"`
- `title`, `caption`은 없어도 돼요.

### 줄 나누기 (분류)
```json
{ "type": "break", "label": { "ko": "작업", "en": "Works" } }
```
- 이 자리부터 새 줄이 시작돼요. 모바일에서는 줄마다 따로 옆으로 스크롤돼요.
- `label`은 없어도 돼요(이름 없이 줄만 나뉨). 맨 앞에 넣으면 첫 줄에도 이름을 붙일 수 있어요.
- 예: 전경사진 줄 → 작업사진 줄

```json
"images": [
  { "type": "break", "label": { "ko": "전경", "en": "Installation views" } },
  { "src": "assets/a.jpg", "caption": { "ko": "...", "en": "..." } },
  { "src": "assets/b.jpg", "caption": { "ko": "...", "en": "..." } },
  { "type": "break", "label": { "ko": "작업", "en": "Works" } },
  { "src": "assets/c.jpg", "caption": { "ko": "...", "en": "..." } },
  { "type": "text", "title": { "ko": "...", "en": "..." }, "body": { "ko": "...", "en": "..." } }
]
```

---

## 3. 기존 내용 고치기 / 지우기

- **고치기**: `exhibitions.json` 열기 → 연필 아이콘 → 해당 부분 수정 → Commit changes
- **사진 한 장 빼기**: `images`에서 그 사진의 `{ ... }` 덩어리와 옆 쉼표를 지우기 (사진 파일은 `assets`에 남아 있어도 상관없음)
- **전시 통째로 지우기**: 그 전시의 `{ ... },` 덩어리 전체 삭제
- **파일 삭제**: 파일을 열고 ⋯ 메뉴 → **Delete file** → Commit changes
- **`info.html`(소개 페이지)**: 같은 방식으로 열어서 고치기. 한글은 `class="ko"`, 영문은 `class="en"`인 줄을 각각 수정.

---

## 4. JSON이 안 먹을 때 (사이트에 전시가 안 나올 때)

대부분 문법 실수예요. 고친 내용을 [jsonlint.com](https://jsonlint.com)에 붙여넣으면 틀린 줄을 알려줘요.

- 항목 사이 **쉼표** 빠짐 / 마지막 항목 뒤에 쉼표가 남아 있음
- **따옴표**(`"`) 빠짐 또는 짝이 안 맞음
- 본문 글이 **여러 줄**로 쓰여 있음 → 한 줄로, 줄바꿈은 `\n\n`
- `caption`이 `title` 안에 들어가 있음 → `title`, `body`와 같은 층에 있어야 함
- 사진이 안 뜨면 파일 경로와 이름(대소문자, 확장자 `.jpg` / `.JPG`)이 정확한지 확인

커밋 후 반영까지 1~2분 걸려요. 안 바뀌면 새로고침을 강하게(Ctrl/Cmd + Shift + R) 하거나 주소 끝에 `?v=2`를 붙여서 열어 보세요.

---

## 5. 크기·간격 조절 (`style.css`)

| 바꾸고 싶은 것 | 위치 |
|---|---|
| 데스크톱 사진 높이 | `.thumb img { height:150px; }` |
| 글 박스 크기 | `.text-thumb { width:150px; }`, `.text-thumb .tb { height:150px; }` (사진 높이와 같이 맞추기) |
| 캡션 글자 크기, 줄 수 | `.thumb .tc`의 `font-size:11px`, `-webkit-line-clamp:3` |
| 모바일에서 한 화면에 보이는 사진 수 | 맨 아래 `@media` 안 `.grid { --per:4.3; ... }` (작을수록 사진이 커짐) |
| 분류 이름 글자/간격 | `.row-label { ... }` |

---

## 6. 로컬에서 미리 보기 (선택)

파일을 더블클릭하면 JSON이 안 불러와져요. 폴더에서 아래를 실행한 뒤 http://localhost:8000 으로 열기:

```
python3 -m http.server 8000
```

---

## 7. 도메인 / 보안연결(HTTPS)

GitHub Pages는 HTTPS 인증서를 **무료**로 자동 발급해요. 가비아에서 따로 결제할 건 없어요.

1. 레포 **Settings → Pages**의 Custom domain에 도메인이 들어 있는지 확인
2. 가비아 DNS 설정이 아래와 정확히 일치하는지 확인 (여분의 A/AAAA/CNAME 레코드가 있으면 인증서 발급이 막힐 수 있어요)
   - `@`(루트) A 레코드 4개: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` CNAME: `eehyna.github.io`
3. Settings → Pages에서 **Enforce HTTPS** 체크 (DNS 확인과 인증서 발급에 최대 24시간 걸릴 수 있어요)
4. 접속할 때 주소가 `http://`가 아니라 `https://`인지 확인
