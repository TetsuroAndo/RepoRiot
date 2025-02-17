# Node.jsの公式イメージを使用
FROM node:16

# 作業ディレクトリを指定
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコンテナにコピー
COPY package*.json ./

# 必要なパッケージをインストール
RUN npm install

# アプリケーションコードをコンテナにコピー
COPY . .

# TypeScriptをビルドしてSwaggerドキュメントを生成
RUN npm run build

# publicディレクトリが存在することを確認
RUN mkdir -p public

# ポート3000を公開
EXPOSE 5000

# コンテナ起動時に実行するコマンド
CMD ["npm", "start"]
