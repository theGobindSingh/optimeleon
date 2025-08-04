#!/usr/bin/env bash
# bootstrap-docker.sh — install & configure Docker Engine + CLI plugins on Debian/Ubuntu-like Linux or macOS

set -e

echo "ℹ️  Detecting OS…"
OS="$(uname -s)"

install_linux() {
  echo "🔄 Updating package index…"
  sudo apt-get update

  echo "📦 Installing prerequisites…"
  sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

  echo "🔑 Adding Docker’s official GPG key…"
  sudo mkdir -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg

  echo "📋 Setting up Docker repository…"
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  echo "🔄 Refreshing package index…"
  sudo apt-get update

  echo "🐳 Installing Docker Engine & CLI plugins…"
  sudo apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

  echo "👥 Allowing non-root Docker usage…"
  sudo groupadd docker 2>/dev/null || true
  sudo usermod -aG docker "$USER"
}

install_macos() {
  # Require Homebrew
  if ! command -v brew &> /dev/null; then
    echo "❗ Homebrew not found. Please install Homebrew first:"
    echo "    https://brew.sh"
    exit 1
  fi

  echo "🍺 Installing Docker Desktop via Homebrew…"
  brew install --cask docker

  echo "🔌 Installing CLI plugins…"
  brew install docker-buildx docker-compose docker-scan || true

  echo "⚙️  Enabling CLI plugins…"
  mkdir -p ~/.docker/cli-plugins
  ln -sf "$(brew --prefix)/bin/docker-compose" ~/.docker/cli-plugins/docker-compose
  ln -sf "$(brew --prefix)/bin/docker-buildx"   ~/.docker/cli-plugins/docker-buildx
  ln -sf "$(brew --prefix)/bin/docker-scan"     ~/.docker/cli-plugins/docker-scan

  echo "✅ Docker Desktop installed. Launch Docker.app once from /Applications."
}

case "$OS" in
  Linux)
    install_linux
    ;;
  Darwin)
    install_macos
    ;;
  *)
    echo "❌ Unsupported OS: $OS"
    exit 1
    ;;
esac

cat <<EOF

🎉 Docker installation complete!

Next steps:
  1) Restart your shell (and on WSL, run 'wsl --shutdown' from Windows).
  2) Verify Docker:
       docker version
       docker buildx version
       docker compose version

You can now manage Docker (and PostgreSQL containers) from your Node.js app.

EOF
