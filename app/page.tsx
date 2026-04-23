"use client";

import { useState, useEffect } from "react";

function toDateAndTime(date: Date): { date: string; time: string } {
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
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
  const [dateVal, setDateVal] = useState("");
  const [timeVal, setTimeVal] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const now = toDateAndTime(new Date());
    setDateVal(now.date);
    setTimeVal(now.time);
    setMounted(true);
  }, []);

  const resetToNow = () => {
    const now = toDateAndTime(new Date());
    setDateVal(now.date);
    setTimeVal(now.time);
  };

  const finishDate =
    dateVal && timeVal
      ? new Date(new Date(`${dateVal}T${timeVal}`).getTime() + 36 * 60 * 60 * 1000)
      : null;
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
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
            いつ仕込む？
          </label>
          <button
            onClick={resetToNow}
            className="text-xs text-sky-500 font-medium bg-sky-50 border border-sky-200 rounded-full px-3 py-1 active:bg-sky-100"
          >
            現在時刻
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateVal}
            onChange={(e) => setDateVal(e.target.value)}
            className="flex-1 min-w-0 text-base text-blue-900 font-medium bg-sky-50 border border-sky-200 rounded-2xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
          <input
            type="time"
            value={timeVal}
            onChange={(e) => setTimeVal(e.target.value)}
            className="w-28 min-w-0 text-base text-blue-900 font-medium bg-sky-50 border border-sky-200 rounded-2xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
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
            <p className="text-4xl font-bold text-blue-800">{result.time}</p>
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
