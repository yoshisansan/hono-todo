import type { Hono } from 'hono'

// c.envの型定義
export type Bindings = {
  HONO_TODO: KVNamespace
}

// テスト環境ではgetMiniflareBindingsからenvを取得するため、それに伴う型宣言
declare global {
  function getMiniflareBindings(): Bindings
}
