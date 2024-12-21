# ベースイメージとしてNode.jsを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 必要な依存関係をインストール
RUN npm install

# アプリケーションのコードをコピー
COPY . .

# 環境変数ファイル (.env) をコピー
COPY .env .env

# 環境変数を指定（ビルド時の環境変数）
ARG REACT_APP_OPENAI_API_KEY

# ビルドプロセスを実行
RUN npm run build

# ポート3000を公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]