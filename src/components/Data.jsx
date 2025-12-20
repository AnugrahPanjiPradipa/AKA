import React, { useState, useMemo } from 'react';

/** * ====================================================================
 * BAGIAN 1: ALGORITMA PENCARIAN & PENGURUTAN
 * ====================================================================
 */

/** * 1. PENCARIAN MAX & MIN (ITERATIF)
 * ---------------------------------
 * Konsep: Linear Scan.
 * Cara kerja: Kita menganggap angka pertama adalah max dan min sementara.
 * Lalu kita melakukan looping (perulangan) dari elemen ke-2 sampai akhir.
 * Setiap angka dibandingkan: jika lebih besar ganti max, jika lebih kecil ganti min.
 * * Kompleksitas Waktu: O(N) - Linear (Waktu bertambah seiring jumlah data).
 */
const maxMinIterative = (arr) => {
  if (arr.length === 0) return { max: 0, min: 0 };
  
  // Inisialisasi nilai awal
  let max = arr[0],
    min = arr[0];
  
  // Looping (Iterasi) untuk membandingkan setiap elemen
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i]; // Cek Maksimum
    if (arr[i] < min) min = arr[i]; // Cek Minimum
  }
  return { max, min };
};

/** * 2. PENCARIAN MAX & MIN (REKURSIF)
 * ---------------------------------
 * Konsep: Divide and Conquer (Bagi dan Taklukkan).
 * Cara kerja: Array dibagi menjadi dua bagian terus menerus sampai tersisa 1 atau 2 elemen.
 * - Base Case 1: Jika cuma 1 elemen, dia adalah max & min.
 * - Base Case 2: Jika 2 elemen, bandingkan keduanya.
 * - Rekursi: Gabungkan hasil dari bagian kiri dan kanan.
 * * Kompleksitas Waktu: O(N) - Tapi memakan memori Stack karena pemanggilan fungsi berulang.
 */
const maxMinRecursive = (arr, start, end) => {
  // Base Case: Hanya 1 elemen
  if (start === end) return { max: arr[start], min: arr[start] };
  
  // Base Case: Hanya 2 elemen
  if (end === start + 1) return { max: Math.max(arr[start], arr[end]), min: Math.min(arr[start], arr[end]) };
  
  // Membagi array menjadi dua (Divide)
  const mid = Math.floor((start + end) / 2);
  const left = maxMinRecursive(arr, start, mid);     // Rekursi Kiri
  const right = maxMinRecursive(arr, mid + 1, end);  // Rekursi Kanan
  
  // Menggabungkan hasil (Conquer)
  return { max: Math.max(left.max, right.max), min: Math.min(left.min, right.min) };
};

/** * 3. BUBBLE SORT (ITERATIF)
 * -------------------------
 * Konsep: Comparison Sort sederhana.
 * Cara kerja: Membandingkan elemen bersebelahan secara berulang.
 * Jika elemen kiri > kanan, tukar posisi. Ulangi sampai tidak ada yang ditukar.
 * * Kompleksitas Waktu: O(N^2) - Kuadratik (Sangat lambat untuk data besar).
 */
const bubbleSort = (arr) => {
  const sorted = [...arr]; // Copy array agar input asli tidak berubah
  const n = sorted.length;
  
  // Loop Luar: Mengontrol jumlah pass (putaran)
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    // Loop Dalam: Membandingkan pasangan elemen
    for (let j = 0; j < n - 1 - i; j++) {
      if (sorted[j] > sorted[j + 1]) {
        // Tukar posisi (Swap)
        [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
        swapped = true;
      }
    }
    // Optimasi: Jika tidak ada tukar, berarti sudah urut, berhenti.
    if (!swapped) break;
  }
  return sorted;
};

/** * 4. MERGE SORT (REKURSIF - DIGABUNG)
 * -----------------------------------
 * Konsep: Divide and Conquer.
 * Cara kerja:
 * 1. Pecah array jadi dua bagian (Recursive Call) sampai sisa 1 elemen.
 * 2. Gabungkan kembali (Merge) dua bagian tersebut sambil diurutkan.
 * * Catatan: Di sini fungsi 'merge' (penggabungan) disatukan ke dalam fungsi utama.
 * Kompleksitas Waktu: O(N log N) - Sangat efisien untuk data besar.
 */
const mergeSort = (arr) => {
  // --- BASE CASE (Kondisi Berhenti) ---
  // Jika array tinggal 1 elemen atau kosong, kembalikan array tersebut
  if (arr.length <= 1) return arr;

  // --- DIVIDE (Memecah) ---
  const mid = Math.floor(arr.length / 2);
  
  // Panggil diri sendiri untuk bagian Kiri dan Kanan
  const leftSorted = mergeSort(arr.slice(0, mid));
  const rightSorted = mergeSort(arr.slice(mid));

  // --- CONQUER / MERGE (Menggabungkan) ---
  // Logika penggabungan dua array terurut (sebelumnya ada di fungsi terpisah)
  let result = [];
  let i = 0; // Pointer untuk array kiri
  let j = 0; // Pointer untuk array kanan

  // Bandingkan elemen dari kedua array dan masukkan yang terkecil ke result
  while (i < leftSorted.length && j < rightSorted.length) {
    if (leftSorted[i] < rightSorted[j]) {
      result.push(leftSorted[i++]);
    } else {
      result.push(rightSorted[j++]);
    }
  }

  // Masukkan sisa elemen yang belum terproses (jika ada)
  return result.concat(leftSorted.slice(i)).concat(rightSorted.slice(j));
};


/** * ====================================================================
 * BAGIAN 2: KOMPONEN UTAMA REACT
 * ====================================================================
 */
const Data = () => {
  // --- STATE MANAGEMENT ---
  // Menyimpan string input dari user
  const [inputData, setInputData] = useState('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
  // Menyimpan hasil perhitungan saat ini
  const [results, setResults] = useState(null);
  // Status loading agar tombol tidak diklik berkali-kali
  const [loading, setLoading] = useState(false);

  // State untuk Riwayat & Analisis Rata-rata
  const [history, setHistory] = useState([]); // Menyimpan array objek hasil tes sebelumnya
  const [selectedNForAverage, setSelectedNForAverage] = useState(null); // Menyimpan ID/Jumlah N yang sedang dipilih user

  // --- FUNGSI GENERATOR DATA ---
  // Membuat array angka acak sebanyak 'n'
  const generateData = (n) => {
    const randoms = Array.from({ length: n }, () => Math.floor(Math.random() * 20000));
    setInputData(randoms.join(', '));
    setResults(null); // Reset hasil lama
  };

  // --- FUNGSI UTAMA: MENJALANKAN ANALISIS ---
  const runAnalysis = () => {
    setLoading(true); // Mulai loading
    
    // setTimeout digunakan agar UI sempat merender status loading sebelum proses berat dimulai
    setTimeout(() => {
      // 1. Parsing Input: Ubah string "1, 2, 3" menjadi array [1, 2, 3]
      const arr = inputData
        .split(',')
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
        
      if (arr.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Eksekusi & Pengukuran Waktu (Benchmarking)
      // performance.now() sangat presisi untuk mengukur milidetik
      
      const t0 = performance.now();
      const resMaxMinIt = maxMinIterative(arr); // Jalankan Iteratif
      const t1 = performance.now();

      const t2 = performance.now();
      const resMaxMinRec = maxMinRecursive(arr, 0, arr.length - 1); // Jalankan Rekursif
      const t3 = performance.now();

      const t4 = performance.now();
      bubbleSort(arr); // Jalankan Bubble Sort
      const t5 = performance.now();

      const t6 = performance.now();
      const sorted = mergeSort(arr); // Jalankan Merge Sort
      const t7 = performance.now();

      // 3. Menyusun Data Performa
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

      // 4. Update State Hasil
      setResults({
        total: arr.length,
        maxMin: resMaxMinIt,
        maxMinRec: resMaxMinRec,
        sortedData: {
          smallest: sorted.slice(0, 10), // Ambil 10 terkecil untuk display
          largest: sorted.slice(-10),    // Ambil 10 terbesar untuk display
        },
        perf: currentPerf,
      });

      // 5. Simpan ke Riwayat (History)
      setHistory((prev) => [...prev, { n: arr.length, perf: currentPerf }]);

      setLoading(false); // Selesai loading
    }, 100);
  };

  // --- LOGIKA MENGHITUNG RATA-RATA RIWAYAT ---
  // useMemo: Hanya dijalankan ulang jika 'history' berubah
  const historyStats = useMemo(() => {
    const stats = {};
    history.forEach((item) => {
      // Jika N belum ada di stats, buat object baru
      if (!stats[item.n]) stats[item.n] = { count: 0, sumMinMax: [0, 0], sumSort: [0, 0] };
      
      // Akumulasi waktu eksekusi
      stats[item.n].count += 1;
      stats[item.n].sumMinMax[0] += item.perf.minMax[0].time; // Iteratif Time
      stats[item.n].sumMinMax[1] += item.perf.minMax[1].time; // Rekursif Time
      stats[item.n].sumSort[0] += item.perf.sort[0].time;     // Bubble Time
      stats[item.n].sumSort[1] += item.perf.sort[1].time;     // Merge Time
    });
    return stats;
  }, [history]);

  // Menyiapkan data visual untuk grafik rata-rata berdasarkan pilihan user
  const averageData = useMemo(() => {
    if (!selectedNForAverage || !historyStats[selectedNForAverage]) return null;
    
    const s = historyStats[selectedNForAverage];
    const n = s.count; // Jumlah percobaan
    
    // Hitung rata-rata: Total Waktu / Jumlah Percobaan
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

  /** * ====================================================================
   * BAGIAN 3: USER INTERFACE (JSX)
   * ====================================================================
   */
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- SECTION 1: HEADER & INPUT --- */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-black text-indigo-600 tracking-tighter italic">ANALISIS KOMPLEKSITAS ALGORITMA</h1>
            
            {/* Tombol Quick Generate */}
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

          {/* Text Area Input */}
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl h-24 font-mono text-[10px] focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          
          {/* Tombol Run Analysis */}
          <button
            onClick={runAnalysis}
            disabled={loading}
            className={`mt-4 w-full font-black py-4 rounded-2xl shadow-lg transition transform active:scale-95 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {loading ? 'SEDANG MENGHITUNG...' : 'MULAI UJI PERFORMA'}
          </button>
        </section>

        {/* --- SECTION 2: HASIL VISUALISASI --- */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            
            {/* Panel Ringkasan Data (Hitam) */}
            <div className="md:col-span-2 bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl border border-slate-700">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  {/* Info Max Min */}
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
                    {/* Preview Data Terurut */}
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
                  
                  {/* Kartu Penjelasan Singkat Sorting */}
                  <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 w-full md:w-80">
                    <h4 className="text-white font-bold text-sm mb-4 flex items-center justify-between">
                      📊 Performa Sorting
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

            {/* Grafik Perbandingan Waktu Min/Max */}
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

            {/* Grafik Perbandingan Waktu Sorting */}
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
          </div>
        )}

        {/* --- SECTION 3: TABEL RIWAYAT & RATA-RATA --- */}
        <div className="grid grid-cols-1 gap-8">
          {/* Tabel Riwayat */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-black text-xl mb-4 text-slate-700 tracking-tight">📑 TABEL RIWAYAT PENGUJIAN</h3>
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
                      .sort((a, b) => a[0] - b[0]) // Urutkan berdasarkan N terkecil
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

          {/* Grafik Rata-rata (Conditional Rendering: Muncul jika N dipilih) */}
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

/* --- KOMPONEN UI (Hanya Tampilan) --- */

// Komponen Card pembungkus Grafik
const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:border-indigo-100 transition">
    <h3 className="font-black text-xl tracking-tight">{title}</h3>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{subtitle}</p>
    {children}
  </div>
);

// Komponen Batang Grafik
const Bar = ({ item, maxTime }) => {
  // Hitung tinggi persentase batang
  const height = maxTime > 0 ? Math.max((item.time / maxTime) * 100, 2) : 2;
  return (
    <div className="flex flex-col items-center w-full group">
      <div className="relative w-12 md:w-20 flex flex-col justify-end h-32 mb-4">
        {/* Tooltip Angka Detail */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xl z-10 whitespace-nowrap">{item.time.toFixed(4)} ms</div>
        {/* Bar Visual */}
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