#!/usr/bin/env bash

# 出力先ファイル名
OUTPUT_FILE="SOURCE.txt"

# 既にファイルがあれば削除
rm -f "$OUTPUT_FILE"

tree . > "$OUTPUT_FILE"
echo -e "\n\n" >> "$OUTPUT_FILE"

####################################
# 1. 手動で含めたい特定のファイル #
####################################
# （tsconfig.json / tsoa.json / .env.example / Dockerfile / docker-compose.yml
#   package.json / prisma/schema.prisma など）
FILES=(
  "tsconfig.json"
  "tsoa.json"
  ".env.example"
  "Dockerfile"
  "docker-compose.yml"
  "package.json"
  "prisma/schema.prisma"
)

# それらを順番に結合
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "--------------------------------------------------------------------------------" >> "$OUTPUT_FILE"
    echo "$file:" >> "$OUTPUT_FILE"
    echo "--------------------------------------------------------------------------------" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo -e "\n\n" >> "$OUTPUT_FILE"
  fi
done

####################################
# 2. src/ ディレクトリ下の .ts ファイル #
####################################
# findで .tsファイルを探し、自動生成ファイル(例: routes.ts)などを除外する
FOUND_TS=$(find src -type f -name "*.ts" ! -path "src/routes/routes.ts")

for file in $FOUND_TS; do
  echo "--------------------------------------------------------------------------------" >> "$OUTPUT_FILE"
  echo "$file:" >> "$OUTPUT_FILE"
  echo "--------------------------------------------------------------------------------" >> "$OUTPUT_FILE"
  cat "$file" >> "$OUTPUT_FILE"
done

cat "$OUTPUT_FILE" | pbcopy
rm "$OUTPUT_FILE"

echo "Successfully copied to clipboard!"