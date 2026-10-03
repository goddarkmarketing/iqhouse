(function () {
  document.querySelectorAll("[data-iq-video-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dialog = document.getElementById(btn.getAttribute("data-iq-video-open"));
      if (!dialog || typeof dialog.showModal !== "function") return;
      dialog.showModal();
      var video = dialog.querySelector("video");
      if (video) video.play().catch(function () {});
    });
  });

  document.querySelectorAll(".iqVideo").forEach(function (dialog) {
    var video = dialog.querySelector("video");
    function stop() {
      if (!video) return;
      video.pause();
      video.currentTime = 0;
    }
    dialog.querySelectorAll("[data-iq-video-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        dialog.close();
      });
    });
    dialog.addEventListener("close", stop);
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
  });
})();
