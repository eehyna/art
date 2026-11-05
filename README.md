# art

## 새 전시 추가하기
1. 사진을 줄여서(긴 변 약 2000px, WebP/JPG) `assets/2026-12-전시이름/` 같은 폴더에 넣기
2. `data/exhibitions.json`의 `exhibitions` 배열에 항목 추가 (샘플 항목 복사해서 수정)
3. `git add . && git commit -m "add exhibition" && git push`

## 로컬에서 확인
`python3 -m http.server 8000` 실행 후 http://localhost:8000 (파일을 그냥 더블클릭하면 JSON이 안 불러와집니다)
