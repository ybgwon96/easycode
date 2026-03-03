#!/usr/bin/env node

/**
 * 릴리즈 스크립트 (macOS/Windows 공용)
 *
 * 사용법:
 *   npm run release            # patch (0.1.0 → 0.1.1)
 *   npm run release -- minor   # minor (0.1.0 → 0.2.0)
 *   npm run release -- major   # major (0.1.0 → 1.0.0)
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const run = (cmd) => execSync(cmd, { cwd: rootDir, stdio: 'inherit' })
const runSilent = (cmd) => execSync(cmd, { cwd: rootDir, encoding: 'utf8' }).trim()

const bump = process.argv[2] || 'patch'
if (!['patch', 'minor', 'major'].includes(bump)) {
  console.error(`잘못된 버전 타입: ${bump} (patch | minor | major)`)
  process.exit(1)
}

// 1. 워킹 트리 클린 확인
const status = runSilent('git status --porcelain')
if (status) {
  console.error('커밋되지 않은 변경사항이 있습니다. 먼저 커밋하세요.')
  process.exit(1)
}

// 2. 버전 bump
run(`npm version ${bump} --no-git-tag-version`)
const { version } = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
const tag = `v${version}`
console.log(`\n>> 버전: ${tag}`)

// 3. 커밋 & 푸시
run('git add package.json package-lock.json')
run(`git commit -m "chore: bump version to ${tag}"`)
run('git push origin main')
console.log('>> 커밋 & 푸시 완료')

// 4. GitHub 릴리즈 생성 → Actions가 자동 빌드 & 업로드
run(`gh release create ${tag} --title "${tag}" --notes "Release ${tag}"`)
console.log(`\n릴리즈 ${tag} 완료! Actions에서 빌드 진행 중:`)
console.log('  gh run list --limit 3')
