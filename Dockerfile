# Node.jsの公式イメージを使用
FROM node:23

# pnpmをインストール
RUN corepack enable && corepack prepare pnpm@latest --activate

# 作業ディレクトリを指定
WORKDIR /usr/src/app

# package.jsonとprismaスキーマをコンテナにコピー
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# 必要なパッケージをインストール
RUN pnpm install --frozen-lockfile

# Prisma Clientを生成
RUN pnpm exec prisma generate

# アプリケーションコードをコンテナにコピー
COPY . .

# Prisma Clientを生成
RUN pnpm exec prisma generate

# TypeScriptをビルドしてSwaggerドキュメントを生成
RUN pnpm run build

# publicディレクトリが存在することを確認
RUN mkdir -p public

# 環境変数PORTをコンテナ内に設定
EXPOSE ${PORT:-5050}

# コンテナ起動時に実行するコマンド
CMD ["pnpm", "start"]
