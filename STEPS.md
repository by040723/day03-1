# 만들 순서 (STEPS)

PRD.md 기준, 4단계로 진행한다.

## 1단계. 맛집 기록 (localStorage)
- `index.html` 하나로 화면 구성: 제목, 입력 폼(이름/메뉴/별점/한줄평), 카드 목록
- [추가] → 카드가 맨 위에 추가, [삭제] → 카드 제거
- localStorage에 저장해 새로고침해도 유지
- 입력 검증: 이름 필수·30자, 메뉴 30자, 별점 1~5 필수, 한줄평 100자
- 주황색 포인트의 카드 디자인, 모바일 폭 대응
- **완료 확인**: 추가·삭제·새로고침 유지·모바일 화면

## 2단계. Supabase 저장
- `restaurants` 표 생성 (id, name, menu, rating, review, created_at)
- CHECK 제약: name 1~30자, menu ≤30자, rating 1~5, review ≤100자
- RLS 켜고 누구나 select/insert/delete 허용 정책 추가
- `index.html`의 저장소를 localStorage → Supabase로 교체
- **완료 확인**: 다른 브라우저/기기에서 같은 목록이 보임, 범위 밖 값은 DB가 거부

## 3단계. AI 한줄평
- Edge Function 1개 작성, `verify_jwt` 끔
- `OPENROUTER_API_KEY`를 Supabase Secrets에 등록 (코드에 넣지 않음)
- 모델 `openrouter/free`로 한국어 한 문장(40자 이내) 생성
- 입력 폼에 AI 추천 버튼 연결, 결과를 한줄평 칸에 채움
- 실패 시 안내 메시지 표시
- **완료 확인**: 버튼 클릭 시 40자 이내 한국어 문장이 채워짐

## 4단계. 배포
- GitHub 저장소에 올리기 (키·비밀값 미포함 확인)
- Vercel에 연결해 배포
- 배포 주소에서 추가·삭제·AI 추천·모바일 화면 최종 점검
- **완료 확인**: 공개 주소에서 모든 기능이 동작
