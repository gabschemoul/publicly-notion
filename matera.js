const form = document.getElementById("change-syndic-form");

const processForm = (e) => {
  if (e.preventDefault) e.preventDefault();

  const formData = new FormData(e.target);
  const prospect = {};
  const data = [...formData.entries()];

  data.forEach((v) => {
    prospect[v[0]] = v[1];
  });

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://api-hubspot.matera.eu/prospects", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.setRequestHeader("Accept", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4) {
      if (xhttp.status == 200) {
        const res = xhttp.responseText;
        const { result } = JSON.parse(res);
        const { demo_request_key, awin_id, owner_type, former_management } =
          result;
        window.location.replace(
          `/fr/demo-extra-details?demo_request_key=${demo_request_key}&awin_id=${awin_id}&owner_type=${
            owner_type || ""
          }&former_management=${former_management || ""}`
        );
      } else {
        document.getElementsByClassName("w-form-fail")[0].style.display =
          "block";
      }
    }
  };
  prospect.market = "fr";
  prospect.origin = "demo";
  prospect.entry_point = Cookies.get("entry_point");
  prospect.utm_term = Cookies.get("utm_term");
  prospect.utm_campaign = Cookies.get("utm_campaign");
  prospect.utm_source = Cookies.get("utm_source");
  prospect.utm_medium = Cookies.get("utm_medium");
  prospect.ad_group = Cookies.get("ad_group");

  // Referral
  const search = new URLSearchParams(window.location.search);
  if (search.has("form_data")) {
    const str = search.get("form_data").replace(/\s/g, "+");
    const attributes = JSON.parse(atob(str));
    const REFERRER_ATTRIBUTES = [
      "referrer_first_name",
      "referrer_last_name",
      "referrer_email",
      "referrer_deal_id",
      "self_referral",
    ];

    REFERRER_ATTRIBUTES.forEach((key) => {
      if (attributes[key]) prospect[key] = attributes[key];
    });
  }

  if (window.location.search) {
    const search = new URLSearchParams(window.location.search);
    const from = search.get("from");
    if (from) {
      prospect.main_type = from;
    }
  }

  xhttp.send(JSON.stringify({ prospect }));

  return false;
};

form.addEventListener("submit", processForm);

document.getElementById("email-form").addEventListener(
  "keydown",
  function (e) {
    if (
      [
        "Space",
        "Enter",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ].indexOf(e.code) > -1
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  },
  true
);
