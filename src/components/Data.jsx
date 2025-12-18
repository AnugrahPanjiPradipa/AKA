import React, { useState, useMemo } from 'react';

/** --- ALGORITMA (Tetap Sama) --- */
const maxMinIterative = (arr) => {
  if (arr.length === 0) return { max: 0, min: 0 };
  let max = arr[0],
    min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }
  return { max, min };
};

const maxMinRecursive = (arr, start, end) => {
  if (start === end) return { max: arr[start], min: arr[start] };
  if (end === start + 1) return { max: Math.max(arr[start], arr[end]), min: Math.min(arr[start], arr[end]) };
  const mid = Math.floor((start + end) / 2);
  const left = maxMinRecursive(arr, start, mid);
  const right = maxMinRecursive(arr, mid + 1, end);
  return { max: Math.max(left.max, right.max), min: Math.min(left.min, right.min) };
};

const bubbleSort = (arr) => {
  const sorted = [...arr];
  const n = sorted.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (sorted[j] > sorted[j + 1]) {
        [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return sorted;
};

const merge = (l, r) => {
  let res = [],
    i = 0,
    j = 0;
  while (i < l.length && j < r.length) {
    if (l[i] < r[j]) res.push(l[i++]);
    else res.push(r[j++]);
  }
  return res.concat(l.slice(i)).concat(r.slice(j));
};

const mergeSort = (arr) => {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
};

/** --- KOMPONEN UTAMA --- */
const Data = () => {
  const [inputData, setInputData] = useState('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // State Baru untuk Riwayat
  const [history, setHistory] = useState([]);
  const [selectedNForAverage, setSelectedNForAverage] = useState(null);

  const generateData = (n) => {
    const randoms = Array.from({ length: n }, () => Math.floor(Math.random() * 20000));
    setInputData(randoms.join(', '));
    setResults(null);
  };

  const runAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const arr = inputData
        .split(',')
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      if (arr.length === 0) {
        setLoading(false);
        return;
      }

      // Pengukuran (Sama dengan sebelumnya)
      const t0 = performance.now();
      const resMaxMinIt = maxMinIterative(arr);
      const t1 = performance.now();

      const t2 = performance.now();
      const resMaxMinRec = maxMinRecursive(arr, 0, arr.length - 1);
      const t3 = performance.now();

      const t4 = performance.now();
      bubbleSort(arr);
      const t5 = performance.now();

      const t6 = performance.now();
      const sorted = mergeSort(arr);
      const t7 = performance.now();

      const currentPerf = {
        minMax: [
          { name: 'Iteratif', time: t1 - t0, color: 'bg-blue-500' },
          { name: 'Rekursif', time: t3 - t2, color: 'bg-cyan-400' },
        ],
        sort: [
          { name: 'Bubble (Iter)', time: t5 - t4, color: 'bg-orange-500' },
          { name: 'Merge (Reku)', time: t7 - t6, color: 'bg-emerald-500' },
        ],
      };

      setResults({
        total: arr.length,
        maxMin: resMaxMinIt,
        maxMinRec: resMaxMinRec,
        sortedData: {
          smallest: sorted.slice(0, 10),
          largest: sorted.slice(-10),
        },
        perf: currentPerf,
      });

      // Simpan ke Riwayat
      setHistory((prev) => [...prev, { n: arr.length, perf: currentPerf }]);

      setLoading(false);
    }, 100);
  };

  // Mengelompokkan riwayat berdasarkan N
  const historyStats = useMemo(() => {
    const stats = {};
    history.forEach((item) => {
      if (!stats[item.n]) stats[item.n] = { count: 0, sumMinMax: [0, 0], sumSort: [0, 0] };
      stats[item.n].count += 1;
      stats[item.n].sumMinMax[0] += item.perf.minMax[0].time;
      stats[item.n].sumMinMax[1] += item.perf.minMax[1].time;
      stats[item.n].sumSort[0] += item.perf.sort[0].time;
      stats[item.n].sumSort[1] += item.perf.sort[1].time;
    });
    return stats;
  }, [history]);

  // Hitung Data Rata-rata untuk N yang dipilih
  const averageData = useMemo(() => {
    if (!selectedNForAverage || !historyStats[selectedNForAverage]) return null;
    const s = historyStats[selectedNForAverage];
    const n = s.count;
    return {
      n: selectedNForAverage,
      count: n,
      perf: {
        minMax: [
          { name: 'Iteratif (Avg)', time: s.sumMinMax[0] / n, color: 'bg-blue-600' },
          { name: 'Rekursif (Avg)', time: s.sumMinMax[1] / n, color: 'bg-cyan-500' },
        ],
        sort: [
          { name: 'Bubble (Avg)', time: s.sumSort[0] / n, color: 'bg-orange-600' },
          { name: 'Merge (Avg)', time: s.sumSort[1] / n, color: 'bg-emerald-600' },
        ],
      },
    };
  }, [selectedNForAverage, historyStats]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* SECTION 1: Header & Generator (Tetap) */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-black text-indigo-600 tracking-tighter italic">ANALISIS KOMPLEKSITAS ALGORITMA</h1>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase w-full mb-1">Generate Random Data:</span>
              {[100, 5000, 7000, 10000].map((n) => (
                <button
                  key={n}
                  onClick={() => generateData(n)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${n > 1000 ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {n.toLocaleString()} Data
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl h-24 font-mono text-[10px] focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={runAnalysis}
            disabled={loading}
            className={`mt-4 w-full font-black py-4 rounded-2xl shadow-lg transition transform active:scale-95 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {loading ? 'SEDANG MENGHITUNG...' : 'MULAI UJI PERFORMA'}
          </button>
        </section>

        {/* SECTION 2: Hasil Analisis Real-time (Tetap) */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <ChartCard
              title="Min/Max Comparison"
              subtitle="Complexity: O(N) - Linear Time"
            >
              <div className="flex items-end justify-around h-48 pt-4">
                {results.perf.minMax.map((item, idx) => (
                  <Bar
                    key={idx}
                    item={item}
                    maxTime={Math.max(...results.perf.minMax.map((i) => i.time))}
                  />
                ))}
              </div>
            </ChartCard>

            <ChartCard
              title="Sorting Comparison"
              subtitle="Iterative O(N²) vs Recursive O(N log N)"
            >
              <div className="flex items-end justify-around h-48 pt-4">
                {results.perf.sort.map((item, idx) => (
                  <Bar
                    key={idx}
                    item={item}
                    maxTime={Math.max(...results.perf.sort.map((i) => i.time))}
                  />
                ))}
              </div>
            </ChartCard>

            {/* Panel Summary Big O (Tetap) */}
            <div className="md:col-span-2 bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl border border-slate-700">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="space-y-6 flex-1">
                    <div>
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 italic">Laporan Analisis (N = {results.total.toLocaleString()} Elemen)</p>
                      <div className="flex gap-12">
                        <div>
                          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Max Value</p>
                          <p className="text-4xl font-black tracking-tight">{results.maxMin.max.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Min Value</p>
                          <p className="text-4xl font-black text-rose-500 tracking-tight">{results.maxMin.min.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                      <div>
                        <p className="text-emerald-400 text-[10px] font-bold uppercase mb-2">10 Angka Terkecil:</p>
                        <p className="font-mono text-[11px] text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800">{results.sortedData.smallest.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-emerald-400 text-[10px] font-bold uppercase mb-2">10 Angka Terbesar:</p>
                        <p className="font-mono text-[11px] text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800">{results.sortedData.largest.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 w-full md:w-80">
                    <h4 className="text-white font-bold text-sm mb-4 flex items-center justify-between">
                      📈 Performa Sorting
                      <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded italic">{(results.perf.sort[0].time / results.perf.sort[1].time).toFixed(0)}x Faster</span>
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-orange-400 text-[10px] font-bold uppercase">Bubble Sort - O(N^2)</p>
                        <p className="text-slate-400 text-[11px] leading-relaxed">Sangat lambat karena membandingkan setiap pasang angka berkali-kali.</p>
                      </div>
                      <div className="pt-3 border-t border-slate-700">
                        <p className="text-emerald-400 text-[10px] font-bold uppercase">Merge Sort - O(N log N)</p>
                        <p className="text-slate-400 text-[11px] leading-relaxed">Jauh lebih cepat karena membagi data menjadi bagian kecil.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: Tabel Riwayat & Grafik Rata-rata (Fitur Baru) */}
        <div className="grid grid-cols-1 gap-8">
          {/* Tabel Riwayat */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-black text-xl mb-4 text-slate-700 tracking-tight">📋 TABEL RIWAYAT PENGUJIAN</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">Pilih baris untuk menampilkan grafik rata-rata perbandingan</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-slate-400 uppercase text-[10px] font-black">
                    <th className="py-4 px-4">Jumlah Data (N)</th>
                    <th className="py-4 px-4">Total Run</th>
                    <th className="py-4 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(historyStats).length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-12 text-center text-slate-300 italic font-medium"
                      >
                        Belum ada data pengujian yang tersimpan.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(historyStats)
                      .sort((a, b) => a[0] - b[0])
                      .map(([n, stat]) => (
                        <tr
                          key={n}
                          className={`border-b border-slate-50 transition ${selectedNForAverage === n ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                        >
                          <td className="py-4 px-4 font-black text-indigo-600">{Number(n).toLocaleString()}</td>
                          <td className="py-4 px-4 font-mono text-slate-500 font-bold">{stat.count} kali pengujian</td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedNForAverage(n)}
                              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition transform active:scale-95 ${
                                selectedNForAverage === n ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600'
                              }`}
                            >
                              {selectedNForAverage === n ? 'Terpilih' : 'Pilih N'}
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Grafik Rata-rata (Hanya muncul jika N dipilih) */}
          {averageData && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 rounded-[2rem] shadow-xl flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase">Grafik Rata-rata (N = {Number(averageData.n).toLocaleString()})</h2>
                  <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mt-1">Berdasarkan akumulasi {averageData.count} kali percobaan sebelumnya</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ChartCard
                  title="Average Min/Max"
                  subtitle="Mean Execution Time"
                >
                  <div className="flex items-end justify-around h-48 pt-4">
                    {averageData.perf.minMax.map((item, idx) => (
                      <Bar
                        key={idx}
                        item={item}
                        maxTime={Math.max(...averageData.perf.minMax.map((i) => i.time))}
                      />
                    ))}
                  </div>
                </ChartCard>

                <ChartCard
                  title="Average Sorting"
                  subtitle="Mean Execution Time"
                >
                  <div className="flex items-end justify-around h-48 pt-4">
                    {averageData.perf.sort.map((item, idx) => (
                      <Bar
                        key={idx}
                        item={item}
                        maxTime={Math.max(...averageData.perf.sort.map((i) => i.time))}
                      />
                    ))}
                  </div>
                </ChartCard>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- KOMPONEN UI (Tetap) --- */
const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:border-indigo-100 transition">
    <h3 className="font-black text-xl tracking-tight">{title}</h3>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{subtitle}</p>
    {children}
  </div>
);

const Bar = ({ item, maxTime }) => {
  const height = maxTime > 0 ? Math.max((item.time / maxTime) * 100, 2) : 2;
  return (
    <div className="flex flex-col items-center w-full group">
      <div className="relative w-12 md:w-20 flex flex-col justify-end h-32 mb-4">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xl z-10 whitespace-nowrap">{item.time.toFixed(4)} ms</div>
        <div
          className={`${item.color} rounded-xl transition-all duration-1000 ease-out shadow-lg group-hover:brightness-110`}
          style={{ height: `${height}%` }}
        />
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase mb-1 text-center leading-tight">{item.name}</span>
      <span className="text-xs font-mono font-bold text-slate-700">{item.time.toFixed(2)}ms</span>
    </div>
  );
};

export default Data;
