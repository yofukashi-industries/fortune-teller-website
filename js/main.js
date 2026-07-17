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
  instagram: "https://instagram.com/ここを変更",   // ここを変更：InstagramのURL
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
