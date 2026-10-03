(() => {
  const scenes = {
    design: {
      loop: 12,
      steps: [
        [0, 2, "สำรวจที่ดิน"],
        [2, 4, "แบบแปลน"],
        [4, 6.2, "ภาพ 3D"],
        [6.2, 8.2, "วางงบประมาณ"],
        [8.2, 10.2, "แบบขออนุญาต"],
        [10.2, 12, "ปรับจนตรงใจ"],
      ],
    },
    build: {
      loop: 12,
      steps: [
        [0, 2, "ฐานราก"],
        [2, 4, "โครงสร้าง"],
        [4, 6, "หลังคา"],
        [6, 8, "งานสถาปัตย์"],
        [8, 10, "ตรวจหน้างาน"],
        [10, 12, "ต้านแผ่นดินไหว"],
      ],
    },
    docs: {
      loop: 12,
      steps: [
        [0, 2, "วัสดุ SCG"],
        [2, 4, "เลือกวัสดุจริง"],
        [4, 6, "สัญญาชัดเจน"],
        [6, 8, "ขออนุญาตก่อสร้าง"],
        [8, 10, "เอกสารกู้ธนาคาร"],
        [10, 12, "งบโปร่งใส"],
      ],
    },
    care: {
      loop: 12,
      steps: [
        [0, 2, "ตรวจก่อนส่งมอบ"],
        [2, 4, "มอบกุญแจ"],
        [4, 6.2, "โครงสร้าง 5 ปี"],
        [6.2, 8.2, "หลังคา 2 ปี"],
        [8.2, 10.2, "สถาปัตย์ 1 ปี"],
        [10.2, 12, "ดูแลหลังอยู่"],
      ],
    },
  };

  const clamp = (v) => Math.min(1, Math.max(0, v));
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const inOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

  const paintScene = (svg, t, reduced) => {
    const scene = scenes[svg.dataset.scene];
    if (!scene) return;
    const loop = scene.loop;
    const time = reduced ? scene.steps[scene.steps.length - 1][0] + 0.4 : t % loop;
    const fade = reduced ? 1 : prog(time, 0, 0.25) * (1 - prog(time, loop - 0.7, loop));
    svg.style.opacity = String(fade);

    svg.querySelectorAll("[data-draw]").forEach((el) => {
      const p = reduced ? 1 : inOut(prog(time, Number(el.dataset.a), Number(el.dataset.b)));
      el.style.visibility = p > 0 ? "visible" : "hidden";
      el.style.strokeDashoffset = String(1 - p);
    });

    svg.querySelectorAll("[data-fade]").forEach((el) => {
      el.style.opacity = String(reduced ? 1 : prog(time, Number(el.dataset.a), Number(el.dataset.b)));
    });

    const step = scene.steps.find(([a, b]) => time >= a && time < b);
    const name = step ? step[2] : "";
    const cap = svg.querySelector(".iqServices__cap");
    if (cap) {
      cap.textContent = name;
      const local = step ? prog(time, step[0], step[0] + 0.28) * (1 - prog(time, step[1] - 0.28, step[1])) : 0;
      cap.setAttribute("opacity", reduced ? "1" : String(local));
    }
    const card = svg.closest(".iqServices__card");
    if (!card) return;
    card.querySelectorAll("[data-cap]").forEach((li) => {
      li.classList.toggle("is-on", !reduced && li.dataset.cap === name);
    });
  };

  const boot = () => {
    const root = document.getElementById("iqServices");
    if (!root) return;

    const panels = Array.from(root.querySelectorAll("[data-panel]"));
    const cards = panels.map((panel) => panel.querySelector("[data-card]"));
    const titles = Array.from(root.querySelectorAll("[data-title]"));
    const photos = Array.from(root.querySelectorAll("[data-photo]"));
    const dots = Array.from(root.querySelectorAll("[data-dot]"));
    const svgs = Array.from(root.querySelectorAll("[data-scene]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let active = 0;
    let timer = 0;

    const show = (idx) => {
      active = (idx + panels.length) % panels.length;
      panels.forEach((panel, i) => {
        const on = i === active;
        panel.classList.toggle("is-on", on);
        panel.setAttribute("aria-hidden", on ? "false" : "true");
      });
      titles.forEach((el, i) => el.classList.toggle("is-on", i === active));
      photos.forEach((el, i) => el.classList.toggle("is-on", i === active));
      dots.forEach((el, i) => {
        const on = i === active;
        el.classList.toggle("is-on", on);
        el.setAttribute("aria-current", on ? "true" : "false");
      });
      cards.forEach((card) => {
        if (!card) return;
        card.style.opacity = "";
        card.style.transform = "";
      });
    };

    const arm = () => {
      clearInterval(timer);
      if (reduced) return;
      timer = setInterval(() => show(active + 1), 5200);
    };

    show(0);
    arm();
    root.addEventListener("mouseenter", () => clearInterval(timer));
    root.addEventListener("mouseleave", arm);
    dots.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        show(i);
        arm();
      });
    });

    svgs.forEach((svg) => {
      svg.querySelectorAll("[data-draw]").forEach((el) => el.setAttribute("pathLength", "1"));
    });

    if (reduced) {
      svgs.forEach((svg) => paintScene(svg, 0, true));
      return;
    }

    let last = 0;
    let elapsed = 0;
    let running = false;
    const tick = (now) => {
      if (!running) return;
      if (last) elapsed += Math.min(0.05, (now - last) / 1000);
      last = now;
      svgs.forEach((svg) => paintScene(svg, elapsed, false));
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        last = 0;
        if (running) requestAnimationFrame(tick);
      },
      { threshold: 0.05 }
    );
    io.observe(root);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
