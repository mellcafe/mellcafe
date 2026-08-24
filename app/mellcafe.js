"use client";
import { useState } from "react";

const ALL_CAFES = [
  { id: 1, name: "FUGLEN TOKYO", area: "渋谷", hours: "8:00-22:00", rating: 4.5, tags: ["一人OK", "Wi-Fi", "テラス席"], image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80", desc: "ノルウェー発の人気カフェ。渋谷の住宅街に佇む隠れ家的空間。" },
  { id: 2, name: "Onibus Coffee", area: "中目黒", hours: "9:00-18:00", rating: 4.6, tags: ["スペシャルティ", "一人OK", "テイクアウト"], image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", desc: "目黒川沿いのスペシャルティコーヒー専門店。豆の個性を大切にした一杯。" },
  { id: 3, name: "Bear Pond Espresso", area: "下北沢", hours: "11:00-19:00", rating: 4.4, tags: ["エスプレッソ", "個性派", "少人数"], image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", desc: "NYスタイルのこだわりエスプレッソ。店主の哲学が詰まった一杯を。" },
  { id: 4, name: "Light Up Coffee", area: "吉祥寺", hours: "10:00-20:00", rating: 4.5, tags: ["スペシャルティ", "明るい", "作業OK"], image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80", desc: "コーヒーの魅力を広めるスペシャルティショップ。明るく開放的な空間。" },
  { id: 5, name: "Balaguere", area: "蔵前", hours: "9:00-18:00", rating: 4.7, tags: ["パン", "朝食", "おしゃれ"], image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80", desc: "蔵前の人気ベーカリーカフェ。焼きたてパンとコーヒーの組み合わせが絶品。" },
  { id: 6, name: "猿田彦珈琲", area: "渋谷", hours: "8:00-21:00", rating: 4.4, tags: ["ドリップ", "作業OK", "広い"], image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80", desc: "丁寧なドリップコーヒーで人気の国内チェーン。渋谷店は広くて作業しやすい。" },
  { id: 7, name: "ARISE COFFEE", area: "蔵前", hours: "10:00-18:00", rating: 4.6, tags: ["スペシャルティ", "小さい", "一人OK"], image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80", desc: "蔵前の路地裏に佇む小さなコーヒースタンド。豆へのこだわりが半端ない。" },
  { id: 8, name: "Shirouzu Coffee", area: "中目黒", hours: "9:00-19:00", rating: 4.5, tags: ["落ち着く", "デート", "テラス席"], image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80", desc: "中目黒の隠れ家カフェ。落ち着いた雰囲気でゆっくり過ごせる。" },
];

const AREAS = ["すべて", "渋谷", "中目黒", "下北沢", "吉祥寺", "蔵前"];

export default function Mellcafe() {
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [selectedArea, setSelectedArea] = useState("すべて");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [toast, setToast] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [screen, setScreen] = useState("main");

  const filtered = selectedArea === "すべて" ? ALL_CAFES : ALL_CAFES.filter(c => c.area === selectedArea);
  const current = filtered[currentIndex];
  const bookmarkedCafes = ALL_CAFES.filter(c => bookmarks.includes(c.id));
  const colors = { bg: "#fdf6ec", primary: "#c8602a", text: "#3d2008", muted: "#a07850", light: "#ecddc8", white: "#ffffff" };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) return;
    setUser({ email: loginForm.email, name: loginForm.email.split("@")[0] });
    setShowLoginPrompt(false);
    if (current && !bookmarks.includes(current.id)) {
      setBookmarks(prev => [...prev, current.id]);
      showToast("♥ ブックマークに保存しました");
    }
  };

  const swipe = (dir) => {
    if (animating || !current) return;
    if (dir === "right") {
      if (!user) { setShowLoginPrompt(true); return; }
      if (!bookmarks.includes(current.id)) {
        setBookmarks(prev => [...prev, current.id]);
        showToast("♥ ブックマークに保存しました");
      }
    }
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => { setCurrentIndex(i => i + 1); setAnimating(false); setDirection(null); setDragDelta(0); }, 320);
  };

  const removeBookmark = (id) => { setBookmarks(prev => prev.filter(b => b !== id)); showToast("ブックマークを削除しました"); };
  const handleDragStart = (e) => setDragStart(e.touches ? e.touches[0].clientX : e.clientX);
  const handleDragMove = (e) => { if (dragStart === null) return; setDragDelta((e.touches ? e.touches[0].clientX : e.clientX) - dragStart); };
  const handleDragEnd = () => { if (Math.abs(dragDelta) > 80) swipe(dragDelta > 0 ? "right" : "left"); else setDragDelta(0); setDragStart(null); };

  const cardStyle = animating
    ? { transform: `translateX(${direction === "right" ? "120%" : "-120%"}) rotate(${direction === "right" ? "15deg" : "-15deg"})`, opacity: 0, transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)" }
    : dragDelta !== 0 ? { transform: `translateX(${dragDelta}px) rotate(${dragDelta * 0.05}deg)`, transition: "none" }
    : { transform: "translateX(0)", transition: "all 0.3s" };

  const LoginPrompt = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: colors.white, borderRadius: 24, padding: 32, width: "100%", maxWidth: 360 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 8, textAlign: "center" }}>ブックマークに保存する</div>
        <div style={{ fontSize: 13, color: colors.muted, textAlign: "center", marginBottom: 24 }}>保存にはログインが必要です。<br/>ログインするとお気に入りのカフェをいつでも確認できます。</div>
        <input placeholder="メールアドレス" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${colors.light}`, fontSize: 14, marginBottom: 12, outline: "none", boxSizing: "border-box", color: colors.text }} />
        <input placeholder="パスワード" type="password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${colors.light}`, fontSize: 14, marginBottom: 16, outline: "none", boxSizing: "border-box", color: colors.text }} />
        <button onClick={handleLogin} style={{ width: "100%", padding: "14px", borderRadius: 14, background: colors.primary, color: colors.white, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>ログイン</button>
        <button onClick={() => setShowLoginPrompt(false)} style={{ width: "100%", padding: "12px", borderRadius: 14, background: colors.light, color: colors.muted, border: "none", fontSize: 14, cursor: "pointer" }}>あとで（このまま見る）</button>
      </div>
    </div>
  );

  if (screen === "bookmarks") return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => setScreen("main")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: colors.text }}>←</button>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>ブックマーク</div>
          <div style={{ marginLeft: "auto", fontSize: 13, color: colors.muted }}>{bookmarkedCafes.length}件</div>
        </div>
        {bookmarkedCafes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: colors.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>☕</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 8 }}>まだブックマークがありません</div>
            <div style={{ fontSize: 13 }}>気になるカフェを♥して保存しましょう</div>
          </div>
        ) : bookmarkedCafes.map(cafe => (
          <div key={cafe.id} style={{ background: colors.white, borderRadius: 16, marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(61,32,8,0.08)", display: "flex" }}>
            <img src={cafe.image} alt={cafe.name} style={{ width: 100, height: 100, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ padding: "12px 14px", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, color: colors.text, fontSize: 15, marginBottom: 2 }}>{cafe.name}</div>
                  <div style={{ color: colors.muted, fontSize: 12, marginBottom: 6 }}>{cafe.area} · {cafe.hours}</div>
                </div>
                <button onClick={() => removeBookmark(cafe.id)} style={{ background: "none", border: "none", cursor: "pointer", color: colors.primary, fontSize: 18, padding: 0 }}>♥</button>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {cafe.tags.slice(0, 2).map(tag => (<span key={tag} style={{ background: "#fdf0e4", color: colors.primary, fontSize: 10, padding: "2px 8px", borderRadius: 8, fontWeight: 600 }}>#{tag}</span>))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fdf6ec, #f5ede0)", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {showLoginPrompt && <LoginPrompt />}
      {toast && (<div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: colors.text, color: colors.white, padding: "10px 20px", borderRadius: 20, fontSize: 13, zIndex: 100, whiteSpace: "nowrap" }}>{toast}</div>)}
      <div style={{ width: "100%", maxWidth: 480, padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: colors.text, letterSpacing: "0.05em" }}>Mellcafe</div>
          <div style={{ fontSize: 10, color: colors.muted, letterSpacing: "0.15em" }}>TOKYO CAFÉ DISCOVERY</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => user ? setScreen("bookmarks") : setShowLoginPrompt(true)} style={{ background: bookmarks.length > 0 ? colors.primary : colors.light, border: "none", borderRadius: 20, padding: "7px 14px", cursor: "pointer", color: bookmarks.length > 0 ? colors.white : colors.muted, fontSize: 13, fontWeight: 600 }}>♥ {bookmarks.length}</button>
          {user ? (
            <button onClick={() => setUser(null)} style={{ background: "none", border: `1px solid ${colors.light}`, borderRadius: 20, padding: "7px 14px", cursor: "pointer", color: colors.muted, fontSize: 12 }}>{user.name}</button>
          ) : (
            <button onClick={() => setShowLoginPrompt(true)} style={{ background: "none", border: `1px solid ${colors.light}`, borderRadius: 20, padding: "7px 14px", cursor: "pointer", color: colors.muted, fontSize: 12 }}>ログイン</button>
          )}
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: 480, padding: "16px 20px 0", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        {AREAS.map(area => (<button key={area} onClick={() => { setSelectedArea(area); setCurrentIndex(0); }} style={{ flexShrink: 0, padding: "7px 16px", borderRadius: 20, border: "none", background: selectedArea === area ? colors.primary : colors.light, color: selectedArea === area ? colors.white : colors.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{area}</button>))}
      </div>
      <div style={{ flex: 1, width: "100%", maxWidth: 480, padding: "20px 20px 0", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        {current ? (
          <>
            {filtered[currentIndex + 1] && (<div style={{ position: "absolute", top: 28, width: "calc(100% - 40px)", height: 480, borderRadius: 24, background: colors.light, transform: "scale(0.95)", zIndex: 1, pointerEvents: "none" }} />)}
            <div style={{ ...cardStyle, width: "100%", zIndex: 2, cursor: "grab", userSelect: "none" }} onMouseDown={handleDragStart} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd} onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}>
              {dragDelta > 40 && <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, background: "#4caf50", color: colors.white, padding: "6px 14px", borderRadius: 8, fontSize: 16, fontWeight: 700, transform: "rotate(-15deg)" }}>SAVE ♥</div>}
              {dragDelta < -40 && <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10, background: "#ef5350", color: colors.white, padding: "6px 14px", borderRadius: 8, fontSize: 16, fontWeight: 700, transform: "rotate(15deg)" }}>PASS</div>}
              <div style={{ background: colors.white, borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(61,32,8,0.15)" }}>
                <div style={{ position: "relative" }}>
                  <img src={current.image} alt={current.name} style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.6))", padding: "40px 18px 14px" }}>
                    <span style={{ background: colors.primary, color: colors.white, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 10, marginBottom: 6, display: "inline-block" }}>{current.area}</span>
                    <div style={{ color: colors.white, fontSize: 20, fontWeight: 700 }}>{current.name}</div>
                  </div>
                </div>
                <div style={{ padding: "14px 18px 18px" }}>
                  <div style={{ color: "#7a4f30", fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{current.desc}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {current.tags.map(tag => (<span key={tag} style={{ background: "#fdf0e4", color: colors.primary, fontSize: 11, padding: "3px 10px", borderRadius: 10, fontWeight: 600 }}>#{tag}</span>))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ color: colors.muted, fontSize: 12 }}>🕐 {current.hours}</div>
                    <div style={{ color: colors.primary, fontSize: 13, fontWeight: 700 }}>{"★".repeat(Math.floor(current.rating))} {current.rating}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 20, position: "relative", zIndex: 3 }}>
              <button onClick={() => swipe("left")} style={{ width: 60, height: 60, borderRadius: "50%", background: colors.white, border: `2px solid ${colors.light}`, fontSize: 24, cursor: "pointer", boxShadow: "0 4px 16px rgba(61,32,8,0.1)" }}>✕</button>
              <button onClick={() => swipe("right")} style={{ width: 60, height: 60, borderRadius: "50%", background: colors.primary, border: "none", fontSize: 24, cursor: "pointer", boxShadow: "0 4px 20px rgba(200,96,42,0.35)", color: colors.white }}>♥</button>
            </div>
            <div style={{ color: "#c0a080", fontSize: 12, marginTop: 10 }}>スワイプで次のカフェへ</div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: colors.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>☕</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 8 }}>全部チェックしました！</div>
            <button onClick={() => { setSelectedArea("すべて"); setCurrentIndex(0); }} style={{ marginTop: 16, padding: "12px 28px", background: colors.primary, color: colors.white, border: "none", borderRadius: 20, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>すべて表示</button>
          </div>
        )}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
