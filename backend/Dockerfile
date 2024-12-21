# # ベースイメージにAlpine Linuxを使用
# FROM alpine:latest

# # 必要なツールをインストール
# RUN apk add --no-cache bash curl tar

# # Goの環境変数を設定
# ENV GO_VERSION=1.23.3
# ENV GOROOT=/usr/local/go
# ENV PATH="${GOROOT}/bin:${PATH}"

# # Goをダウンロードしてインストール
# RUN curl -LO https://go.dev/dl/go${GO_VERSION}.windows-amd64.tar.gz && \
#     tar -C /usr/local -xzf go${GO_VERSION}.windows-amd64.tar.gz && \
#     rm go${GO_VERSION}.windows-amd64.tar.gz

# # Goのバージョンを確認
# RUN go version

# # 作業ディレクトリを設定
# WORKDIR /app

# # Goモジュールファイルをコピー
# COPY go.mod go.sum ./

# # 依存関係をダウンロード
# RUN go mod download

# # アプリケーションコードをコピー
# COPY . .

# # アプリケーションをビルド
# RUN go build -o app

# # ポートを公開
# EXPOSE 5000

# # アプリケーションを起動
# CMD ["./app"]


# ベースイメージ
FROM node:18

# 作業ディレクトリ
WORKDIR /usr/src/app

# 必要なファイルをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# 環境変数ファイル (.env) をコピー
COPY .env .env

# ポート指定
EXPOSE 5000

# サーバ起動
CMD ["npm", "start"]
