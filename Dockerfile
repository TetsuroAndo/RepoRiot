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

# TypeScriptをビルド
RUN npm run build

# ポート5000を公開
EXPOSE 5000

# コンテナ起動時に実行するコマンド
CMD ["npm", "start"]
