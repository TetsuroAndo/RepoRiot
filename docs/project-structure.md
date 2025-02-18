# RepoRiot プロジェクト構造ドキュメント

## 目次
1. [プロジェクト概要](#プロジェクト概要)
2. [システムアーキテクチャ](#システムアーキテクチャ)
3. [データベース設計](#データベース設計)
4. [APIエンドポイント](#apiエンドポイント)
5. [ディレクトリ構造](#ディレクトリ構造)

## プロジェクト概要
RepoRiotは、GitHubやGitLabのリポジトリに関する記事を管理・共有するプラットフォームです。

## システムアーキテクチャ

```mermaid
graph TD
    Client[クライアント] --> |HTTP/REST| API[API Server]
    API --> |Query/Mutation| DB[(PostgreSQL)]
    API --> |Authentication| Auth[認証サービス]
    Auth --> |OAuth| GitHub[GitHub]
    Auth --> |OAuth| GitLab[GitLab]
```

## データベース設計

```mermaid
erDiagram
    User ||--o{ Repo : owns
    User ||--o{ Subscription : has
    User ||--o{ Payment : makes
    User ||--o{ Notification : receives
    User ||--o{ ArticleRating : rates
    User ||--|| UserSettings : has

    Repo ||--o{ Article : contains
    Repo }o--o{ Tag : has

    Article ||--o{ Comment : has
    Article ||--|| ArticleCache : has
    Article ||--|| Statistics : has
    Article }o--o{ Tag : has
    Article ||--o{ ArticleRating : receives

    Plan {
        int id PK
        string name
        string description
        int price
    }

    User {
        int id PK
        string githubId UK
        string gitlabId UK
        string email UK
        string username UK
        string name
        string accessToken
        string refreshToken
        string avatarUrl
        string provider
    }

    Repo {
        int id PK
        string name
        string description
        string url
        int userId FK
        int stars
        int forks
        string language
    }
```

## APIエンドポイント

### 認証関連
```mermaid
sequenceDiagram
    Client->>+API: POST /auth/login
    API->>+OAuth Provider: リダイレクト
    OAuth Provider-->>-API: コールバック
    API-->>-Client: アクセストークン

    Client->>+API: GET /auth/me
    API-->>-Client: ユーザー情報
```

### 記事関連
```mermaid
sequenceDiagram
    Client->>+API: GET /articles
    API->>+DB: 記事一覧取得
    DB-->>-API: 記事データ
    API-->>-Client: 記事一覧

    Client->>+API: POST /articles
    API->>+DB: 記事保存
    DB-->>-API: 保存結果
    API-->>-Client: 作成された記事
```

## ディレクトリ構造

```
backend-repo/
├── src/
│   ├── config/        # 設定ファイル
│   ├── controllers/   # APIコントローラー
│   ├── middleware/    # ミドルウェア
│   ├── models/        # データモデル
│   ├── routes/        # ルーティング
│   ├── services/      # ビジネスロジック
│   ├── types/         # 型定義
│   └── utils/         # ユーティリティ
├── prisma/
│   └── schema.prisma  # データベーススキーマ
├── docs/             # ドキュメント
└── public/           # 静的ファイル
```

各ディレクトリの役割：

- `src/config`: アプリケーションの設定ファイルを管理
- `src/controllers`: HTTPリクエストの処理とレスポンスの生成
- `src/middleware`: 認証やログなどの共通処理
- `src/models`: データモデルの定義
- `src/routes`: APIエンドポイントのルーティング
- `src/services`: ビジネスロジックの実装
- `src/types`: TypeScript型定義
- `src/utils`: 共通ユーティリティ関数
