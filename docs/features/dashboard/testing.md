# ダッシュボード テスト仕様

## テスト構成

```
src/
└── services/
    └── __tests__/
        └── dashboard.service.test.ts  # サービスのユニットテスト
```

## テストケース

### 1. ユニットテスト（DashboardService）

#### getDashboardData
- 正常系
  - ✅ 全てのデータが正常に取得できる
  - ✅ サブスクリプションがない場合、デフォルト値が返される
  - ✅ 統計情報が0の場合、0が返される

- 異常系
  - ✅ ユーザーが存在しない場合、エラーがスローされる
  - ✅ データベースエラー時、適切なエラーがスローされる

### 2. 統合テスト

#### GET /api/dashboard
- 認証
  - ✅ 認証済みユーザーがアクセスできる
  - ✅ 未認証ユーザーは401エラー

- レスポンス
  - ✅ 正しい形式のJSONが返される
  - ✅ 全ての必要なフィールドが含まれている
  - ✅ データ型が仕様通り

### 3. パフォーマンステスト

#### レスポンス時間
- 目標値
  - 平均: 300ms以下
  - 95パーセンタイル: 500ms以下
  - 99パーセンタイル: 1000ms以下

#### 同時接続
- 目標値
  - 100リクエスト/秒を維持
  - エラー率1%以下

## テストデータ

### モックユーザー
```typescript
const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  avatarUrl: "https://example.com/avatar.jpg",
  name: "Test User"
};
```

### モックリポジトリ
```typescript
const mockRepos = {
  total: 2,
  recent: [{
    id: 1,
    name: "repo1",
    description: "description1",
    url: "https://github.com/repo1",
    stars: 10,
    forks: 5,
    language: "TypeScript",
    updatedAt: new Date()
  }]
};
```

### モック記事
```typescript
const mockArticles = {
  total: 1,
  recent: [{
    id: 1,
    title: "Article 1",
    repoId: 1,
    repoName: "repo1",
    createdAt: new Date(),
    updatedAt: new Date(),
    statistics: {
      views: 100,
      likes: 50
    }
  }]
};
```

## テスト実行手順

1. ユニットテスト実行
```bash
pnpm test src/services/__tests__/dashboard.service.test.ts
```

2. 統合テスト実行
```bash
pnpm test:integration
```

3. パフォーマンステスト実行
```bash
pnpm test:performance
```

## CI/CD統合

### テスト自動化
- プルリクエスト時に自動実行
- main/developブランチへのマージ時に自動実行

### 品質ゲート
- ユニットテストカバレッジ: 80%以上
- 統合テスト: 全件成功
- パフォーマンステスト: 目標値をクリア
