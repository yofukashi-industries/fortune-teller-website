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
     今日の一枚（オラクルカード演出）
     ・3枚から1枚を選ぶと、「夜明けのオラクル」からランダムに
       1枚が表示されます
     ・絵柄はすべて金の線画（SVG）で、画像ファイルは不要です
     ・メッセージは断定を避けた、やわらかい言葉にしています
     ---------------------------------------------------------- */

  function oracleSvg(inner) {
    return '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' + inner + "</svg>";
  }

  // ここを変更：カードの名前・絵柄・メッセージは自由に編集できます
  var ORACLE_CARDS = [
    { name: "夜明け", en: "Dawn",
      svg: '<path d="M14 68 H86"/><path d="M30 68 a20 20 0 0 1 40 0"/><path d="M50 34 V24"/><path d="M31 41 l-7 -7"/><path d="M69 41 l7 -7"/><path d="M22 80 H78" opacity="0.5"/>',
      message: "長い夜のあとには、必ず空が白みはじめます。今はまだ薄暗くても、光は少しずつ近づいています。焦らず、夜明けを迎える準備を。" },
    { name: "月", en: "Moon",
      svg: '<path d="M60 16 a36 36 0 1 0 0 68 a28 28 0 1 1 0 -68 Z"/><path d="M74 30 v10 M69 35 h10" stroke-width="2"/><path d="M80 54 v6 M77 57 h6" stroke-width="1.8"/>',
      message: "月は満ちたり欠けたりしながら、いつも空にいます。気持ちの浮き沈みも、自然なめぐりの一つ。今夜は静かに休むことも、前へ進む力になります。" },
    { name: "星", en: "Star",
      svg: '<path d="M50 16 L56 44 L84 50 L56 56 L50 84 L44 56 L16 50 L44 44 Z"/><path d="M76 22 v8 M72 26 h8" stroke-width="1.8"/><path d="M24 72 v6 M21 75 h6" stroke-width="1.8"/>',
      message: "遠くで小さく光るものが、あなたの進む方向を教えてくれます。願いを一つ、言葉にしてみてください。道は思っているより、まっすぐです。" },
    { name: "風", en: "Wind",
      svg: '<path d="M14 36 C34 28 52 44 74 34 C80 31 84 26 82 22"/><path d="M14 54 C40 46 58 62 86 50"/><path d="M20 72 C38 66 52 76 70 70 C76 68 79 64 78 61"/>',
      message: "澱んでいた空気が動きはじめる気配。窓を開けるように、心にも新しい風を通してみてください。軽くなった分だけ、遠くまで行けます。" },
    { name: "道", en: "Path",
      svg: '<path d="M40 86 C58 72 30 62 48 50 C64 40 44 32 54 20"/><path d="M20 20 H88" opacity="0.5"/><circle cx="76" cy="14" r="5"/>',
      message: "曲がりくねって見える道も、振り返ればちゃんと続いています。近道を探すより、いま踏んでいる一歩を信じて。道は、歩く人のためにあります。" },
    { name: "灯", en: "Lantern",
      svg: '<path d="M38 34 H62 L58 70 H42 Z"/><path d="M44 26 H56 V34 H44 Z"/><path d="M50 70 V80 M40 80 H60"/><path d="M50 44 C46 50 46 56 50 58 C54 56 54 50 50 44 Z" stroke-width="2"/><path d="M28 48 l-8 -3 M72 48 l8 -3" opacity="0.6"/>',
      message: "大きな光でなくても、足元を照らすには十分です。あなたの中の小さな灯を、消さないように。誰かの帰り道を照らすこともあります。" },
    { name: "海", en: "Sea",
      svg: '<path d="M14 46 C24 38 34 38 44 46 C54 54 64 54 74 46 C80 41 84 40 86 41"/><path d="M14 64 C24 56 34 56 44 64 C54 72 64 72 74 64 C80 59 84 58 86 59"/><circle cx="72" cy="22" r="6"/>',
      message: "寄せては返す波のように、物事には満ちる時と引く時があります。今日は流れに逆らわず、大きなリズムに身をゆだねてみてください。" },
    { name: "山", en: "Mountain",
      svg: '<path d="M12 76 L38 34 L50 54 L64 28 L88 76 Z"/><path d="M33 42 L38 48 L43 42" stroke-width="2"/><circle cx="22" cy="24" r="5" opacity="0.7"/>',
      message: "頂上は、まだ遠くに見えるかもしれません。それでも、登った分の景色は確かに変わっています。今日は歩幅を小さく、着実に。" },
    { name: "花", en: "Blossom",
      svg: '<circle cx="50" cy="44" r="6"/><ellipse cx="50" cy="27" rx="6.5" ry="11"/><ellipse cx="50" cy="27" rx="6.5" ry="11" transform="rotate(72 50 44)"/><ellipse cx="50" cy="27" rx="6.5" ry="11" transform="rotate(144 50 44)"/><ellipse cx="50" cy="27" rx="6.5" ry="11" transform="rotate(216 50 44)"/><ellipse cx="50" cy="27" rx="6.5" ry="11" transform="rotate(288 50 44)"/><path d="M50 62 V88"/><path d="M50 76 C57 70 62 70 66 73" stroke-width="2"/>',
      message: "つぼみの時間が長いほど、花はゆっくり丁寧に開きます。今日うまく咲けなくても大丈夫。あなたの季節は、ちゃんと巡ってきます。" },
    { name: "鳥", en: "Bird",
      svg: '<path d="M18 50 C30 38 40 38 46 48 C52 38 62 38 74 50"/><path d="M60 66 C66 60 71 60 74 65 C77 60 82 60 86 66" stroke-width="2" opacity="0.7"/><path d="M20 74 H44" opacity="0.4"/>',
      message: "鳥は、飛び立つ前に一度だけ身を低くします。いまの助走は、飛ぶための時間。風向きが変わったら、迷わず翼をひろげて。" },
    { name: "雨", en: "Rain",
      svg: '<path d="M30 44 a12 12 0 0 1 4 -23 a16 16 0 0 1 31 0 a11 11 0 0 1 3 23 Z"/><path d="M36 56 l-5 12 M52 56 l-5 12 M68 56 l-5 12" stroke-width="2"/><path d="M28 82 C34 78 40 78 46 82" stroke-width="2" opacity="0.6"/>',
      message: "雨の日は、種が水を蓄える日。予定どおりに進まない時間も、あとで芽を出すための準備です。今日は無理をせず、静かに過ごして。" },
    { name: "橋", en: "Bridge",
      svg: '<path d="M12 68 C30 40 70 40 88 68"/><path d="M26 68 V56 M42 68 V48 M58 68 V48 M74 68 V56" stroke-width="2"/><path d="M12 80 C30 74 70 74 88 80" opacity="0.5"/>',
      message: "向こう岸は、渡ってみないと分からないもの。けれど橋は、渡る人のために架かっています。最初の一歩を置く場所は、もう見えているはず。" },
    { name: "鍵", en: "Key",
      svg: '<circle cx="34" cy="38" r="14"/><circle cx="34" cy="38" r="5" opacity="0.6"/><path d="M44 48 L74 78 M64 68 l8 -8 M70 74 l8 -8" stroke-width="2.6"/>',
      message: "探していた答えは、案外ポケットの中にあります。特別な何かを手に入れるより、すでに持っているものを使ってみる日。扉は、内側からも開きます。" },
    { name: "芽", en: "Sprout",
      svg: '<path d="M50 84 V52"/><path d="M50 58 C50 44 38 38 28 40 C30 52 40 58 50 58 Z"/><path d="M50 52 C50 40 60 34 70 36 C68 48 58 52 50 52 Z"/><path d="M30 84 H70"/>',
      message: "土の中の変化は、外からは見えません。結果が見えない時間こそ、根が深く伸びている時間です。信じて、水をやり続けてください。" },
    { name: "羽", en: "Feather",
      svg: '<path d="M62 16 C40 26 28 48 26 76"/><path d="M62 16 C66 40 56 64 30 72" /><path d="M58 26 L44 32 M60 36 L42 44 M58 46 L38 56 M54 56 L34 66" stroke-width="1.8" opacity="0.8"/><path d="M26 76 L20 86" stroke-width="2"/>',
      message: "背負っているものを、ひとつ降ろしてもいい日。軽くなることは、怠けることではありません。羽のように軽い心が、いちばん遠くまで運ばれます。" },
    { name: "鈴", en: "Bell",
      svg: '<circle cx="50" cy="52" r="22"/><path d="M40 58 Q50 64 60 58" stroke-width="2"/><circle cx="50" cy="52" r="3" fill="currentColor" stroke="none" opacity="0.9"/><path d="M50 30 V18 M42 18 H58" stroke-width="2"/><path d="M22 44 l-6 -4 M78 44 l6 -4" opacity="0.6" stroke-width="1.8"/>',
      message: "澄んだ音は、遠くまでまっすぐ届きます。今日は飾らない、素直な言葉がいちばん響く日。伝えたかったこと、ひとつ声にしてみてください。" },
    { name: "舟", en: "Boat",
      svg: '<path d="M20 62 L80 62 L68 76 H32 Z"/><path d="M50 62 V22 M50 24 C62 28 68 38 66 48 L50 48"/><path d="M14 84 C24 78 34 78 44 84 C54 90 64 90 74 84" stroke-width="2" opacity="0.6"/>',
      message: "岸から離れる瞬間がいちばん勇気のいるもの。でも帆を張れば、あとは風が手伝ってくれます。荷物は少なめに、身軽に出発を。" },
    { name: "光", en: "Light",
      svg: '<circle cx="50" cy="50" r="13"/><path d="M50 26 V14 M50 86 V74 M26 50 H14 M86 50 H74 M32 32 l-8 -8 M68 32 l8 -8 M32 68 l-8 8 M68 68 l8 8" stroke-width="2"/>',
      message: "あなたが思っているより、あなたはまわりを照らしています。今日は自分の良いところを、一つだけ認めてあげてください。光は、そこから広がります。" }
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

        var drawn = ORACLE_CARDS[Math.floor(Math.random() * ORACLE_CARDS.length)];

        // 表面に絵柄と名前を書き込む
        card.querySelector(".tarot-card-art").innerHTML = oracleSvg(drawn.svg);
        card.querySelector(".tarot-card-name").textContent = drawn.name;
        card.querySelector(".tarot-card-en").textContent = drawn.en;

        // 選んだカードをめくり、他は静かに伏せる
        card.classList.add("is-flipped");
        tarotArea.querySelectorAll(".tarot-card").forEach(function (other) {
          if (other !== card) {
            other.classList.add("is-dimmed");
            other.disabled = true;
          }
        });

        // めくり終わったころに結果を表示（動きを減らす設定では即表示）
        var delay = prefersReducedMotion ? 0 : 750;
        setTimeout(function () {
          tarotResultName.textContent = "「" + drawn.name + "」 ─ " + drawn.en;
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
