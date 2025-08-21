// antiDebug.safe.ts
type AntiDebugOptions = {
  // 探测策略
  useSizeHeuristic?: boolean;   // 是否用窗口尺寸启发式（默认 true）
  useTimeHeuristic?: boolean;   // 是否用时间/断点启发式（默认 false，容易误报）
  sizeThreshold?: number;       // outer-inner 触发阈值（默认 300）
  consecutiveHits?: number;     // 连续命中多少次才触发（默认 3）
  startDelayMs?: number;        // 启动检测延迟（默认 2000ms）
  intervalMs?: number;          // 检测间隔（默认 1200ms）

  // 行为
  blockConsole?: boolean;       // 禁用 console（默认 false）
  coverPage?: boolean;          // 覆盖页面（默认 true）
  coverHtml?: string;           // 覆盖文案

  // 调试
  diagnostics?: boolean;        // 诊断模式（只打印命中信息，不锁页不死循环）
};

(function (global: any) {
  const defaultHtml = '已检测到调试工具打开，页面已锁定。';

  function installAntiDebug(opt: AntiDebugOptions = {}) {
    const cfg = {
      useSizeHeuristic: true,
      useTimeHeuristic: false,   // 关闭以减少误报
      sizeThreshold: 300,
      consecutiveHits: 3,
      startDelayMs: 2000,
      intervalMs: 1200,
      blockConsole: false,
      coverPage: true,
      coverHtml: defaultHtml,
      diagnostics: false,
      ...opt,
    };

    // —— 基础拦截（可选）——
    const onCtx = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', onCtx);

    const onKey = (e: KeyboardEvent) => {
      const k = e.key?.toLowerCase();
      if (
        k === 'f12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
        (e.ctrlKey && !e.shiftKey && k === 'u') ||
        (e.metaKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
        (e.metaKey && !e.shiftKey && k === 'u')
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener('keydown', onKey, true);

    const origConsole = { ...console };
    if (cfg.blockConsole) {
      const noop = () => {};
      try {
        (console as any).log = noop;
        (console as any).warn = noop;
        (console as any).info = noop;
        (console as any).debug = noop;
        (console as any).error = noop;
        Object.freeze(console);
      } catch {}
    }

    // —— 探测策略 —— 
    const isDevtoolsBySize = () => {
      const dx = Math.abs(window.outerWidth - window.innerWidth);
      const dy = Math.abs(window.outerHeight - window.innerHeight);
      return dx > cfg.sizeThreshold || dy > cfg.sizeThreshold;
    };

    const isDevtoolsByTime = () => {
      // 保守：不用 debugger，只用 console.time 观察小抖动
      const t = performance.now();
      for (let i = 0; i < 1e5; i++); // 小忙等，避免 0 抖动
      const cost = performance.now() - t;
      // 阈值放宽，基本不误报；你也可以关闭该策略
      return cost > 50;
    };

    const lockPage = () => {
      if (!cfg.coverPage) return;
      try {
        document.documentElement.innerHTML =
          `<div style="display:flex;align-items:center;justify-content:center;height:100vh;font:16px/1.6 system-ui,Arial;">
            <div style="text-align:center;max-width:720px">${cfg.coverHtml}</div>
          </div>`;
      } catch {}
    };

    let tripped = false;
    const trip = (reason: string) => {
      if (tripped) return;
      tripped = true;
      if (cfg.diagnostics) {
        console.warn('[anti-debug] 诊断命中：', reason, '（诊断模式不锁页）');
        return;
      }
      lockPage();

      // 只在真正触发后才进入 debugger 循环，避免平时误报
      const loop = () => {
        setTimeout(() => {
          // eslint-disable-next-line no-debugger
          debugger;
          loop();
        }, 300);
      };
      loop();
    };

    let hitCount = 0;

    const watchdog = () => {
      let hit = false;
      let reason = '';

      if (cfg.useSizeHeuristic && isDevtoolsBySize()) {
        hit = true; reason = 'size';
      } else if (cfg.useTimeHeuristic && isDevtoolsByTime()) {
        hit = true; reason = 'time';
      }

      if (hit) {
        hitCount++;
        if (cfg.diagnostics) {
          console.warn(`[anti-debug] 命中(${hitCount}/${cfg.consecutiveHits})：${reason}`);
        }
        if (hitCount >= cfg.consecutiveHits) {
          trip(`consecutive-${reason}`);
        }
      } else {
        // 一次不命中就回退计数，避免偶发抖动
        hitCount = Math.max(0, hitCount - 1);
      }
    };

    const start = () => setInterval(watchdog, cfg.intervalMs);

    // 延迟启动，避免首屏/布局过程触发
    const delayTimer = setTimeout(start, cfg.startDelayMs);

    function destroy() {
      try {
        clearTimeout(delayTimer);
        document.removeEventListener('contextmenu', onCtx);
        window.removeEventListener('keydown', onKey, true);
      } catch {}
    }

    return { destroy };
  }

  (global as any).installAntiDebug = installAntiDebug;
})(window as any);

// 立即启用（建议先开 diagnostics 观察 1 次）
(window as any).installAntiDebug?.({
  diagnostics: false,          // 第一次排查可设为 true 看看为何命中
  useSizeHeuristic: true,
  useTimeHeuristic: false,     // 容易误报，默认关
  sizeThreshold: 300,
  consecutiveHits: 3,
  startDelayMs: 2000,
  intervalMs: 1200,
  coverPage: true,
  coverHtml: '已检测到调试工具打开，页面已锁定。',
  blockConsole: false,
});
