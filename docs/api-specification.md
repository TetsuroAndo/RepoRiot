# API仕様書

## 認証API

### POST /auth/login
OAuth認証を開始します。

**リクエストパラメータ**
```json
{
  "provider": "github" | "gitlab"
}
```

**レスポンス**
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

### GET /auth/me
現在のユーザー情報を取得します。

**レスポンス**
```json
{
  "id": "number",
  "email": "string",
  "username": "string",
  "name": "string",
  "avatarUrl": "string"
}
```

## リポジトリAPI

### GET /repos
ユーザーのリポジトリ一覧を取得します。

**クエリパラメータ**
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 10）

**レスポンス**
```json
{
  "items": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "url": "string",
      "stars": "number",
      "forks": "number",
      "language": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### POST /repos
新しいリポジトリを登録します。

**リクエストボディ**
```json
{
  "name": "string",
  "description": "string",
  "url": "string"
}
```

## 記事API

### GET /articles
記事一覧を取得します。

**クエリパラメータ**
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 10）
- `repoId`: リポジトリID（オプション）
- `tag`: タグ名（オプション）

**レスポンス**
```json
{
  "items": [
    {
      "id": "number",
      "title": "string",
      "content": "string",
      "repoId": "number",
      "version": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "tags": ["string"]
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### POST /articles
新しい記事を作成します。

**リクエストボディ**
```json
{
  "title": "string",
  "content": "string",
  "repoId": "number",
  "tags": ["string"]
}
```

### PUT /articles/{id}
記事を更新します。

**リクエストボディ**
```json
{
  "title": "string",
  "content": "string",
  "tags": ["string"]
}
```

### DELETE /articles/{id}
記事を削除します。

## コメントAPI

### GET /articles/{id}/comments
記事のコメント一覧を取得します。

**レスポンス**
```json
{
  "items": [
    {
      "id": "number",
      "content": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### POST /articles/{id}/comments
記事にコメントを追加します。

**リクエストボディ**
```json
{
  "content": "string"
}
```

## 評価API

### POST /articles/{id}/ratings
記事を評価します。

**リクエストボディ**
```json
{
  "like": "boolean",
  "rating": "number"
}
```

## サブスクリプションAPI

### GET /subscriptions
現在のサブスクリプション情報を取得します。

**レスポンス**
```json
{
  "plan": "string",
  "status": "string",
  "startDate": "string",
  "endDate": "string"
}
```

### POST /subscriptions
新しいサブスクリプションを開始します。

**リクエストボディ**
```json
{
  "plan": "string"
}
```
