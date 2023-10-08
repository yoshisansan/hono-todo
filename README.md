# HonoのTodoApp
参照：https://zenn.dev/azukiazusa/articles/hono-cloudflare-workers-rest-api

## 始め方

```
npm i
npm run start
```

### 開発用の KV 作成

```exapmle
wrangler kv:namespace create "HONO_TODO" --preview
```

### 本番用 KV の作成（必要な場合）
```
wrangler kv:namespace create "HONO_TODO"
```

### wrangler.tomlのファイル作成と記述

```wrangler.toml
name = "hono-todo-app"
main = "src/index.ts"
node_compat = true
compatibility_date = "2023-05-18"
kv_namespaces = [
  { binding = "HONO_TODO", preview_id = "KV作成で出力されたpreview_idを入力する", id = "KV作成で出力されたidを入力する" }
]

```

### Test実行
```
npm run test
```# hono-todo
