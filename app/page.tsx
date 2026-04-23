"use client";

import { useState, useEffect } from "react";

function formatDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatResult(date: Date): { date: string; time: string; weekday: string } {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${date.getMonth() + 1}月${date.getDate()}日`,
    weekday: `(${weekdays[date.getDay()]})`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

export default function Home() {
  const [startTime, setStartTime] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStartTime(formatDateTimeLocal(new Date()));
    setMounted(true);
  }, []);

  const finishDate = startTime ? new Date(new Date(startTime).getTime() + 36 * 60 * 60 * 1000) : null;
  const result = finishDate && !isNaN(finishDate.getTime()) ? formatResult(finishDate) : null;

  return (
    <main className="min-h-screen bg-linear-to-b from-sky-50 to-blue-100 flex flex-col items-center justify-center px-6 py-12">
      {/* ヘッダー */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🥛</div>
        <h1 className="text-2xl font-bold text-blue-800 tracking-tight">ヨーグルトタイマー</h1>
        <p className="text-sm text-blue-500 mt-1">36時間後がいつか、すぐわかる</p>
      </div>

      {/* 入力カード */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md px-6 py-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
            いつ仕込む？
          </label>
          <button
            onClick={() => setStartTime(formatDateTimeLocal(new Date()))}
            className="text-xs text-sky-500 font-medium bg-sky-50 border border-sky-200 rounded-full px-3 py-1 active:bg-sky-100"
          >
            現在時刻
          </button>
        </div>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full min-w-0 text-base text-blue-900 font-medium bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      {/* 矢印 */}
      <div className="text-3xl text-sky-400 mb-6">↓</div>

      {/* 結果カード */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md px-6 py-6 text-center">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
          できあがりは…
        </p>
        {mounted && result ? (
          <>
            <p className="text-4xl font-bold text-blue-800">
              {result.time}
            </p>
            <p className="text-xl text-blue-600 mt-1">
              {result.date} <span className="text-blue-400">{result.weekday}</span>
            </p>
          </>
        ) : (
          <p className="text-blue-300 text-lg">──</p>
        )}
      </div>

      <p className="mt-10 text-xs text-blue-400">おいしくなるまで、36時間 🍶</p>
    </main>
  );
}
