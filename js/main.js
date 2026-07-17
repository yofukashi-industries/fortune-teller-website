/* ============================================================
   晴道望喜 公式サイト JavaScript
   ============================================================ */

/* ------------------------------------------------------------
   ここを変更：予約ページとSNSのURL設定
   ・サイト内のすべての予約ボタン・SNSリンクは、
     ここのURLでまとめて更新されます。
   ・使用していないSNSは、値を空文字 "" にすると
     サイト全体で自動的に非表示になります。
     例：tiktok: "",
   ・JavaScriptが無効な環境のために、HTML側のhrefにも
     同じURLを設定してください（README参照）。
   ------------------------------------------------------------ */
const SITE_LINKS = {
  reservation: "https://noa-fortune.stores.jp/reserve/sakae/2063769#pageContent",
  instagram: "https://www.instagram.com/haremichimochiharu",   // Instagram（設定済み）
  x: "https://x.com/ここを変更",                    // ここを変更：X（旧Twitter）のURL
  tiktok: "https://www.tiktok.com/@ここを変更",     // ここを変更：TikTokのURL
  youtube: "https://www.youtube.com/@ここを変更",   // ここを変更：YouTubeのURL
  line: "https://line.me/R/ti/p/ここを変更"         // ここを変更：LINEのURL
};

document.addEventListener("DOMContentLoaded", function () {

  /* ----------------------------------------------------------
     リンクの一括反映とSNSの表示・非表示
     ---------------------------------------------------------- */
  Object.keys(SITE_LINKS).forEach(function (key) {
    var url = SITE_LINKS[key];
    var links = document.querySelectorAll('[data-link="' + key + '"]');

    links.forEach(function (link) {
      if (url && url !== "") {
        link.setAttribute("href", url);
      }
    });

    // SNSのURLが空の場合、対応する要素（カード・フッターの項目・ボタン）を非表示にする
    if (key !== "reservation" && (!url || url === "")) {
      document.querySelectorAll('[data-sns="' + key + '"]').forEach(function (el) {
        el.classList.add("is-hidden");
        el.setAttribute("hidden", "");
      });
    }
  });

  /* ----------------------------------------------------------
     スクロール時にヘッダーの背景を少し濃くする
     ---------------------------------------------------------- */
  var header = document.getElementById("site-header");

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ----------------------------------------------------------
     スマートフォン用ハンバーガーメニュー
     ・aria-expanded の切り替え
     ・メニュー表示中は背景スクロールを止める
     ・Escキーで閉じる
     ---------------------------------------------------------- */
  var menuToggle = document.getElementById("menu-toggle");
  var globalNav = document.getElementById("global-nav");

  function openMenu() {
    globalNav.classList.add("is-open");
    document.body.classList.add("nav-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "メニューを閉じる");
  }

  function closeMenu() {
    globalNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "メニューを開く");
  }

  if (menuToggle && globalNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // メニュー内のリンクを押したら閉じる
    globalNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    // Escキーで閉じ、フォーカスをボタンへ戻す
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  /* ----------------------------------------------------------
     FAQ アコーディオン
     ・aria-expanded と hidden 属性で開閉を管理
     ・ボタン要素のためキーボード（Enter / Space）で操作可能
     ---------------------------------------------------------- */
  document.querySelectorAll(".faq-question").forEach(function (button) {
    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      var panelId = button.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);
      if (!panel) return;

      button.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (expanded) {
        panel.setAttribute("hidden", "");
      } else {
        panel.removeAttribute("hidden");
      }
    });
  });

  /* ----------------------------------------------------------
     スクロール時の控えめなフェードイン
     ・「動きを減らす」設定の場合は動かさない
     ・JavaScriptが無効な場合は常に表示される（CSS側で対応）
     ---------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealTargets = document.querySelectorAll(".reveal");

  if (!prefersReducedMotion && "IntersectionObserver" in window && revealTargets.length > 0) {
    revealTargets.forEach(function (el) {
      el.classList.add("reveal-ready");
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* ----------------------------------------------------------
     ファーストビューの星と金の粒子
     ・「動きを減らす」設定の場合は生成しない
     ---------------------------------------------------------- */
  var heroBg = document.querySelector(".hero-bg");

  if (heroBg && !prefersReducedMotion) {
    // 夜空にまたたく星
    for (var i = 0; i < 42; i++) {
      var star = document.createElement("span");
      star.className = "hero-star";
      var size = 1 + Math.random() * 1.6;
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 62 + "%";
      star.style.animationDuration = (2.6 + Math.random() * 4) + "s";
      star.style.animationDelay = (Math.random() * 5) + "s";
      heroBg.appendChild(star);
    }

    // 地平線から立ちのぼる金の粒子
    for (var j = 0; j < 12; j++) {
      var p = document.createElement("span");
      p.className = "hero-particle";
      p.style.left = (8 + Math.random() * 84) + "%";
      p.style.animationDuration = (9 + Math.random() * 9) + "s";
      p.style.animationDelay = (Math.random() * 12) + "s";
      heroBg.appendChild(p);
    }
  }

  /* ----------------------------------------------------------
     スクロールで空の色が夜から夜明けへ変わる
     ・ページを下るほど、背景がわずかに暖かい色になります
     ---------------------------------------------------------- */
  function lerpColor(c1, c2, t) {
    var r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
    var g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
    var b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  // ここを変更：スクロールによる背景色の変化（上→下）
  var skyBgFrom = [250, 248, 241];      // --color-bg の開始色（夜側・冷たいアイボリー）
  var skyBgTo = [250, 242, 224];        // --color-bg の終了色（夜明け側・暖かい生成り）
  var skyAltFrom = [242, 238, 225];     // --color-bg-light の開始色
  var skyAltTo = [243, 232, 207];       // --color-bg-light の終了色

  var skyTicking = false;

  function updateSky() {
    skyTicking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    var t = Math.min(1, Math.max(0, window.scrollY / max));
    var root = document.documentElement;
    root.style.setProperty("--color-bg", lerpColor(skyBgFrom, skyBgTo, t));
    root.style.setProperty("--color-bg-light", lerpColor(skyAltFrom, skyAltTo, t));
  }

  window.addEventListener("scroll", function () {
    if (!skyTicking) {
      skyTicking = true;
      window.requestAnimationFrame(updateSky);
    }
  }, { passive: true });

  updateSky();


  /* ----------------------------------------------------------
     今日の一枚（タロット演出）
     ・3枚から1枚を選ぶと、大アルカナからランダムに1枚が表示されます
     ・メッセージは断定を避けた、やわらかい言葉にしています
     ---------------------------------------------------------- */

  // ここを変更：カードの名前・記号・メッセージは自由に編集できます
  var TAROT_CARDS = [
    { num: "0",    en: "The Fool",           name: "愚者",     symbol: "\u{1F332}", message: "新しい一歩を踏み出したくなる日。完璧な準備よりも、軽やかな気持ちを大切にしてみてください。" },
    { num: "I",    en: "The Magician",       name: "魔術師",   symbol: "\u2728",    message: "あなたの中に、すでに必要な力が揃っているようです。小さなことから形にしてみると流れが生まれます。" },
    { num: "II",   en: "The High Priestess", name: "女教皇",   symbol: "\u{1F319}", message: "静かに考える時間が味方になる日。答えを急がず、心の声に耳を傾けてみてください。" },
    { num: "III",  en: "The Empress",        name: "女帝",     symbol: "\u{1F33E}", message: "自分を労わることが、まわりへの優しさにつながります。今日は少しだけ自分を甘やかしても大丈夫。" },
    { num: "IV",   en: "The Emperor",        name: "皇帝",     symbol: "\u26F0",    message: "土台を整えることに向いている日。決めたことを一つ、丁寧に積み上げてみてください。" },
    { num: "V",    en: "The Hierophant",     name: "教皇",     symbol: "\u{1F54A}", message: "信頼できる人の言葉にヒントがありそうです。素直に相談してみると、心が軽くなるかもしれません。" },
    { num: "VI",   en: "The Lovers",         name: "恋人",     symbol: "\u{1F49E}", message: "心が動く方を選んでよい日。迷ったときは「どちらが自分らしいか」を基準にしてみてください。" },
    { num: "VII",  en: "The Chariot",        name: "戦車",     symbol: "\u{1F6E4}", message: "前へ進む勢いがある日。目的地を一つに絞ると、力がまっすぐに届きます。" },
    { num: "VIII", en: "Strength",           name: "力",       symbol: "\u{1F98B}", message: "強さとは、静かで穏やかなもの。焦らず、やわらかい気持ちで向き合うほど物事が動きそうです。" },
    { num: "IX",   en: "The Hermit",         name: "隠者",     symbol: "\u{1F3EE}", message: "一人の時間が心を整えてくれる日。少し立ち止まって、自分の本当の気持ちを見つめてみてください。" },
    { num: "X",    en: "Wheel of Fortune",   name: "運命の輪", symbol: "\u2638",    message: "流れが変わりはじめる気配。変化を怖がらず、来たものを受けとめてみると良さそうです。" },
    { num: "XI",   en: "Justice",            name: "正義",     symbol: "\u2696",    message: "気持ちと現実のバランスを見直すのに良い日。公平な目で状況を眺めると、答えが見えてきます。" },
    { num: "XII",  en: "The Hanged Man",     name: "吊るされた男", symbol: "\u{1F343}", message: "思い通りに進まない時こそ、視点を変えるチャンス。逆さまから眺めると、新しい発見がありそうです。" },
    { num: "XIII", en: "Death",              name: "死神",     symbol: "\u{1F98A}", message: "一つの区切りは、次のはじまりの合図。手放すことで、新しい風が入ってくる時期です。" },
    { num: "XIV",  en: "Temperance",         name: "節制",     symbol: "\u{1F4A7}", message: "ほどよいバランスが幸運の鍵。頑張りすぎず、休みすぎず、心地よいペースを探してみてください。" },
    { num: "XV",   en: "The Devil",          name: "悪魔",     symbol: "\u{1F517}", message: "つい繰り返してしまう習慣を、少しだけ見直してみると良い日。気づくだけでも大きな一歩です。" },
    { num: "XVI",  en: "The Tower",          name: "塔",       symbol: "\u26A1",    message: "予想外の出来事は、実は身軽になるきっかけかもしれません。大切なものは、ちゃんと残ります。" },
    { num: "XVII", en: "The Star",           name: "星",       symbol: "\u2B50",    message: "希望が見えてくる日。小さな願いを言葉にしてみると、進む方向がはっきりしてきます。" },
    { num: "XVIII",en: "The Moon",           name: "月",       symbol: "\u{1F315}", message: "不安の正体は、まだ見えていないだけのことが多いもの。焦らず、夜が明けるのを待つ心持ちで。" },
    { num: "XIX",  en: "The Sun",            name: "太陽",     symbol: "\u2600",    message: "素直な気持ちで過ごすほど、明るい流れが集まる日。楽しいと感じることを大切にしてください。" },
    { num: "XX",   en: "Judgement",          name: "審判",     symbol: "\u{1F3BA}", message: "一度あきらめたことに、もう一度光が当たりそう。呼ばれている気がしたら、応えてみてください。" },
    { num: "XXI",  en: "The World",          name: "世界",     symbol: "\u{1F30D}", message: "一つの物事が実を結ぶ気配。ここまでの歩みをねぎらいながら、次の景色を思い描いてみてください。" }
  ];

  var tarotArea = document.getElementById("tarot-cards");
  var tarotResult = document.getElementById("tarot-result");
  var tarotResultName = document.getElementById("tarot-result-name");
  var tarotResultMessage = document.getElementById("tarot-result-message");
  var tarotReset = document.getElementById("tarot-reset");
  var tarotDrawn = false;

  function resetTarot() {
    tarotDrawn = false;
    tarotResult.setAttribute("hidden", "");
    tarotArea.querySelectorAll(".tarot-card").forEach(function (card) {
      card.classList.remove("is-flipped", "is-dimmed");
      card.disabled = false;
    });
  }

  if (tarotArea && tarotResult) {
    tarotArea.querySelectorAll(".tarot-card").forEach(function (card) {
      card.addEventListener("click", function () {
        if (tarotDrawn) return;
        tarotDrawn = true;

        var drawn = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];

        // 表面に内容を書き込む
        card.querySelector(".tarot-card-num").textContent = drawn.num;
        card.querySelector(".tarot-card-symbol").textContent = drawn.symbol;
        card.querySelector(".tarot-card-name").textContent = drawn.name;
        card.querySelector(".tarot-card-en").textContent = drawn.en;

        // 選んだカードをめくり、他は静かに退く
        card.classList.add("is-flipped");
        tarotArea.querySelectorAll(".tarot-card").forEach(function (other) {
          if (other !== card) {
            other.classList.add("is-dimmed");
            other.disabled = true;
          }
        });

        // めくり終わったころに結果を表示（動きを減らす設定では即表示）
        var delay = prefersReducedMotion ? 0 : 650;
        setTimeout(function () {
          tarotResultName.textContent = drawn.num + "　" + drawn.name + " ─ " + drawn.en;
          tarotResultMessage.textContent = drawn.message;
          tarotResult.removeAttribute("hidden");
        }, delay);
      });
    });

    if (tarotReset) {
      tarotReset.addEventListener("click", resetTarot);
    }
  }

  /* ----------------------------------------------------------
     ページ上部へ戻るボタン
     ---------------------------------------------------------- */
  var backToTop = document.getElementById("back-to-top");

  if (backToTop) {
    function updateBackToTop() {
      if (window.scrollY > 600) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    }

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }

  /* ----------------------------------------------------------
     現在の年を自動表示（フッターのCopyright）
     ---------------------------------------------------------- */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
