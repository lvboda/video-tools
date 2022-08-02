# video-tools
web端视频处理工具，支持视频格式转换、视频剪辑等。

[**English**](./README.md) **|** **简体中文**

## 预览
**预览地址**：[https://lvboda.cn/video-tools](https://lvboda.cn/video-tools)

## 功能
- [x] 音视频格式转换
- [x] 音视频编码
- [x] 音视频压缩
- [x] 音视频剪辑
- [x] 音视频合并
- [x] FFmpeg原生功能

## 开发
### 目录结构
```
├── dist                                            打包输出目录
├── node_modules                                    三方库
├── public                                          静态资源
├── src                                             开发目录
│   ├── utils                                       工具包
│   ├── advance.ts                                  高级功能相关
│   ├── clip-merge.ts                               剪辑合并相关
│   ├── format-convert.ts                           格式转换相关
│   ├── index.css                                   样式
│   ├── init-dom.ts                                 初始化dom
│   └── main.ts                                     入口
├── tsconfig.json                                   ts配置文件
├── vite.config.ts                                  vite配置文件
```

### 技术选型
ts + vite + jquery + bootstrap + FFmpeg

### 本地运行
``` bash
# 安装依赖
npm install

# 启动
npm run dev
```

### 打包
``` bash
npm run build
```

### 开发思路
使用 `FFmpeg` 的 `WebAssembly` 库实现在浏览器内调用 `FFmpeg.wasm`，在面对大文件处理任务时，能免去网络传输成本，从而达到网页端高性能。

详细请查看文章。

## 许可

[MIT](./LICENSE)

Copyright (c) 2022 - Boda Lü