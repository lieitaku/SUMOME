# Hero 视频背景：做法与优化

## 快速开始：我只有一个 MP4

按顺序做这 4 步即可：

1. **安装 FFmpeg**（若未安装）  
   - macOS: `brew install ffmpeg`

2. **在终端里压缩视频并截 poster**（把 `你的视频.mp4` 换成你本地文件路径）  
   ```bash
   cd /Users/memory/SUMOME
   # 压缩：720p、约 20 秒、无声音，输出到 public/videos/
   ffmpeg -i 你的视频.mp4 -vf "scale=1280:720" -c:v libx264 -crf 28 -preset slow -an -t 20 -movflags +faststart -y public/videos/hero-bg.mp4
   # 截第一帧当封面
   ffmpeg -i public/videos/hero-bg.mp4 -vframes 1 -q:v 2 -y public/images/hero/hero-poster.jpg
   ```

3. **在首页启用**  
   打开 `src/app/(public)/page.tsx`，把 `<Hero sponsors={sponsors} />` 改成：  
   ```tsx
   <Hero sponsors={sponsors} videoSrc="/videos/hero-bg.mp4" posterSrc="/images/hero/hero-poster.jpg" />
   ```

4. 刷新首页即可看到视频背景（首屏先出 poster，加载完后自动播）。

---

## 业界常见做法

1. **先压体积，再上线**  
   20MB 的 MP4 直接放首屏会严重拖慢 LCP。通常把循环片段压到 **2～5MB**（720p 或 540p、15～30 秒），再作为背景。

2. **Poster 图必选**  
   首屏先显示一张静态封面（从视频截一帧），保证 LCP 不依赖视频。视频在后台加载，能播后再淡入。

3. **延迟加载视频**  
   等页面主资源（HTML/CSS/JS）加载完（`window.load`）再开始请求视频，避免和首屏关键请求抢带宽。

4. **静音 + 自动播放 + 循环**  
   浏览器要求背景视频必须 `muted` 才允许自动播放；`loop` + `playsInline` 保证移动端正常循环。

5. **可选：WebM**  
   同内容用 WebM 编码往往比 MP4 小 30%～50%，用 `<source type="video/webm">` 优先，Safari 用 MP4 兜底。

6. **移动端可选降级**  
   部分站点在移动端只显示 poster 图不播视频，省流量和电量；需要时可在 Hero 里用 `prefers-reduced-motion` 或 `window.matchMedia('(max-width: 768px)')` 做判断。

---

## 压缩视频（FFmpeg）

把 16:9 的 MP4 压到约 2～5MB、适合做背景循环：

```bash
# 720p，码率约 1.5Mbps，适合 15～30 秒片段
ffmpeg -i 你的原片.mp4 -vf "scale=1280:720" -c:v libx264 -crf 28 -preset slow -an -t 20 -movflags +faststart -y hero-bg.mp4

# 更小体积：540p
ffmpeg -i 你的原片.mp4 -vf "scale=960:540" -c:v libx264 -crf 30 -preset slow -an -t 20 -movflags +faststart -y hero-bg.mp4
```

- `-an`：去掉音轨，减小体积且符合静音背景需求。  
- `-t 20`：只保留前 20 秒（按需改）。  
- `-movflags +faststart`：把元数据移到文件头，便于流式播放。  
- 如需 WebM：`-c:v libvpx-vp9 -b:v 800k` 输出 `.webm`。

截一帧当 poster（例如第 0 秒）：

```bash
ffmpeg -i hero-bg.mp4 -vf "scale=1280:720" -vframes 1 -q:v 2 hero-poster.jpg
```

再用你习惯的方式转成 WebP 放到 `public/images/hero/hero-poster.webp` 或 `.jpg`。

---

## 在首页启用视频

1. 把压缩后的视频放到 `public/videos/`，例如：  
   - `public/videos/hero-bg.mp4`  
   - （可选）`public/videos/hero-bg.webm`
2. 把 poster 图放到 `public/images/hero/`，例如：  
   - `public/images/hero/hero-poster.jpg` 或 `hero-poster.webp`
3. 在首页给 Hero 传入视频与 poster：

```tsx
<Hero
  sponsors={sponsors}
  videoSrc="/videos/hero-bg.mp4"
  videoWebmSrc="/videos/hero-bg.webm"  // 可选
  posterSrc="/images/hero/hero-poster.jpg"
/>
```

不传 `videoSrc` / `posterSrc` 时，Hero 仍使用原来的背景图 + 4 帧轮播。
