# video-tools
A web side video processing tool that supports audio/video format conversion and coding.

**English** **|** [**简体中文**](./README.zh-cn.md)

## Preview
**preview address**: [https://lvboda.cn/video-tools](https://lvboda.cn/video-tools)

## Feature
- [x] audio/video format conversion
- [x] audio/video codec
- [x] audio/video compression
- [x] audio/video clip
- [x] audio/video merge
- [x] FFmpeg native function

## Develop
### Directory Structure
```
├── dist                                            build output
├── node_modules                                    dependent library
├── public                                          static resource
├── src
│   ├── utils                                       utils
│   ├── advance.ts                                  advance
│   ├── clip-merge.ts                               clip and merge
│   ├── format-convert.ts                           format convert
│   ├── index.css                                   style
│   ├── init-dom.ts                                 init dom
│   └── main.ts                                     main
├── tsconfig.json                                   ts config
├── vite.config.ts                                  vite config
```

### Technical Choice
ts + vite + jquery + bootstrap + FFmpeg

### Local Run
``` bash
npm install

# start
npm run dev
```

### Build
``` bash
npm run build
```

### Idea
Using `FFmpeg` `WebAssembly` library implementation in the browser to call `FFmpeg.wasm`, in the face of large file processing tasks, can be free of network transmission costs, so as to achieve high performance on the web side.

See article for details.

## License

[MIT](./LICENSE)

Copyright (c) 2022 - Boda Lü
