"use client";

import { useState, useCallback } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultCode = `// 手写 Promise.all
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
          if (count === promises.length) {
            resolve(results);
          }
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
});
`;

const exercises = [
  {
    id: "promise-all",
    title: "手写 Promise.all",
    code: defaultCode,
  },
  {
    id: "debounce",
    title: "手写防抖函数",
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
setTimeout(() => log("final"), 500);
`,
  },
  {
    id: "deep-clone",
    title: "手写深拷贝",
    code: `// 手写深拷贝
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
console.log(cloned.b.c); // 2
console.log(cloned.d);   // [1, 2, 3]
console.log(cloned.self === cloned); // true
console.log(cloned !== original);    // true
`,
  },
];

export default function PlaygroundPage() {
  const [activeExercise, setActiveExercise] = useState(exercises[0].id);
  const [code, setCode] = useState(exercises[0].code);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleExerciseChange = useCallback((id: string) => {
    setActiveExercise(id);
    const ex = exercises.find((e) => e.id === id);
    if (ex) {
      setCode(ex.code);
      setOutput([]);
    }
  }, []);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
    };

    try {
      const asyncFn = new Function(`return (async () => { ${code} })()`)
      await asyncFn();
      // Wait a bit for async operations
      await new Promise((r) => setTimeout(r, 200));
      setOutput(logs.length > 0 ? logs : ["(无输出)"]);
    } catch (err) {
      setOutput([`错误: ${err instanceof Error ? err.message : String(err)}`]);
    } finally {
      console.log = originalLog;
      setIsRunning(false);
    }
  }, [code]);

  const resetCode = useCallback(() => {
    const ex = exercises.find((e) => e.id === activeExercise);
    if (ex) {
      setCode(ex.code);
      setOutput([]);
    }
  }, [activeExercise]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">代码练习场</h1>
        <p className="text-muted-foreground">
          选择一道手写题，编辑代码并运行查看结果
        </p>
      </div>

      <Tabs value={activeExercise} onValueChange={handleExerciseChange}>
        <TabsList className="mb-4">
          {exercises.map((ex) => (
            <TabsTrigger key={ex.id} value={ex.id}>
              {ex.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {exercises.map((ex) => (
          <TabsContent key={ex.id} value={ex.id}>
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Editor */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">代码编辑</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetCode}
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      重置
                    </Button>
                    <Button
                      size="sm"
                      onClick={runCode}
                      disabled={isRunning}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      {isRunning ? "运行中..." : "运行"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[400px] w-full resize-y rounded-md border bg-muted/50 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    spellCheck={false}
                  />
                </CardContent>
              </Card>

              {/* Output */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">运行结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px] rounded-md border bg-muted/50 p-4 font-mono text-sm">
                    {output.length === 0 ? (
                      <p className="text-muted-foreground">
                        点击「运行」查看输出结果...
                      </p>
                    ) : (
                      output.map((line, i) => (
                        <div key={i} className="py-0.5">
                          <span className="mr-2 text-muted-foreground">
                            {">"}
                          </span>
                          {line}
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
    </div>
  );
}
