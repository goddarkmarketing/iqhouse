(function () {
  var form = document.getElementById("iqContactForm");
  var status = document.querySelector("[data-iq-form-status]");
  if (!form || !status) return;

  var params = new URLSearchParams(window.location.search);
  if (params.get("sent") === "1") {
    status.hidden = false;
    status.className = "iqContactForm__status is-ok";
    status.textContent = "ได้รับข้อความแล้ว ทีมไอคิวเฮ้าส์จะติดต่อกลับในเวลาทำการ จันทร์–เสาร์ 08:00–17:30";
  } else if (params.get("error") === "1") {
    status.hidden = false;
    status.className = "iqContactForm__status is-err";
    status.textContent = "กรอกชื่อและเบอร์โทรให้ครบก่อนส่งอีกครั้ง";
  }

  form.addEventListener("submit", function (event) {
    var name = form.querySelector('[name="name"]');
    var phone = form.querySelector('[name="phone"]');
    var message = form.querySelector('[name="message"]');
    var fields = [name, phone, message];
    var invalid = false;

    fields.forEach(function (field) {
      field.classList.remove("is-invalid");
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        invalid = true;
      }
    });

    var digits = (phone.value || "").replace(/\D/g, "");
    if (digits.length < 9) {
      phone.classList.add("is-invalid");
      invalid = true;
    }

    if (invalid) {
      event.preventDefault();
      status.hidden = false;
      status.className = "iqContactForm__status is-err";
      status.textContent = "กรอกชื่อ เบอร์โทร และรายละเอียดให้ครบก่อนส่ง";
      status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
})();
