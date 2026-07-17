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
     ・3枚から1枚を選ぶと、全22枚からランダムに1枚が表示されます
     ・絵柄は images/tarot/card-01.webp 〜 card-22.webp を使用します
     ・メッセージは断定を避けた、やわらかい言葉にしています
     ---------------------------------------------------------- */

  // ここを変更：カードの名前とメッセージは自由に編集できます
  var ORACLE_CARDS = [
    { name: "始まりの扉",
      message: "目の前の扉は、あなたが開けるのを待っています。準備が完璧に整う日は、実は永遠に来ないもの。ノックする勇気さえあれば、扉の向こうの光が続きを照らしてくれます。" },
    { name: "月のささやき",
      message: "月は、昼間には聞こえない小さな声を届けてくれます。今夜は考えごとに結論を出さなくて大丈夫。眠る前のやわらかな時間に浮かんだ気持ちを、そっと覚えておいてください。" },
    { name: "太陽の祝福",
      message: "あなたの頑張りは、ちゃんと見守られています。今日は隠さず、素直な笑顔でいることがいちばんの開運。太陽の下で、胸を張って過ごしてみてください。" },
    { name: "星の導き",
      message: "夜道でも、星は変わらずそこにあります。迷ったときは、遠くの大きな目標より、いま見えている一番明るい星をたよりに。方角さえ合っていれば、歩みはゆっくりで構いません。" },
    { name: "風の知らせ",
      message: "遠くから、良い知らせが風に乗って向かっているようです。連絡や誘いには、いつもより素直に応えてみてください。開けた窓の分だけ、新しい縁が入ってきます。" },
    { name: "水鏡の真実",
      message: "水面が静かになると、本当の姿が映ります。心がざわつくときほど、急いで答えを出さないこと。静けさを取り戻したとき、あなたはもう答えを知っているはずです。" },
    { name: "炎の意志",
      message: "胸の奥の小さな火が、燃える時を待っています。「本当はやりたいこと」に、今日ひとつだけ薪をくべてみてください。誰かの許可は、いりません。" },
    { name: "大地の安らぎ",
      message: "根を張る時間は、伸びる時間と同じくらい大切です。今日は焦らず、足元を整える日。よく食べて、よく眠ることも、立派な前進です。" },
    { name: "直感の鍵",
      message: "「なんとなく、こっち」という感覚は、あなたがこれまで積み重ねてきた経験の声です。理屈で説明できなくても大丈夫。最初にひらめいた方の扉に、鍵は合います。" },
    { name: "絆の糸",
      message: "大切な人との糸は、細く見えても切れていません。しばらく話していない誰かの顔が浮かんだら、それが合図。短いひと言からで、糸はまた強くなります。" },
    { name: "変容の蝶",
      message: "さなぎの中では、何も起きていないように見えて、大きな変化が進んでいます。いまの停滞は、羽を作っている時間。次にあなたが出会う自分を、楽しみにしていてください。" },
    { name: "浄化の雨",
      message: "雨は、積もったものを静かに流してくれます。抱え込んでいた気持ちをひとつ、手放してもいい日。泣くことも、深呼吸も、立派な浄化です。雨上がりの空気は、きっと軽い。" },
    { name: "守護の羽",
      message: "あなたは、思っているよりずっと守られています。挑戦するときも、休むときも、その羽はそばにあります。今日は安心して、自分の選択を信じてみてください。" },
    { name: "運命の輪",
      message: "止まっているように見えた輪が、ゆっくり回りはじめています。流れが変わる時は、少しの落ち着かなさを伴うもの。慌てず、回りはじめた方向に身をまかせてみてください。" },
    { name: "静寂の森",
      message: "森の静けさは、空っぽではなく、満ちている静けさです。今日は情報から少し離れて、自分の呼吸に耳を澄ませる時間を。答えは騒がしい場所には落ちていません。" },
    { name: "目覚めの鐘",
      message: "遠くで鐘が鳴っています。後回しにしてきたことに、もう一度光が当たる合図です。「いつかやろう」の中からひとつ選んで、今日、最初の五分だけ始めてみてください。" },
    { name: "豊穣の実り",
      message: "蒔いてきた種が、実りはじめる頃合いです。受け取ることを遠慮しないでください。感謝しながら味わうことが、次の豊かさへの種蒔きになります。" },
    { name: "再生の光",
      message: "一度沈んだものは、前よりも強い光をまとって浮かび上がります。終わったと思っていたことにも、新しい形での続きがあるようです。もう一度だけ、信じてみる価値があります。" },
    { name: "願いの種",
      message: "願いは、言葉にした瞬間から芽吹く準備を始めます。今日、叶えたいことをひとつだけ、紙に書いてみてください。小さな種ほど、静かに、確かに育ちます。" },
    { name: "癒しの杯",
      message: "空っぽの杯からは、誰にも注げません。まず、あなた自身を満たすことを許してください。好きな飲み物、好きな音楽、好きな場所。小さな一杯が、心を回復させます。" },
    { name: "聖なる境界",
      message: "優しさと、無理をすることは別のものです。今日は「ここまで」という線を、罪悪感なく引いてよい日。あなたの領域を守ることが、まわりとの良い関係を長続きさせます。" },
    { name: "祝福の虹",
      message: "雨と光の両方を知っている人にだけ、虹は架かります。ここまでの道のりが、ちゃんと報われはじめる兆し。今日目にする小さな「きれい」を、見逃さないでください。" }
  ];

  var tarotArea = document.getElementById("tarot-cards");
  var tarotResult = document.getElementById("tarot-result");
  var tarotResultName = document.getElementById("tarot-result-name");
  var tarotResultMessage = document.getElementById("tarot-result-message");
  var tarotReset = document.getElementById("tarot-reset");
  var tarotDrawn = false;

  function oracleImagePath(index) {
    var num = String(index + 1);
    if (num.length < 2) num = "0" + num;
    return "images/tarot/card-" + num + ".webp";
  }

  function resetTarot() {
    tarotDrawn = false;
    tarotResult.setAttribute("hidden", "");
    tarotArea.querySelectorAll(".tarot-card").forEach(function (card) {
      card.classList.remove("is-flipped", "is-dimmed");
      card.disabled = false;
    });
  }

  function revealCard(card, drawn) {
    card.classList.add("is-flipped");
    tarotArea.querySelectorAll(".tarot-card").forEach(function (other) {
      if (other !== card) {
        other.classList.add("is-dimmed");
        other.disabled = true;
      }
    });

    // めくり終わったころに結果を表示（動きを減らす設定では即表示）
    var delay = prefersReducedMotion ? 0 : 780;
    setTimeout(function () {
      tarotResultName.textContent = "「" + drawn.name + "」";
      tarotResultMessage.textContent = drawn.message;
      tarotResult.removeAttribute("hidden");
    }, delay);
  }

  if (tarotArea && tarotResult) {
    tarotArea.querySelectorAll(".tarot-card").forEach(function (card) {
      card.addEventListener("click", function () {
        if (tarotDrawn) return;
        tarotDrawn = true;

        var index = Math.floor(Math.random() * ORACLE_CARDS.length);
        var drawn = ORACLE_CARDS[index];
        var img = card.querySelector(".tarot-card-img");
        var src = oracleImagePath(index);
        var revealed = false;

        function go() {
          if (revealed) return;
          revealed = true;
          revealCard(card, drawn);
        }

        // 画像の読み込みを待ってからめくる（遅い回線でも最大600msで開始）
        img.addEventListener("load", go, { once: true });
        img.addEventListener("error", go, { once: true });
        img.src = src;
        setTimeout(go, 600);
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
