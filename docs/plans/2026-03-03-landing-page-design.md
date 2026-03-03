# EasyCode 랜딩페이지 — easyclaw.kr 통합 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** easyclaw.kr에 EasyCode 다운로드 페이지를 제품 탭 방식으로 통합하여 "Easy" 브랜드 포탈로 확장

**Architecture:** 기존 순수 HTML/CSS/JS 단일 페이지에 SPA 라우팅을 추가. 제품별 콘텐츠 데이터를 JS 객체로 관리하고, 네비게이션 탭 + URL 기반으로 콘텐츠를 전환. 공통 섹션(Community, Contact, Footer)은 유지하고 제품별 섹션(Hero, Features, Steps, CTA)만 교체.

**Tech Stack:** HTML5, CSS3 (커스텀 프로퍼티), Vanilla JS (History API, IntersectionObserver)

**작업 대상 레포:** `ybgwon96/easyclaw` (easyclaw.kr 호스팅 레포)

---

### Task 1: 네비게이션에 제품 탭 추가

**Files:**
- Modify: `index.html` — `<nav class="floating-nav">` 영역

**Step 1: 네비게이션 HTML 수정**

기존 nav-logo를 "Easy" 브랜드 + 제품 탭으로 변경:

```html
<nav class="floating-nav" id="floating-nav">
  <div class="nav-left">
    <a href="/" class="nav-logo">
      <span class="easy">Easy</span>
    </a>
    <div class="nav-tabs">
      <a href="/" class="nav-tab active" data-product="claw">
        <span class="tab-name">Claw</span>
      </a>
      <a href="/easycode" class="nav-tab" data-product="code">
        <span class="tab-name">Code</span>
      </a>
    </div>
  </div>
  <div class="nav-right">
    <select id="lang-selector" class="lang-selector" aria-label="Language">
      <option value="ko">한국어</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="zh">中文</option>
    </select>
    <a id="nav-download-btn" href="#" class="nav-download">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span data-i18n="nav.download">다운로드</span>
    </a>
  </div>
</nav>
```

**Step 2: 탭 CSS 추가**

```css
.nav-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.nav-tabs {
  display: flex;
  background: var(--bg-card);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}
.nav-tab {
  padding: 0.35rem 0.9rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
  transition: all 0.25s ease;
  cursor: pointer;
}
.nav-tab:hover {
  color: var(--text);
}
.nav-tab.active {
  background: linear-gradient(135deg, var(--primary), #ea580c);
  color: #fff;
}
/* EasyCode 활성 시 accent 변경 */
.nav-tab.active[data-product="code"] {
  background: linear-gradient(135deg, #da7756, #c2613e);
}
```

**Step 3: 브라우저에서 확인**

네비게이션에 [Easy] [Claw | Code] 탭이 보이고, Claw가 기본 활성 상태인지 확인.

**Step 4: 커밋**

```bash
git add index.html
git commit -m "feat: 네비게이션에 Easy 브랜드 탭 추가 (Claw/Code)"
```

---

### Task 2: 제품별 콘텐츠 데이터 구조 생성

**Files:**
- Create: `products.js` — 제품별 콘텐츠 데이터

**Step 1: products.js 작성**

```js
var PRODUCTS = {
  claw: {
    name: 'EasyClaw',
    accent: '#f97316',
    accentHover: '#fb923c',
    accentLight: '#fdba74',
    accentGlow: 'rgba(249, 115, 22, 0.35)',
    github: 'ybgwon96/easyclaw',
    downloads: {
      mac: 'https://github.com/ybgwon96/easyclaw/releases/latest/download/easy-claw.dmg',
      win: 'https://github.com/ybgwon96/easyclaw/releases/latest/download/easy-claw-setup.exe'
    },
    heroIcon: 'claw', // SVG 아이콘 키
    demoGif: 'demo.gif',
    productHunt: 'https://www.producthunt.com/products/easyclaw-3?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-easyclaw-4',
    productHuntImg: 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1088478&theme=light&t=1772460170834',
    kakao: 'https://open.kakao.com/o/gbBkPehi'
  },
  code: {
    name: 'EasyCode',
    accent: '#da7756',
    accentHover: '#e08a6a',
    accentLight: '#e8a98e',
    accentGlow: 'rgba(218, 119, 86, 0.35)',
    github: 'ybgwon96/easycode',
    downloads: {
      mac: 'https://github.com/ybgwon96/easycode/releases/latest/download/easy-code.dmg',
      win: 'https://github.com/ybgwon96/easycode/releases/latest/download/easy-code-setup.exe'
    },
    heroIcon: 'code', // SVG 아이콘 키
    demoGif: null,
    productHunt: null,
    productHuntImg: null,
    kakao: 'https://open.kakao.com/o/gbBkPehi'
  }
}
```

**Step 2: 커밋**

```bash
git add products.js
git commit -m "feat: 제품별 콘텐츠 데이터 구조 생성"
```

---

### Task 3: i18n.js에 EasyCode 번역 키 추가

**Files:**
- Modify: `i18n.js` — translations 객체에 EasyCode 키 추가

**Step 1: 한국어 번역 추가**

translations.ko 객체에 추가:

```js
// EasyCode 전용 키
'easycode.hero.tagline': '복잡한 터미널 설정은 잊으세요.<br><strong>Claude Code</strong>를 원클릭으로 설치하세요.',
'easycode.hero.versionRelease': '출시됨',
'easycode.hero.versionFallback': '최신 버전',
'easycode.features.title': '왜 EasyCode인가요?',
'easycode.features.sub': 'Claude Code 설치의 모든 번거로움을 없앴습니다.',
'easycode.features.oneclick.title': '원클릭 설치',
'easycode.features.oneclick.desc': '환경을 자동으로 감지하고 필요한 모든 도구를 한 번에 설치합니다.',
'easycode.features.envcheck.title': '스마트 환경 체크',
'easycode.features.envcheck.desc': 'Git, Node.js 등 사전 요구사항을 자동으로 확인하고 안내합니다.',
'easycode.features.i18n.title': '다국어 지원',
'easycode.features.i18n.desc': '한국어, 영어, 일본어, 중국어 4개 언어를 지원합니다.',
'easycode.steps.title': '3단계면 끝',
'easycode.steps.sub': '설치 파일을 받고, 실행하고, 코딩하세요.',
'easycode.steps.download.title': '다운로드',
'easycode.steps.download.desc': 'OS에 맞는 설치 파일을<br>한 번에 다운로드',
'easycode.steps.install.title': '설치 실행',
'easycode.steps.install.desc': '환경 체크 후<br>원클릭 자동 설치',
'easycode.steps.chat.title': '코딩 시작',
'easycode.steps.chat.desc': 'Claude Code로<br>바로 대화 시작',
'easycode.cta.title': '지금 바로 시작하세요',
'easycode.cta.desc': '터미널 명령어 없이, 클릭 한 번으로 Claude Code를 설치하세요.',
```

**Step 2: en, ja, zh 번역도 동일 구조로 추가**

(각 언어의 기존 패턴을 따름)

**Step 3: 커밋**

```bash
git add i18n.js
git commit -m "feat: EasyCode 다국어 번역 키 추가 (ko/en/ja/zh)"
```

---

### Task 4: EasyCode Hero 섹션용 SVG 아이콘 추가

**Files:**
- Modify: `index.html` — hero 섹션 내 숨겨진 SVG template 추가

**Step 1: EasyCode 아이콘 SVG 작성**

코드 브래킷 + 스파클 모티프 (EasyCode 앱 아이콘과 동일한 컨셉):

```html
<template id="icon-code">
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8a98e"/>
        <stop offset="100%" stop-color="#c2613e"/>
      </linearGradient>
      <radialGradient id="cgw" cx="50%" cy="45%">
        <stop offset="0%" stop-color="#da7756" stop-opacity=".2"/>
        <stop offset="100%" stop-color="#da7756" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="60" rx="48" ry="48" fill="url(#cgw)"/>
    <rect x="20" y="20" width="80" height="80" rx="16" fill="url(#cg)"/>
    <!-- 코드 브래킷 -->
    <path d="M45 40L30 60L45 80" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M75 40L90 60L75 80" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="65" y1="35" x2="55" y2="85" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <!-- 스파클 -->
    <circle cx="95" cy="25" r="3" fill="#e8a98e"/>
    <circle cx="100" cy="18" r="2" fill="#e8a98e" opacity="0.6"/>
  </svg>
</template>
```

**Step 2: 커밋**

```bash
git add index.html
git commit -m "feat: EasyCode 히어로 아이콘 SVG 추가"
```

---

### Task 5: SPA 라우터 구현 — 제품 전환 로직

**Files:**
- Create: `router.js` — SPA 라우팅 + 콘텐츠 전환 엔진

**Step 1: router.js 작성**

```js
;(function () {
  var currentProduct = 'claw'

  function getProductFromPath() {
    var path = window.location.pathname
    if (path === '/easycode' || path === '/easycode/') return 'code'
    return 'claw'
  }

  function updateAccentColors(product) {
    var p = PRODUCTS[product]
    var root = document.documentElement
    root.style.setProperty('--primary', p.accent)
    root.style.setProperty('--primary-hover', p.accentHover)
    root.style.setProperty('--primary-light', p.accentLight)
    root.style.setProperty('--primary-glow', p.accentGlow)
  }

  function updateNavTabs(product) {
    document.querySelectorAll('.nav-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.product === product)
    })
    // 네비 다운로드 버튼 링크 업데이트
    var navDl = document.getElementById('nav-download-btn')
    if (navDl) navDl.href = PRODUCTS[product].downloads.mac
  }

  function updateHero(product) {
    var p = PRODUCTS[product]
    var lang = getCurrentLang()
    var t = translations[lang] || translations.ko
    var prefix = product === 'claw' ? '' : 'easycode.'

    // 로고 텍스트
    var logoEl = document.querySelector('.hero .logo')
    logoEl.querySelector('.claw').textContent = product === 'claw' ? 'Claw' : 'Code'

    // 태그라인
    var tagline = document.querySelector('.tagline')
    tagline.innerHTML = t[prefix + 'hero.tagline'] || tagline.innerHTML

    // 히어로 아이콘 전환
    var iconWrap = document.querySelector('.lobster-wrap')
    var template = document.getElementById('icon-' + product)
    if (template) {
      iconWrap.innerHTML = template.innerHTML
    }

    // 다운로드 링크 업데이트
    var btns = document.querySelectorAll('.hero .btn-primary')
    btns[0].href = p.downloads.mac
    btns[1].href = p.downloads.win

    // GitHub Star 링크
    var ghostBtns = document.querySelectorAll('.hero .btn-ghost')
    if (ghostBtns[0]) ghostBtns[0].href = 'https://github.com/' + p.github

    // 데모 GIF
    var demoImg = document.querySelector('.hero img[alt]')
    if (demoImg) {
      demoImg.style.display = p.demoGif ? '' : 'none'
      if (p.demoGif) demoImg.src = p.demoGif
    }

    // Product Hunt 배지
    var phLink = document.querySelector('.hero a[href*="producthunt"]')
    if (phLink) {
      phLink.style.display = p.productHunt ? '' : 'none'
    }

    // 버전 배지
    fetchVersion(product)
  }

  function updateFeatures(product) {
    var lang = getCurrentLang()
    var t = translations[lang] || translations.ko
    var prefix = product === 'claw' ? '' : 'easycode.'
    // features 제목/설명 업데이트
    var titleEl = document.querySelector('#features .section-title')
    var subEl = document.querySelector('#features .section-sub')
    titleEl.textContent = t[prefix + 'features.title'] || titleEl.textContent
    subEl.textContent = t[prefix + 'features.sub'] || subEl.textContent

    // 카드 콘텐츠 업데이트
    var cards = document.querySelectorAll('.feature-card')
    var keys = product === 'claw'
      ? ['features.oneclick', 'features.agent', 'features.telegram']
      : ['easycode.features.oneclick', 'easycode.features.envcheck', 'easycode.features.i18n']
    cards.forEach(function (card, i) {
      card.querySelector('h3').textContent = t[keys[i] + '.title'] || ''
      card.querySelector('p').textContent = t[keys[i] + '.desc'] || ''
    })
  }

  function updateSteps(product) {
    var lang = getCurrentLang()
    var t = translations[lang] || translations.ko
    var prefix = product === 'claw' ? '' : 'easycode.'

    var section = document.getElementById('steps')
    section.querySelector('.section-title').textContent = t[prefix + 'steps.title']
    section.querySelector('.section-sub').textContent = t[prefix + 'steps.sub']

    var cards = section.querySelectorAll('.step-card')
    var keys = ['steps.download', 'steps.install', 'steps.chat']
    cards.forEach(function (card, i) {
      card.querySelector('h3').textContent = t[prefix + keys[i] + '.title']
      card.querySelector('p').innerHTML = t[prefix + keys[i] + '.desc']
    })
  }

  function updateCTA(product) {
    var p = PRODUCTS[product]
    var lang = getCurrentLang()
    var t = translations[lang] || translations.ko
    var prefix = product === 'claw' ? '' : 'easycode.'

    var section = document.querySelector('.cta')
    section.querySelector('h2').textContent = t[prefix + 'cta.title']
    section.querySelector('p').textContent = t[prefix + 'cta.desc']

    var btns = section.querySelectorAll('.btn-primary')
    btns[0].href = p.downloads.mac
    btns[1].href = p.downloads.win
  }

  function fetchVersion(product) {
    var p = PRODUCTS[product]
    var badge = document.getElementById('version-badge')
    badge.textContent = translations[getCurrentLang()]['hero.versionLoading'] || '최신 버전 확인 중...'
    fetch('https://api.github.com/repos/' + p.github + '/releases/latest')
      .then(function (r) { return r.json() })
      .then(function (d) {
        if (d.tag_name) {
          var lang = getCurrentLang()
          var t = translations[lang] || translations.ko
          var prefix = product === 'claw' ? '' : 'easycode.'
          badge.textContent = d.tag_name + ' ' + (t[prefix + 'hero.versionRelease'] || '출시됨')
        }
      })
      .catch(function () {
        var lang = getCurrentLang()
        var t = translations[lang] || translations.ko
        var prefix = product === 'claw' ? '' : 'easycode.'
        badge.textContent = t[prefix + 'hero.versionFallback'] || '최신 버전'
      })
  }

  function switchProduct(product) {
    if (product === currentProduct) return
    currentProduct = product
    updateAccentColors(product)
    updateNavTabs(product)
    updateHero(product)
    updateFeatures(product)
    updateSteps(product)
    updateCTA(product)
    updateCrossBanner(product)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateCrossBanner(product) {
    var other = product === 'claw' ? 'code' : 'claw'
    var otherP = PRODUCTS[other]
    var banner = document.getElementById('cross-banner')
    if (!banner) return
    var lang = getCurrentLang()
    var t = translations[lang] || translations.ko
    banner.querySelector('.cross-banner-name').textContent = otherP.name
    banner.querySelector('.cross-banner-desc').textContent =
      t['crossBanner.' + other + '.desc'] || ''
    banner.querySelector('.cross-banner-link').href =
      other === 'code' ? '/easycode' : '/'
  }

  // 네비게이션 탭 클릭 핸들러
  document.addEventListener('click', function (e) {
    var tab = e.target.closest('.nav-tab')
    if (!tab) return
    e.preventDefault()
    var product = tab.dataset.product
    var path = product === 'code' ? '/easycode' : '/'
    history.pushState({ product: product }, '', path)
    switchProduct(product)
  })

  // 브라우저 뒤로/앞으로 버튼
  window.addEventListener('popstate', function () {
    var product = getProductFromPath()
    switchProduct(product)
  })

  // 초기화
  function init() {
    currentProduct = getProductFromPath()
    updateAccentColors(currentProduct)
    updateNavTabs(currentProduct)
    if (currentProduct !== 'claw') {
      updateHero(currentProduct)
      updateFeatures(currentProduct)
      updateSteps(currentProduct)
      updateCTA(currentProduct)
    }
    updateCrossBanner(currentProduct)
  }

  // i18n 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // 전역 노출 (i18n 언어 변경 시 재적용용)
  window.switchProduct = switchProduct
  window.getCurrentProduct = function () { return currentProduct }
})()
```

**Step 2: index.html에 script 태그 추가**

`i18n.js` 뒤에:

```html
<script src="products.js"></script>
<script src="router.js"></script>
```

기존 인라인 `<script>`의 GitHub API fetch 코드는 제거 (router.js의 fetchVersion으로 대체).

**Step 3: 브라우저에서 확인**

- `easyclaw.kr` → EasyClaw 콘텐츠 표시
- `easyclaw.kr/easycode` → EasyCode 콘텐츠 표시
- 탭 클릭으로 전환 시 URL + 콘텐츠 변경
- 브라우저 뒤로 버튼 동작 확인

**Step 4: 커밋**

```bash
git add router.js index.html
git commit -m "feat: SPA 라우터 + 제품 전환 로직 구현"
```

---

### Task 6: 크로스 배너 섹션 추가

**Files:**
- Modify: `index.html` — CTA 섹션 뒤에 크로스 배너 HTML 추가
- Modify: `index.html` — 크로스 배너 CSS 추가

**Step 1: HTML 추가 (CTA 섹션 뒤, Community 섹션 앞)**

```html
<!-- Cross Banner -->
<section class="cross-banner-section" id="cross-banner">
  <div class="container">
    <div class="glass cross-banner-card reveal">
      <div class="cross-banner-content">
        <span class="cross-banner-label">Easy 시리즈</span>
        <h3 class="cross-banner-name">EasyCode</h3>
        <p class="cross-banner-desc">Claude Code도 원클릭으로 설치하세요.</p>
      </div>
      <a href="/easycode" class="btn btn-ghost cross-banner-link">
        <span>자세히 보기</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </a>
    </div>
  </div>
</section>
```

**Step 2: CSS 추가**

```css
.cross-banner-section {
  padding: 2rem 1.5rem 3rem;
}
.cross-banner-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2.5rem;
  gap: 1.5rem;
}
.cross-banner-label {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--primary);
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.2);
  margin-bottom: 0.5rem;
}
.cross-banner-name {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 0.3rem;
}
.cross-banner-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
}
.cross-banner-link {
  flex-shrink: 0;
}
@media (max-width: 480px) {
  .cross-banner-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
}
```

**Step 3: i18n.js에 크로스 배너 번역 키 추가**

```js
'crossBanner.code.desc': 'Claude Code도 원클릭으로 설치하세요.',
'crossBanner.claw.desc': 'AI 에이전트도 원클릭으로 설치하세요.',
```

**Step 4: 브라우저에서 확인**

CTA 아래에 크로스 배너가 표시되고, 제품 전환 시 반대 제품 정보가 표시되는지 확인.

**Step 5: 커밋**

```bash
git add index.html i18n.js
git commit -m "feat: 크로스 배너 섹션 추가 (Easy 시리즈 교차 홍보)"
```

---

### Task 7: 서버 라우팅 설정 (직접 URL 접근 대응)

**Files:**
- Create: `vercel.json` (Vercel 사용 시) 또는 `_redirects` (Netlify) 또는 서버 설정

**Step 1: 호스팅 플랫폼에 맞는 리다이렉트 설정**

Vercel:
```json
{
  "rewrites": [
    { "source": "/easycode", "destination": "/index.html" },
    { "source": "/easycode/", "destination": "/index.html" }
  ]
}
```

Netlify (`_redirects`):
```
/easycode    /index.html    200
/easycode/   /index.html    200
```

**Step 2: 직접 URL 접근 테스트**

브라우저에서 `easyclaw.kr/easycode` 직접 입력 → EasyCode 페이지가 올바르게 로드되는지 확인.

**Step 3: 커밋**

```bash
git add vercel.json  # 또는 _redirects
git commit -m "feat: /easycode 직접 접근을 위한 SPA 리다이렉트 설정"
```

---

### Task 8: EasyCode Feature 카드 아이콘 업데이트

**Files:**
- Modify: `router.js` — feature 카드 아이콘을 제품별로 교체하는 로직 추가

**Step 1: updateFeatures에 아이콘 전환 로직 추가**

EasyCode 3개 feature 카드의 아이콘 SVG:
- 원클릭 설치: 체크마크 (기존과 동일)
- 스마트 환경 체크: 서치/돋보기 아이콘
- 다국어 지원: 지구본 아이콘

```js
var featureIcons = {
  claw: [
    '<svg viewBox="0 0 24 24" ...>체크마크</svg>',
    '<svg viewBox="0 0 24 24" ...>마이크</svg>',
    '<svg viewBox="0 0 24 24" ...>채팅</svg>'
  ],
  code: [
    '<svg viewBox="0 0 24 24" ...>체크마크</svg>',
    '<svg viewBox="0 0 24 24" ...>돋보기</svg>',
    '<svg viewBox="0 0 24 24" ...>지구본</svg>'
  ]
}
```

**Step 2: 커밋**

```bash
git add router.js
git commit -m "feat: EasyCode feature 카드 아이콘 추가"
```

---

### Task 9: 언어 전환 시 현재 제품 콘텐츠 재적용

**Files:**
- Modify: `i18n.js` — 언어 전환 후 현재 제품 콘텐츠 재적용 호출

**Step 1: i18n.js의 setLang에 콜백 추가**

```js
// 기존 applyLang 호출 후
if (typeof switchProduct === 'function' && typeof getCurrentProduct === 'function') {
  switchProduct(getCurrentProduct() === 'claw' ? 'code' : 'claw') // 강제 재적용
  switchProduct(getCurrentProduct()) // 복원 (hacky하지만 단순)
}
```

또는 더 깔끔하게: router.js에 `refreshProduct()` 함수를 만들어 전체 콘텐츠를 현재 제품으로 재렌더.

**Step 2: 테스트**

- EasyCode 페이지에서 언어를 영어로 변경 → EasyCode 콘텐츠가 영어로 표시되는지 확인

**Step 3: 커밋**

```bash
git add i18n.js router.js
git commit -m "feat: 언어 전환 시 현재 제품 콘텐츠 동기화"
```

---

### Task 10: 최종 통합 테스트 및 마무리

**Step 1: 전체 플로우 테스트**

- [ ] `easyclaw.kr` 접속 → EasyClaw 콘텐츠 정상 표시
- [ ] Code 탭 클릭 → URL `/easycode`로 변경, EasyCode 콘텐츠 표시
- [ ] 강조색 `#da7756`으로 변경 확인
- [ ] macOS/Windows 다운로드 버튼 링크 정확한지 확인
- [ ] 크로스 배너 "EasyClaw" 링크 동작
- [ ] 브라우저 뒤로 버튼 → EasyClaw로 복귀
- [ ] `/easycode` 직접 접속 → 정상 로드
- [ ] 4개 언어 전환 모두 동작
- [ ] 모바일 (480px) 레이아웃 확인
- [ ] GitHub 버전 배지 각 제품별 정상 표시

**Step 2: 커밋**

```bash
git add -A
git commit -m "fix: 최종 통합 테스트 후 수정사항 반영"
```
