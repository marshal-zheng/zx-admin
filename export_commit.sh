#!/bin/bash

# 读取 commit id
read -p "请输入起始 commit id: " commit_id
if [ -z "$commit_id" ]; then
  echo "❌ commit id 不能为空"
  exit 1
fi

# 验证 commit id 是否存在
if ! git rev-parse --verify "$commit_id" >/dev/null 2>&1; then
  echo "❌ commit id '$commit_id' 不存在"
  exit 1
fi

# 读取导出目录
read -p "请输入导出文件夹路径 (默认: ./archive): " target_dir
if [ -z "$target_dir" ]; then
  target_dir="./archive"
fi

mkdir -p "$target_dir"

# 获取当前分支的最新 commit
latest_commit=$(git rev-parse HEAD)

# 获取从指定 commit 到最新提交的所有改动文件列表（去重）
changed_files=$(git diff --name-only "$commit_id".."$latest_commit" | sort | uniq)

if [ -z "$changed_files" ]; then
  echo "⚠️ 从 $commit_id 到最新提交没有改动文件"
  exit 0
fi

echo "📊 从 $commit_id 到 $latest_commit 共有 $(echo "$changed_files" | wc -l) 个文件发生改动"

# 导出改动过的文件（使用最新版本）
for file in $changed_files; do
  # 检查文件是否在最新提交中存在
  if git cat-file -e "$latest_commit:$file" 2>/dev/null; then
    # 确保目标子目录存在
    mkdir -p "$target_dir/$(dirname "$file")"
    # 从最新提交中恢复该文件内容
    git show "$latest_commit:$file" > "$target_dir/$file" 2>/dev/null
    echo "✓ 导出: $file"
  else
    echo "⚠️ 跳过已删除文件: $file"
  fi
done

# 获取起始和结束 commit 信息
start_commit_date=$(git show -s --format=%ci "$commit_id")
start_commit_msg=$(git show -s --format=%s "$commit_id")
end_commit_date=$(git show -s --format=%ci "$latest_commit")
end_commit_msg=$(git show -s --format=%s "$latest_commit")

# 获取涉及的所有 commit 列表
commit_range=$(git rev-list --reverse "$commit_id".."$latest_commit")
commit_count=$(echo "$commit_range" | wc -l)

# 生成说明文件
info_file="$target_dir/export_info.txt"
{
  echo "=== 导出信息 ==="
  echo "导出目录: $target_dir"
  echo "导出时间: $(date)"
  echo ""
  echo "=== Commit 范围 ==="
  echo "起始 Commit: $commit_id"
  echo "起始日期: $start_commit_date"
  echo "起始信息: $start_commit_msg"
  echo ""
  echo "结束 Commit: $latest_commit"
  echo "结束日期: $end_commit_date"
  echo "结束信息: $end_commit_msg"
  echo ""
  echo "涉及 Commit 数量: $commit_count"
  echo ""
  echo "=== 改动文件列表 ($(echo "$changed_files" | wc -l) 个文件) ==="
  echo "$changed_files"
  echo ""
  echo "=== 所有相关 Commits ==="
  git log --oneline "$commit_id".."$latest_commit"
} > "$info_file"

echo ""
echo "✅ 导出完成：包含从 $commit_id 到最新提交的所有改动文件"
echo "📄 说明文件: $info_file"
echo "📁 导出目录: $target_dir"
