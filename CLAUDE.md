# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 안내서입니다.

## 프로젝트 현황

"우리동네 숨은맛집" — 동네 맛집을 기록하고 함께 볼 수 있는 웹앱입니다. 현재 저장소에는 기획 문서만 있고(코드, 빌드/린트/테스트 도구 없음), [PRD.md](PRD.md)가 명세서, [STEPS.md](STEPS.md)가 만드는 순서입니다. 구현 전에 두 문서를 모두 읽고, STEPS.md의 4단계(맛집 기록 → Supabase 저장 → AI 한줄평 → 배포)를 순서대로 따르세요. 앞서 나가지 마세요.

## PRD의 필수 제약

- 프런트엔드 전체는 `index.html` 하나입니다. npm, 번들러, 프레임워크 빌드 단계는 쓰지 않습니다.
- 저장 방식은 단계별입니다. 1단계는 `localStorage`, 2단계는 이를 Supabase로 교체합니다. 교체할 때 UI 코드를 건드리지 않도록 저장소 접근은 작은 계층 뒤에 두세요.
- `restaurants` 표: `id`, `name`(필수, 30자 이하), `menu`(30자 이하), `rating`(필수, 1~5), `review`(100자 이하), `created_at`(자동). 이 제한은 UI뿐 아니라 DB CHECK 제약조건으로도 막습니다.
- 로그인은 없습니다. RLS를 켜고, 누구나 조회·추가·삭제할 수 있는 정책을 둡니다.
- AI 한줄평: `verify_jwt`를 끈 Supabase Edge Function 1개가 모델 `openrouter/free`로 OpenRouter를 호출합니다. 출력은 한국어 한 문장, 40자 이내여야 합니다. 키는 Supabase Secrets의 `OPENROUTER_API_KEY`에만 두고, 코드나 저장소에는 절대 넣지 않습니다.
- 목록은 새 기록이 맨 위(최신순)입니다. 하지 않을 것: 로그인, 수정, 사진 업로드, 검색.
- 배포: GitHub → Vercel. UI는 따뜻한 주황색 포인트의 깔끔한 카드이며, 휴대폰 폭에서도 잘 보여야 합니다.

## 참고

- `PRD.md` 옆에 `PRD.txt`도 있습니다. 관리되는 최신본은 `PRD.md`입니다.
- 사용자는 한국어로 작성합니다. 사용자에게 보이는 UI 문구는 한국어로 쓰세요.
- 이 Windows 컴퓨터에서는 Claude 세션의 PATH가 오래된 상태라 `git`이 없는 것처럼 보일 수 있습니다. git을 실행하기 전에 `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`로 PATH를 새로 불러오세요.
