"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Play, RotateCcw, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── JS 练习题 ────────────────────────────────────────────────────────────────

const jsExercises = [
  {
    id: "promise-all",
    title: "手写 Promise.all",
    code: `// 手写 Promise.all
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;

    if (promises.length === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => {
          results[index] = value;
          count++;
          if (count === promises.length) resolve(results);
        },
        (reason) => reject(reason)
      );
    });
  });
}

// 测试
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = new Promise(resolve => setTimeout(() => resolve(3), 100));

promiseAll([p1, p2, p3]).then(results => {
  console.log("结果:", results); // [1, 2, 3]
});`,
  },
  {
    id: "debounce",
    title: "手写防抖",
    code: `// 手写防抖函数 debounce
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

// 测试
const log = debounce((msg) => console.log(msg), 300);
log("hello");
log("world"); // 只输出 "world"
setTimeout(() => log("final"), 500);`,
  },
  {
    id: "deep-clone",
    title: "手写深拷贝",
    code: `// 手写深拷贝（处理循环引用）
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (map.has(obj)) return map.get(obj);

  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);

  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], map);
  }
  return clone;
}

// 测试
const original = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
original.self = original; // 循环引用

const cloned = deepClone(original);
console.log(cloned.b.c);             // 2
console.log(cloned.d);               // [1, 2, 3]
console.log(cloned.self === cloned); // true
console.log(cloned !== original);    // true`,
  },
];

// ─── React 模板 ───────────────────────────────────────────────────────────────

const reactTemplates = [
  {
    id: "counter",
    title: "useState 计数器",
    code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: 24, textAlign: "center", fontFamily: "system-ui" }}>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>当前计数</p>
      <h2 style={{ fontSize: 64, margin: "0 0 24px", fontWeight: 700 }}>{count}</h2>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button onClick={() => setCount(c => c - 1)}
          style={{ padding: "8px 20px", borderRadius: 6, border: "1px solid #d1d5db", cursor: "pointer" }}>
          −1
        </button>
        <button onClick={() => setCount(0)}
          style={{ padding: "8px 20px", borderRadius: 6, border: "1px solid #d1d5db", cursor: "pointer" }}>
          重置
        </button>
        <button onClick={() => setCount(c => c + 1)}
          style={{ padding: "8px 20px", borderRadius: 6, border: "1px solid #3b82f6",
            background: "#3b82f6", color: "#fff", cursor: "pointer" }}>
          +1
        </button>
      </div>
    </div>
  );
}

function App() {
  return <Counter />;
}`,
  },
  {
    id: "todo",
    title: "useReducer Todo",
    code: `function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case "toggle":
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case "delete":
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

function App() {
  const [todos, dispatch] = useReducer(reducer, [
    { id: 1, text: "学习 React Hooks", done: true },
    { id: 2, text: "手写 useReducer", done: false },
  ]);
  const [input, setInput] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (!input.trim()) return;
    dispatch({ type: "add", text: input });
    setInput("");
  }

  const done = todos.filter(t => t.done).length;

  return (
    <div style={{ maxWidth: 400, margin: "24px auto", fontFamily: "system-ui", padding: "0 16px" }}>
      <h2 style={{ marginBottom: 4 }}>Todo List</h2>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>
        已完成 {done} / {todos.length}
      </p>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="新增任务..." style={{ flex: 1, padding: "8px 12px", borderRadius: 6,
            border: "1px solid #d1d5db", fontSize: 14 }} />
        <button type="submit" style={{ padding: "8px 16px", borderRadius: 6,
          background: "#3b82f6", color: "#fff", border: "none", cursor: "pointer" }}>
          添加
        </button>
      </form>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: 10,
            padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
            <input type="checkbox" checked={todo.done}
              onChange={() => dispatch({ type: "toggle", id: todo.id })} />
            <span style={{ flex: 1, textDecoration: todo.done ? "line-through" : "none",
              color: todo.done ? "#9ca3af" : "inherit" }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: "delete", id: todo.id })}
              style={{ color: "#ef4444", background: "none", border: "none",
                cursor: "pointer", fontSize: 16 }}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
  },
  {
    id: "fetch",
    title: "useEffect 数据获取",
    code: `// 自定义 Hook：封装 fetch 逻辑
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetch(url)
      .then(r => r.json())
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: err.message }); });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}

function UserCard({ userId }) {
  const { data: user, loading, error } = useFetch(
    \`https://jsonplaceholder.typicode.com/users/\${userId}\`
  );

  if (loading) return <p style={{ color: "#888" }}>加载中...</p>;
  if (error) return <p style={{ color: "#ef4444" }}>错误: {error}</p>;

  return (
    <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 12 }}>
      <p style={{ fontWeight: 600, margin: "0 0 4px" }}>{user.name}</p>
      <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>{user.email}</p>
      <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>{user.company?.name}</p>
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState(1);

  return (
    <div style={{ maxWidth: 360, margin: "24px auto", fontFamily: "system-ui", padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>用户信息</h2>
        <select value={userId} onChange={e => setUserId(Number(e.target.value))}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}>
          {[1,2,3,4,5].map(i => <option key={i} value={i}>用户 {i}</option>)}
        </select>
      </div>
      <UserCard key={userId} userId={userId} />
    </div>
  );
}`,
  },
  {
    id: "custom-hook",
    title: "自定义 Hook",
    code: `// 自定义 Hook：useLocalStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    const v = typeof newValue === "function" ? newValue(value) : newValue;
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  }, [key, value]);

  return [value, setStoredValue];
}

// 自定义 Hook：useDebounce
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function App() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const bg = theme === "dark" ? "#1f2937" : "#ffffff";
  const fg = theme === "dark" ? "#f9fafb" : "#111827";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: fg,
      padding: 24, fontFamily: "system-ui", transition: "all 0.2s" }}>
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ margin: 0 }}>自定义 Hook 演示</h2>
          <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #d1d5db",
              background: theme === "dark" ? "#374151" : "#f3f4f6", color: fg, cursor: "pointer" }}>
            {theme === "dark" ? "☀️ 亮色" : "🌙 暗色"}
          </button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 6 }}>
            主题已持久化到 localStorage（刷新不丢失）
          </p>
        </div>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="输入搜索词（防抖 400ms）..."
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, fontSize: 14,
            border: "1px solid #d1d5db", background: theme === "dark" ? "#374151" : "#f9fafb",
            color: fg, boxSizing: "border-box" }} />
        <p style={{ marginTop: 12, fontSize: 14, color: "#9ca3af" }}>
          实时值: <strong style={{ color: fg }}>{query || "（空）"}</strong>
        </p>
        <p style={{ fontSize: 14, color: "#9ca3af" }}>
          防抖值: <strong style={{ color: "#3b82f6" }}>{debouncedQuery || "（空）"}</strong>
        </p>
      </div>
    </div>
  );
}`,
  },
];

// ─── iframe 静态壳（只加载一次，代码通过 postMessage 传入）────────────────────

const REACT_IFRAME_SHELL = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    #error { color: #ef4444; background: #fef2f2; padding: 12px 16px;
      border-radius: 6px; font-family: monospace; font-size: 13px;
      white-space: pre-wrap; margin: 16px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="error" style="display:none"></div>
  <script>
    var reactRoot = null;
    var HOOK_NAMES = ['useState','useEffect','useRef','useMemo','useCallback',
                      'useReducer','createContext','useContext','useId','useTransition'];

    function runCode(code) {
      var errEl = document.getElementById('error');
      errEl.style.display = 'none';
      errEl.textContent = '';

      if (reactRoot) {
        try { reactRoot.unmount(); } catch(e) {}
        reactRoot = null;
      }
      document.getElementById('root').innerHTML = '';

      try {
        var transformed = Babel.transform(code, { presets: ['react'] }).code;

        var scope = { React: React, ReactDOM: ReactDOM };
        HOOK_NAMES.forEach(function(h) { if (React[h]) scope[h] = React[h]; });

        var keys = Object.keys(scope);
        var vals = keys.map(function(k) { return scope[k]; });

        var fn = new Function(keys.join(','), transformed + '\\nreturn typeof App !== "undefined" ? App : null;');
        var App = fn.apply(null, vals);

        var rootEl = document.getElementById('root');
        if (App) {
          reactRoot = ReactDOM.createRoot(rootEl);
          reactRoot.render(React.createElement(App));
        } else {
          rootEl.innerHTML = '<p style="padding:16px;color:#9ca3af;font-size:14px;">请定义一个 <code>App</code> 组件作为入口</p>';
        }
      } catch(e) {
        errEl.style.display = 'block';
        errEl.textContent = e.toString();
      }
    }

    window.addEventListener('error', function(e) {
      var errEl = document.getElementById('error');
      errEl.style.display = 'block';
      errEl.textContent = e.error ? e.error.toString() : e.message;
    });

    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'run') runCode(e.data.code);
    });

    // 通知父页面 iframe 已就绪
    window.parent.postMessage({ type: 'iframe-ready' }, '*');
  </script>
</body>
</html>`;

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  // JS playground
  const [activeExercise, setActiveExercise] = useState(jsExercises[0].id);
  const [jsCode, setJsCode] = useState(jsExercises[0].code);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // React playground
  const [activeTemplate, setActiveTemplate] = useState(reactTemplates[0].id);
  const [reactCode, setReactCode] = useState(reactTemplates[0].code);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeReadyRef = useRef(false);
  const reactCodeRef = useRef(reactCode);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 保持 ref 与 state 同步
  useEffect(() => { reactCodeRef.current = reactCode; }, [reactCode]);

  // 监听 iframe 就绪信号，就绪后立即发送当前代码
  useEffect(() => {
    iframeReadyRef.current = false;
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'iframe-ready') {
        iframeReadyRef.current = true;
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'run', code: reactCodeRef.current }, '*'
        );
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 代码变动后 600ms 通过 postMessage 更新预览（不重载 iframe）
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (iframeReadyRef.current) {
        iframeRef.current?.contentWindow?.postMessage({ type: 'run', code: reactCode }, '*');
      }
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [reactCode]);

  const handleExerciseChange = useCallback((id: string) => {
    setActiveExercise(id);
    const ex = jsExercises.find((e) => e.id === id);
    if (ex) { setJsCode(ex.code); setOutput([]); }
  }, []);

  const handleTemplateChange = useCallback((id: string) => {
    setActiveTemplate(id);
    const tpl = reactTemplates.find((t) => t.id === id);
    if (tpl) { setReactCode(tpl.code); }
  }, []);

  const runJsCode = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
    };
    try {
      const fn = new Function(`return (async () => { ${jsCode} })()`);
      await fn();
      await new Promise((r) => setTimeout(r, 200));
      setOutput(logs.length > 0 ? logs : ["(无输出)"]);
    } catch (err) {
      setOutput([`错误: ${err instanceof Error ? err.message : String(err)}`]);
    } finally {
      console.log = originalLog;
      setIsRunning(false);
    }
  }, [jsCode]);

  const resetJsCode = useCallback(() => {
    const ex = jsExercises.find((e) => e.id === activeExercise);
    if (ex) { setJsCode(ex.code); setOutput([]); }
  }, [activeExercise]);

  const resetReactCode = useCallback(() => {
    const tpl = reactTemplates.find((t) => t.id === activeTemplate);
    if (tpl) { setReactCode(tpl.code); }
  }, [activeTemplate]);

  const refreshPreview = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'run', code: reactCode }, '*');
  }, [reactCode]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">代码练习场</h1>
        <p className="text-muted-foreground">在线编写和运行代码，即时查看结果</p>
      </div>

      <Tabs defaultValue="js">
        <TabsList className="mb-6">
          <TabsTrigger value="js">JS 练习</TabsTrigger>
          <TabsTrigger value="react">React 预览</TabsTrigger>
        </TabsList>

        {/* ── JS 练习 ── */}
        <TabsContent value="js">
          <Tabs value={activeExercise} onValueChange={handleExerciseChange}>
            <TabsList className="mb-4">
              {jsExercises.map((ex) => (
                <TabsTrigger key={ex.id} value={ex.id}>{ex.title}</TabsTrigger>
              ))}
            </TabsList>
            {jsExercises.map((ex) => (
              <TabsContent key={ex.id} value={ex.id}>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-base">代码编辑</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={resetJsCode}>
                          <RotateCcw className="mr-1 h-3 w-3" />重置
                        </Button>
                        <Button size="sm" onClick={runJsCode} disabled={isRunning}>
                          <Play className="mr-1 h-3 w-3" />
                          {isRunning ? "运行中..." : "运行"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        value={jsCode}
                        onChange={(e) => setJsCode(e.target.value)}
                        className="min-h-[400px] w-full resize-y rounded-md border bg-muted/50 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        spellCheck={false}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">运行结果</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="min-h-[400px] rounded-md border bg-muted/50 p-4 font-mono text-sm">
                        {output.length === 0 ? (
                          <p className="text-muted-foreground">点击「运行」查看输出结果...</p>
                        ) : (
                          output.map((line, i) => (
                            <div key={i} className="py-0.5">
                              <span className="mr-2 text-muted-foreground">{">"}</span>
                              <span className={line.startsWith("错误:") ? "text-destructive" : ""}>{line}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* ── React 预览 ── */}
        <TabsContent value="react">
          <div className="mb-3 flex items-center gap-3">
            <Tabs value={activeTemplate} onValueChange={handleTemplateChange}>
              <TabsList>
                {reactTemplates.map((tpl) => (
                  <TabsTrigger key={tpl.id} value={tpl.id}>{tpl.title}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {/* 编辑器 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">JSX 编辑器</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetReactCode}>
                    <RotateCcw className="mr-1 h-3 w-3" />重置
                  </Button>
                  <Button variant="outline" size="sm" onClick={refreshPreview}>
                    <RefreshCw className="mr-1 h-3 w-3" />刷新
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <textarea
                  value={reactCode}
                  onChange={(e) => setReactCode(e.target.value)}
                  className="min-h-[500px] w-full resize-y rounded-md border bg-muted/50 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  spellCheck={false}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  代码变动后自动刷新预览 · 无需 import · 默认渲染 <code className="font-mono">App</code> 组件
                </p>
              </CardContent>
            </Card>

            {/* 预览 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">实时预览</CardTitle>
              </CardHeader>
              <CardContent>
                <iframe
                  ref={iframeRef}
                  srcDoc={REACT_IFRAME_SHELL}
                  sandbox="allow-scripts"
                  className="h-[500px] w-full rounded-md border bg-white"
                  title="React Preview"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
