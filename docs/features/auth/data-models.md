# 認証システム データモデル

## データベースモデル

```mermaid
erDiagram
    User ||--o{ OAuthProfile : has
    User ||--o{ Session : has
    User ||--o{ RefreshToken : has
    User ||--o{ Role : has
    Role ||--o{ Permission : contains
    
    User {
        int id PK
        string email UK
        string username UK
        string hashedPassword
        string salt
        boolean isActive
        boolean isMfaEnabled
        datetime lastLogin
        datetime createdAt
        datetime updatedAt
    }

    OAuthProfile {
        int id PK
        int userId FK
        string provider
        string providerId UK
        string accessToken
        string refreshToken
        datetime expiresAt
        datetime createdAt
        datetime updatedAt
    }

    Session {
        string id PK
        int userId FK
        string token
        string userAgent
        string ipAddress
        datetime expiresAt
        datetime createdAt
        datetime updatedAt
    }

    RefreshToken {
        string id PK
        int userId FK
        string token
        boolean isRevoked
        datetime expiresAt
        datetime createdAt
    }

    Role {
        int id PK
        string name UK
        string description
        datetime createdAt
        datetime updatedAt
    }

    Permission {
        int id PK
        int roleId FK
        string resource
        string action
        datetime createdAt
        datetime updatedAt
    }
```

## キャッシュモデル

```mermaid
graph TD
    subgraph "Redisキャッシュ"
        A[セッションストア] --> |TTL| B[セッションデータ]
        C[トークンストア] --> |TTL| D[JWTトークン]
        E[レート制限] --> |カウンター| F[APIリクエスト]
    end
```

## 型定義

### ユーザー関連

```typescript
interface User {
  id: number;
  email: string;
  username: string;
  hashedPassword?: string;
  salt?: string;
  isActive: boolean;
  isMfaEnabled: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  oauthProfiles?: OAuthProfile[];
  roles?: Role[];
}

interface OAuthProfile {
  id: number;
  userId: number;
  provider: 'github' | 'gitlab';
  providerId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 認証関連

```typescript
interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface JWTPayload {
  sub: number;
  email: string;
  username: string;
  roles: string[];
  iat: number;
  exp: number;
}
```

### セッション関連

```typescript
interface Session {
  id: string;
  userId: number;
  token: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionData {
  userId: number;
  roles: string[];
  permissions: Permission[];
  lastActivity: Date;
}
```

### アクセス制御

```typescript
interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

interface Permission {
  id: number;
  roleId: number;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  createdAt: Date;
  updatedAt: Date;
}
```

## データフロー

```mermaid
graph TD
    subgraph "認証フロー"
        A[認証リクエスト] --> B{認証タイプ}
        B --> |OAuth| C[OAuthフロー]
        B --> |Password| D[パスワード認証]
        C --> E[トークン生成]
        D --> E
        E --> F[セッション作成]
    end

    subgraph "データ処理"
        F --> G[Redisキャッシュ]
        F --> H[データベース保存]
        G --> I[セッション管理]
        H --> J[監査ログ]
    end
```
