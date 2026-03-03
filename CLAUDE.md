# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

EasyCode는 Claude Code CLI를 원클릭으로 설치하는 **Electron 데스크톱 인스톨러**. electron-vite + React + Tailwind CSS 4 기반이며 macOS/Windows를 지원한다.

## 주요 명령어

```bash
npm run dev          # 개발 모드 (electron-vite dev)
npm run build        # typecheck + electron-vite build
npm run lint         # eslint (캐시 사용)
npm run format       # prettier
npm run typecheck    # node + web 타입 체크

# 플랫폼별 빌드
npm run build:mac       # macOS (publish always)
npm run build:win       # Windows (publish always)
npm run build:mac-local # macOS (로컬 빌드만)
npm run build:win-local # Windows (로컬 빌드만)
```

테스트 프레임워크는 없음. `npm run typecheck`과 `npm run lint`로 검증.

## 아키텍처

### 3-layer 구조 (Electron 표준)

```
src/main/        → Main process (Node.js, 시스템 접근)
src/preload/     → Preload (contextBridge로 IPC API 노출)
src/renderer/    → Renderer process (React UI)
```

- **tsconfig.node.json**: main + preload 대상
- **tsconfig.web.json**: renderer 대상, `@renderer/*` → `src/renderer/src/*` path alias

### Main process 서비스 (`src/main/services/`)

| 파일 | 역할 |
|------|------|
| `env-checker.ts` | Claude Code / Git(Windows) 설치 여부 및 버전 감지 |
| `installer.ts` | Claude Code 네이티브 설치 (macOS: curl, Windows: PowerShell) + Git for Windows 설치 |
| `updater.ts` | `electron-updater` 기반 자동 업데이트 (체크→다운로드→설치) |

### 설치 방식

- **macOS**: `curl -fsSL https://claude.ai/install.sh | bash` (Node.js 불필요)
- **Windows**: Git for Windows 필요 → `irm https://claude.ai/install.ps1 | iex` (WSL 불필요)

### IPC 통신 패턴

1. `ipc-handlers.ts`에서 `ipcMain.handle()` 등록
2. `preload/index.ts`에서 `contextBridge.exposeInMainWorld('electronAPI', ...)` 로 renderer에 노출
3. renderer에서 `window.electronAPI.xxx()` 호출
4. 설치 진행 상황은 `install:progress` / `install:error` 이벤트로 main→renderer 단방향 전송

IPC 채널 추가 시: `ipc-handlers.ts` 핸들러 → `preload/index.ts` electronAPI 객체 → `preload/index.d.ts` 타입 선언 3곳을 함께 수정해야 한다.

### IPC 채널

| 채널 | 용도 |
|------|------|
| `app:version` | 앱 버전 |
| `env:check` | 환경 체크 결과 |
| `install:claude-code` | Claude Code 네이티브 설치 실행 |
| `install:git` | Git for Windows 설치 (Windows만) |
| `install:progress` | 설치 진행 로그 (main→renderer) |
| `install:error` | 설치 에러 (main→renderer) |
| `update:check/download/install` | 앱 자동 업데이트 |
| `i18n:get-locale/set-language` | 언어 설정 |

### Renderer 위자드 플로우

`useWizard` 훅이 4스텝 네비게이션을 관리. 순서:

```
welcome → envCheck → (install) → done
```

- `envCheck`에서 이미 설치됨이면 `done`으로 직행
- `install` 스텝은 환경 체크 결과에 따라 조건부 진입
- `goTo()`로 스텝 건너뛰기 가능, `history` ref로 뒤로가기 지원
- 각 Step 컴포넌트는 `src/renderer/src/steps/`에 위치

### 앱 라이프사이클

- 트레이 없음 — 창 닫기 = 앱 종료
- 자동 업데이트: 앱 시작 5초 후 업데이트 체크

### 릴리즈 배포

**릴리즈 절차** (`npm run release` = `scripts/release.mjs`):

1. `npm run release` (또는 `npm run release -- minor/major`)
2. 스크립트가 버전 bump → 커밋 & 푸시 → GitHub 릴리즈 생성
3. GitHub Actions가 자동으로: macOS/Windows 빌드 → 동일 릴리즈에 바이너리 업로드

**워크플로우 구조**:

- `build-mac` (macos-latest): `build:mac-local` → `gh release upload`
- `build-win` (windows-latest): `build:win-local` → `gh release upload`

**빌드 파일명**: `electron-builder.yml`에서 버전 없이 고정 (`easy-code.dmg`, `easy-code-setup.exe`)

## 코드 스타일

- Prettier: 싱글쿼트, 세미콜론 없음, 100자 폭, trailing comma 없음
- ESLint: `@electron-toolkit/eslint-config-ts` + `eslint-config-prettier` + React hooks/refresh 규칙
- 들여쓰기: 스페이스 2칸, LF 줄바꿈

## UI 테마

다크 모드 기반 (Claude 브랜드 warm orange-brown). 커스텀 색상은 `src/renderer/src/assets/main.css`의 `@theme` 블록에 정의:

- primary: `#da7756` (오렌지-브라운), bg: `#1a1714` (따뜻한 다크)
- Tailwind에서 `text-primary`, `bg-bg-card`, `text-text-muted` 등으로 사용
- 배경: Aurora 그라디언트 + SVG 노이즈 그레인 + 버블 애니메이션
- 폰트: Inter

## 다국어 지원 (i18n)

- 4개 언어: ko, en, ja, zh
- 네임스페이스: `common` (공통 UI), `steps` (위자드 스텝), `main` (Main process 메시지)
- Renderer: `src/shared/i18n/index.ts` (react-i18next)
- Main: `src/shared/i18n/main.ts` (i18next only)

## 상표 관련 주의사항

- 앱 이름은 "EasyCode" (Claude를 브랜드명에 포함하지 않음)
- 부제에서 "for Claude Code"로 서술적 사용 (nominative fair use)
- 앱 아이콘은 오리지널 디자인 (코드 브래킷 + 스파클), Claude 공식 로고 사용 금지
- Anthropic marketing@anthropic.com에 상표 사용 허가 요청 완료 (답변 대기 중)
