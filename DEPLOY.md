# 드론 코인 대모험 — 인터넷에 올리는 방법

이 게임은 서버 프로그램이 필요 없는 **정적 웹사이트**(HTML + JS 파일)라서, 무료 호스팅에 파일만 올리면 어느 컴퓨터·태블릿·폰에서든 주소로 접속할 수 있어요.

## 올릴 파일 (이 4개만 있으면 됨)
```
index.html
game.js
backgrounds.js
drones.js
```
- `GAME_DESIGN.md`, `DEPLOY.md`, `.claude` 폴더는 올리지 않아도 됩니다 (올려도 문제는 없음).
- 4개 파일은 **같은 폴더**에 있어야 합니다.

---

## 방법 1. Netlify Drop — 가장 쉬움 (끌어다 놓기)
1. 업로드용 새 폴더를 만들고 위 4개 파일만 복사합니다. (예: `drone-game`)
2. 브라우저에서 **https://app.netlify.com/drop** 에 접속합니다.
3. 무료 계정으로 가입/로그인합니다. (GitHub, Google 계정으로도 가능)
   - 로그인 없이 올리면 임시 사이트가 되어 일정 시간 뒤 사라질 수 있으니, 계속 쓰려면 로그인하세요.
4. 만든 폴더를 화면의 상자에 **통째로 끌어다 놓습니다.**
5. 몇 초 뒤 `https://무작위이름.netlify.app` 주소가 생깁니다. 이 주소로 어디서든 접속!
6. (선택) Site configuration → Change site name 에서 `drone-coin-adventure` 처럼 주소 이름을 바꿀 수 있습니다.

**게임을 수정한 뒤 다시 올리기:** Netlify 사이트 화면의 Deploys 탭에서 폴더를 다시 끌어다 놓으면 같은 주소가 새 버전으로 바뀝니다.

---

## 방법 2. GitHub Pages — 무료, 오래 유지하기 좋음
1. **https://github.com** 에 가입/로그인합니다.
2. 오른쪽 위 **+** → **New repository** → 이름 예: `drone-game` → **Public** 선택 → Create repository.
3. 저장소 화면에서 **uploading an existing file** 링크(또는 Add file → Upload files)를 누르고 4개 파일을 끌어다 놓은 뒤 **Commit changes**.
4. 저장소의 **Settings → Pages** 로 이동합니다.
5. Build and deployment → Source: **Deploy from a branch**, Branch: **main** / **/(root)** 선택 → **Save**.
6. 1~2분 뒤 같은 화면 위쪽에 주소가 표시됩니다: `https://내아이디.github.io/drone-game/`

**수정 후 다시 올리기:** 저장소에서 Add file → Upload files로 바뀐 파일을 다시 올리면(같은 이름은 덮어씀) 1~2분 뒤 반영됩니다.

> 참고: GitHub 무료 계정의 Pages는 저장소가 **Public**(공개)이어야 합니다. 게임 코드가 공개되어도 문제없는 경우에 사용하세요.

---

## 그 밖의 무료 호스팅
- **Cloudflare Pages** (pages.cloudflare.com) — "Upload assets"로 폴더 업로드 가능
- **Vercel** (vercel.com) — GitHub 저장소와 연결해 배포

---

## 알아두면 좋은 점
- **진행도 저장은 기기별**: 열린 단계와 모은 드론은 각 컴퓨터의 브라우저에 따로 저장됩니다. 다른 컴퓨터에서 접속하면 1단계부터 시작해요.
- **개인정보 없음**: 이 게임은 이름·이메일 등 어떤 정보도 서버로 보내지 않습니다.
- **글꼴**: 'Jua' 글꼴은 Google Fonts에서 불러옵니다. 인터넷이 안 되는 곳에서는 기본 글꼴로 보입니다.
- **스마트폰**: 가로 화면으로 돌려서 플레이하세요. 홈 화면에 추가하면 앱처럼 열 수 있어요 (브라우저 메뉴 → 홈 화면에 추가).
- **학교/기관 공유**: 주소(URL)만 알려주면 되고, 아이들은 설치 없이 바로 접속할 수 있습니다.
