FROM eclipse-temurin:21-jdk-jammy

# Node 20 (NodeSource) を入れる
RUN apt-get update \
 && apt-get install -y curl ca-certificates gnupg \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && node -v \
 && npm -v \
 && npm i -g firebase-tools \
 && firebase --version \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
