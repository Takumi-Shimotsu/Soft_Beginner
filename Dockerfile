# ベースイメージとしてNode.jsを使用
FROM node:18-alpine AS base

# 必要なツールをインストールするステージ
FROM base AS tools
RUN apk add --no-cache curl tar

# Goをインストールするステージ
FROM tools AS golang
# Goのバージョンを指定
ENV GO_VERSION=1.23.3
ENV GOROOT=/usr/local/go
ENV PATH="${GOROOT}/bin:${PATH}"

# Goをダウンロードしてインストール
RUN curl -LO https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz && \
    rm go${GO_VERSION}.linux-amd64.tar.gz && \
    go version

# 最終ステージでNode.jsとGoの環境を統合
FROM golang AS final

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 必要な依存関係をインストール
RUN npm install langchain@0.0.108 openai

# アプリケーションのコードをコピー
COPY . .

# 環境変数ファイル (.env) をコピー
COPY .env .env

# 環境変数を指定（ビルド時の環境変数）
ARG OPENAI_API_KEY

# ビルドプロセスを実行
RUN npm run build

# ポート3000を公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]