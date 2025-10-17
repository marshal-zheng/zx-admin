# Windows 环境启动指南

## 问题描述
在Windows系统上运行项目时，直接使用 `vite` 命令会出现 "'vite' 不是内部或外部命令" 的错误。

## 解决方案

### 方案1：使用正确的启动命令
项目使用 pnpm 作为包管理器，请使用以下命令启动：
```bash
pnpm dev
```

### 方案2：安装pnpm（如果未安装）
1. 全局安装pnpm：
   ```bash
   npm install -g pnpm
   ```

2. 或者使用yarn安装pnpm：
   ```bash
   yarn global add pnpm
   ```

3. 验证安装：
   ```bash
   pnpm --version
   ```

### 方案3：重新安装依赖（推荐）
由于跨平台复制node_modules可能导致兼容性问题，建议：

1. 删除 node_modules 文件夹
2. 重新安装依赖：
   ```bash
   pnpm install
   ```
3. 启动项目：
   ```bash
   pnpm dev
   ```

### 方案4：使用npx（如果pnpm不可用）
如果无法使用pnpm，可以临时使用npm：
```bash
npm install
npm run dev
```

## 注意事项
1. 不建议直接复制整个项目包括node_modules，因为某些依赖可能包含平台特定的二进制文件
2. 推荐只复制源代码，在目标机器上重新安装依赖
3. 确保Node.js版本 >= 18.0.0

## 验证环境
运行以下命令验证环境：
```bash
node --version  # 应该 >= 18.0.0
pnpm --version  # 应该 >= 8.1.0
```