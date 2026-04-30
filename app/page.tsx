"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY_DATE = "yogurtBatchDate";
const STORAGE_KEY_TIME = "yogurtBatchTime";
const FERMENT_MS = 36 * 60 * 60 * 1000;
const NEXT_START_MS = 96 * 60 * 60 * 1000;

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

function formatDatetime(date: Date): string {
  const f = formatResult(date);
  return `${f.date} ${f.weekday} ${f.time}`;
}

export default function Home() {
  const [dateVal, setDateVal] = useState("");
  const [timeVal, setTimeVal] = useState("");
  const [batchDateVal, setBatchDateVal] = useState("");
  const [batchTimeVal, setBatchTimeVal] = useState("");
  const [savedBatch, setSavedBatch] = useState<{ date: string; time: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const current = toDateAndTime(new Date());
    setDateVal(current.date);
    setTimeVal(current.time);

    const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const savedTime = localStorage.getItem(STORAGE_KEY_TIME);
    if (savedDate && savedTime) {
      setBatchDateVal(savedDate);
      setBatchTimeVal(savedTime);
      setSavedBatch({ date: savedDate, time: savedTime });
    } else {
      setBatchDateVal(current.date);
      setBatchTimeVal(current.time);
    }

    setMounted(true);
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const saveBatch = () => {
    localStorage.setItem(STORAGE_KEY_DATE, batchDateVal);
    localStorage.setItem(STORAGE_KEY_TIME, batchTimeVal);
    setSavedBatch({ date: batchDateVal, time: batchTimeVal });
  };

  const resetBatch = () => {
    if (savedBatch) {
      setBatchDateVal(savedBatch.date);
      setBatchTimeVal(savedBatch.time);
    }
  };

  const isDirty =
    savedBatch === null ||
    batchDateVal !== savedBatch.date ||
    batchTimeVal !== savedBatch.time;

  const resetToNow = () => {
    const current = toDateAndTime(new Date());
    setDateVal(current.date);
    setTimeVal(current.time);
  };

  const setBatchToNow = () => {
    const current = toDateAndTime(new Date());
    setBatchDateVal(current.date);
    setBatchTimeVal(current.time);
  };

  // タイマー計算（上部カード）
  const finishDate =
    dateVal && timeVal
      ? new Date(new Date(`${dateVal}T${timeVal}`).getTime() + FERMENT_MS)
      : null;
  const result = finishDate && !isNaN(finishDate.getTime()) ? formatResult(finishDate) : null;

  // バッチ管理計算
  const batchStartTime =
    batchDateVal && batchTimeVal ? new Date(`${batchDateVal}T${batchTimeVal}`) : null;
  const validBatch = batchStartTime && !isNaN(batchStartTime.getTime());

  const batchReady = validBatch ? new Date(batchStartTime!.getTime() + FERMENT_MS) : null;
  const eatBy = validBatch ? new Date(batchStartTime!.getTime() + FERMENT_MS + 4 * 24 * 60 * 60 * 1000) : null;
  const nextStart = validBatch ? new Date(batchStartTime!.getTime() + NEXT_START_MS) : null;
  const nextReady = validBatch ? new Date(batchStartTime!.getTime() + NEXT_START_MS + FERMENT_MS) : null;

  const isReady = batchReady ? now >= batchReady : false;
  const nextStartOverdue = nextStart ? now >= nextStart : false;

  const remainingMs = batchReady && !isReady ? batchReady.getTime() - now.getTime() : 0;
  const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));

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
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md px-6 py-6 text-center mb-10">
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

      {/* バッチ管理カード */}
      {mounted && (
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-md px-6 py-6">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
            バッチ管理
          </p>

          {/* 仕込み日時入力 */}
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
              直近で仕込んだのは？
            </label>
            <button
              onClick={setBatchToNow}
              className="text-xs text-sky-500 font-medium bg-sky-50 border border-sky-200 rounded-full px-3 py-1 active:bg-sky-100"
            >
              現在時刻
            </button>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="date"
              value={batchDateVal}
              onChange={(e) => setBatchDateVal(e.target.value)}
              className="flex-1 min-w-0 text-base text-blue-900 font-medium bg-sky-50 border border-sky-200 rounded-2xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <input
              type="time"
              value={batchTimeVal}
              onChange={(e) => setBatchTimeVal(e.target.value)}
              className="w-28 min-w-0 text-base text-blue-900 font-medium bg-sky-50 border border-sky-200 rounded-2xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div className="flex gap-2 mb-5">
            <button
              onClick={saveBatch}
              disabled={!isDirty}
              className="flex-1 text-sm font-semibold bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-sky-200 disabled:text-sky-400 text-white rounded-2xl px-4 py-2 transition-colors"
            >
              保存
            </button>
            <button
              onClick={resetBatch}
              disabled={!isDirty || savedBatch === null}
              className="flex-1 text-sm font-medium border border-sky-200 text-sky-500 hover:bg-sky-50 active:bg-sky-100 disabled:text-sky-200 disabled:border-sky-100 rounded-2xl px-4 py-2 transition-colors"
            >
              リセット
            </button>
          </div>

          {/* 結果テーブル */}
          {validBatch ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm py-2 border-b border-sky-50">
                <span className="text-blue-400">完成</span>
                <span className={`font-medium ${isReady ? "text-green-600" : "text-blue-800"}`}>
                  {batchReady && formatDatetime(batchReady)}
                  {isReady ? " ✅" : ` ⏳ あと${remainingHours}h`}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-sky-50">
                <span className="text-blue-400">食べ終わる</span>
                <span className="text-blue-800 font-medium">
                  {eatBy && formatDatetime(eatBy)}
                </span>
              </div>
              <div className={`flex justify-between text-sm py-2 border-b border-sky-50`}>
                <span className={nextStartOverdue ? "text-orange-500 font-semibold" : "text-blue-400"}>
                  次の仕込み
                  {nextStartOverdue && " ⚠️"}
                </span>
                <span className={`font-medium ${nextStartOverdue ? "text-orange-600" : "text-blue-800"}`}>
                  {nextStart && formatDatetime(nextStart)}
                </span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-blue-400">次のバッチ完成</span>
                <span className="text-blue-800 font-medium">
                  {nextReady && formatDatetime(nextReady)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center text-blue-300 text-sm">日時を入力してください</p>
          )}
        </div>
      )}

      <p className="mt-10 text-xs text-blue-400">おいしくなるまで、36時間 🍶</p>
    </main>
  );
}
