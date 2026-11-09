const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}



/* =========================
  Pricing Calculator 
========================= */

const tierDropdown = document.querySelector("#tierDropdown");
const tierDropdownLabel = document.querySelector("#tierDropdownLabel");
const tierDropdownItems = document.querySelectorAll(".tier-dropdown-item");

const pricingAddonInputs = document.querySelectorAll(
  ".addon-dropdown-item input",
);
const addonsCount = document.querySelector("#addonsCount");

const maintenanceDropdown = document.querySelector("#maintenanceDropdown");
const maintenanceDropdownLabel = document.querySelector(
  "#maintenanceDropdownLabel",
);
const maintenanceDropdownItems = document.querySelectorAll(
  ".maintenance-dropdown-item",
);

const hostingToggle = document.querySelector("#hostingToggle");
const hostingToggleLabel = document.querySelector("#hostingToggleLabel");
const estimateTotal = document.querySelector("#estimateTotal");
const estimateRange = document.querySelector("#estimateRange");
const summaryBase = document.querySelector("#summaryBase");
const summaryAddons = document.querySelector("#summaryAddons");
const summaryMaintenance = document.querySelector("#summaryMaintenance");
const summaryHosting = document.querySelector("#summaryHosting");
const summaryVAT = document.querySelector("#summaryVAT");
const estimateBreakdown = document.querySelector("#estimateBreakdown");
const requestEstimateBtn = document.querySelector(".request-estimate-btn");

let selectedPricingTier = "t1";
let selectedMaintenanceMonths = 0;
let selectedHosting = "none";

const addonInfoButtons = document.querySelectorAll(".addon-info-btn");
const addonInfoModal = document.querySelector("#addonInfoModal");
const addonInfoTitle = document.querySelector("#addonInfoTitle");
const addonInfoDescription = document.querySelector("#addonInfoDescription");
const addonInfoVideoWrap = document.querySelector("#addonInfoVideoWrap");
const addonInfoVideo = document.querySelector("#addonInfoVideo");
const addonInfoVideoSource = document.querySelector("#addonInfoVideoSource");
const addonInfoTextWrap = document.querySelector("#addonInfoTextWrap");
const addonInfoTextList = document.querySelector("#addonInfoTextList");
const closeAddonModalButtons = document.querySelectorAll(
  "[data-close-addon-modal]",
);

const VAT_RATE = 0.16;
const HOSTING_RATE = 0.05;
const MAINTENANCE_MONTHLY_RATE = 0.1;

const addonInfoData = {
  authentication: {
    title: "Authentication",
    description:
      "Adds user accounts, login, logout, password reset, and protected pages for your platform.",
    type: "video",
    video: "assets/videos/addons/Authentication.mp4",
  },

  rbac: {
    title: "Role-Based Access Control",
    description:
      "Controls what each user can see or manage based on their role, such as admin, employee, or client.",
    type: "video",
    video: "assets/videos/addons/Role-based Access Control.mp4",
  },

  payment: {
    title: "Payment Integration",
    description:
      "Connects your website or platform with online payment systems for checkout, subscriptions, or invoices.",
    type: "video",
    video: "assets/videos/addons/Payment.mp4",
  },

  aiChatbot: {
    title: "AI Chatbot / Assistant",
    description:
      "Adds an AI assistant that can answer questions, guide users, or support customer interactions.",
    type: "video",
    video: "assets/videos/addons/AI Chatbot.mp4",
  },

  aiDocs: {
    title: "AI Document Processing",
    description:
      "Uses AI to read uploaded documents and extract useful information from files such as PDFs, invoices, or forms.",
    type: "text",
    details: [
      "Upload PDF, image, invoice, form, or document files.",
      "AI can extract important fields such as names, dates, totals, or reference numbers.",
      "Useful for admin systems, finance tools, client portals, and workflow automation.",
      "Final setup depends on the document type and how accurate the extraction needs to be.",
    ],
  },

  api: {
    title: "Third-Party API Integration",
    description:
      "Connects your system with external platforms or services so data can move between tools.",
    type: "text",
    details: [
      "Connect with tools like Google Maps, WhatsApp, Stripe, Twilio, SendGrid, CRM systems, or shipping platforms.",
      "Send or receive data automatically between your website and another service.",
      "Useful for automation, notifications, payments, maps, booking systems, and external dashboards.",
      "Final pricing depends on the API complexity and documentation quality.",
    ],
  },

  admin: {
    title: "Admin Dashboard",
    description:
      "Adds a private control panel where admins can manage content, users, orders, products, or reports.",
    type: "video",
    video: "assets/videos/addons/admin dashboard.mp4",
  },

  realtime: {
    title: "Real-Time Features",
    description:
      "Adds instant updates without refreshing the page, such as live notifications, chat, or status changes.",
    type: "video",
    video: "assets/videos/addons/real time features.mp4",
  },

  rtl: {
    title: "Multi-Language / RTL Support",
    description:
      "Prepares your website or platform for more than one language, including Arabic right-to-left layout.",
    type: "video",
    video: "assets/videos/addons/multi-language.mp4",
  },

  ecommerce: {
    title: "E-Commerce Functionality",
    description:
      "Adds online store features such as products, cart, checkout flow, orders, and product management.",
    type: "video",
    video: "assets/videos/addons/E-Commerce Functionality.mp4",
  },

  search: {
    title: "Search & Filtering",
    description:
      "Adds search and filters so users can find products, records, orders, or content faster.",
    type: "video",
    video: "assets/videos/addons/Search & Filtering.mp4",
  },

  upload: {
    title: "File Upload & Management",
    description:
      "Allows users or admins to upload, preview, store, and manage files such as images, PDFs, or documents.",
    type: "video",
    video: "assets/videos/addons/File Upload & Management.mp4",
  },

  email: {
    title: "Email Automation",
    description:
      "Sends automatic emails for actions like order confirmation, account updates, contact forms, or status changes.",
    type: "video",
    video: "assets/videos/addons/Email Automation.mp4",
  },

  analytics: {
    title: "Reporting & Analytics",
    description:
      "Adds dashboards, charts, and reports to help track sales, users, activity, performance, or business metrics.",
    type: "video",
    video: "assets/videos/addons/Reporting & Analytics.mp4",
  },

  multiTenancy: {
    title: "Multi-Tenancy",
    description:
      "Allows one platform to support multiple companies or organizations while keeping each one’s data separate.",
    type: "video",
    video: "assets/videos/addons/Multi-Tenancy.mp4",
  },

  mobile: {
    title: "Mobile App",
    description:
      "Adds a mobile app experience connected to your website or platform for users, clients, or internal teams.",
    type: "video",
    video: "assets/videos/addons/Mobile App.mp4",
  },

  devops: {
    title: "DevOps & CI/CD Setup",
    description:
      "Prepares the project for cleaner deployment, safer updates, and better development workflow.",
    type: "text",
    details: [
      "Organized deployment setup for production.",
      "Environment variables setup for sensitive project settings.",
      "GitHub-based workflow for managing code updates.",
      "Basic deployment pipeline when needed.",
      "Helps make future updates cleaner and safer.",
    ],
  },

  security: {
    title: "2FA / Security Hardening",
    description:
      "Adds extra protection such as verification codes, login attempt limits, stronger sessions, and security safeguards.",
    type: "video",
    video: "assets/videos/addons/2FA  Security Hardening.mp4",
  },

  seo: {
    title: "SEO Optimization",
    description:
      "Improves your website structure so search engines can better understand your pages and content.",
    type: "text",
    details: [
      "SEO-friendly page titles and meta descriptions.",
      "Clean heading structure using H1, H2, and H3 correctly.",
      "Image alt text for important images.",
      "Basic sitemap and robots.txt setup.",
      "Better page structure and speed practices.",
      "This improves SEO readiness, but does not guarantee first-page ranking.",
    ],
  },

  domain: {
    title: "Custom Domain & DNS Setup",
    description:
      "Connects your website to a professional domain name and prepares it to work correctly online.",
    type: "text",
    details: [
      "Connect domain to the website hosting.",
      "Set up DNS records correctly.",
      "Prepare SSL / HTTPS when available.",
      "Domain forwarding if needed.",
      "Basic guidance for domain-related records.",
      "Final live domain testing.",
    ],
  },

  hosting: {
    title: "Managed Hosting Setup",
    description:
      "Managed hosting setup helps prepare your website or platform to go live on a reliable hosting environment.",
    type: "text",
    details: [
      "Connect the project to a hosting platform.",
      "Prepare the live production environment.",
      "Set up basic deployment configuration.",
      "Connect hosting with the selected domain when needed.",
      "Help make the website accessible online.",
      "Hosting provider fees are not included unless agreed separately.",
    ],
  },
};

const pricingTiers = {
  t1: {
    code: "T1",
    name: "Landing Page / Marketing Site",
    price: 50,
  },
  t2: {
    code: "T2",
    name: "Business Website + Admin Panel",
    price: 100,
  },
  t3: {
    code: "T3",
    name: "Custom Web Application / MVP",
    price: 150,
  },
  t4: {
    code: "T4",
    name: "SaaS Platform",
    price: 200,
  },
  t5: {
    code: "T5",
    name: "ERP / CRM / Enterprise System",
    price: 250,
  },
  t6: {
    code: "T6",
    name: "AI-Powered Platform / Automation System",
    price: 250,
  },
};

const pricingAddons = {
  authentication: { name: "Authentication", price: 50 },
  rbac: { name: "Role-Based Access Control", price: 100 },
  payment: { name: "Payment Integration", price: 100 },
  aiChatbot: { name: "AI Chatbot / Assistant", price: 100 },
  aiDocs: { name: "AI Document Processing", price: 150 },
  api: { name: "Third-Party API Integration", price: 75 },
  admin: { name: "Admin Dashboard", price: 100 },
  realtime: { name: "Real-Time Features", price: 75 },
  rtl: { name: "Multi-Language / RTL Support", price: 100 },
  ecommerce: { name: "E-Commerce Functionality", price: 50 },
  search: { name: "Search & Filtering", price: 50 },
  upload: { name: "File Upload & Management", price: 50 },
  email: { name: "Email Automation", price: 50 },
  analytics: { name: "Reporting & Analytics", price: 50 },
  multiTenancy: { name: "Multi-Tenancy", price: 150 },
  mobile: { name: "Mobile App", price: 100 },
  devops: { name: "DevOps & CI/CD Setup", price: 50 },
  security: { name: "2FA / Security Hardening", price: 50 },
  seo: { name: "SEO Optimization", price: 25 },
  domain: { name: "Custom Domain & DNS Setup", price: 25 },
};

function openAddonInfoModal(addonKey) {
  const addon = addonInfoData[addonKey];

  if (
    !addon ||
    !addonInfoModal ||
    !addonInfoTitle ||
    !addonInfoDescription ||
    !addonInfoVideoWrap ||
    !addonInfoVideo ||
    !addonInfoVideoSource ||
    !addonInfoTextWrap ||
    !addonInfoTextList
  ) {
    return;
  }

  addonInfoTitle.textContent = addon.title;
  addonInfoDescription.textContent = addon.description;

  addonInfoVideo.pause();
  addonInfoVideoSource.src = "";
  addonInfoVideo.load();

  addonInfoTextList.innerHTML = "";

  if (addon.type === "video") {
    addonInfoVideoWrap.style.display = "block";
    addonInfoTextWrap.style.display = "none";

    addonInfoVideoSource.src = addon.video;
    addonInfoVideo.load();
  } else {
    addonInfoVideoWrap.style.display = "none";
    addonInfoTextWrap.style.display = "block";

    addon.details.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      addonInfoTextList.appendChild(li);
    });
  }

  addonInfoModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeAddonInfoModal() {
  if (!addonInfoModal) return;

  addonInfoModal.classList.remove("active");
  document.body.style.overflow = "";

  if (addonInfoVideo && addonInfoVideoSource) {
    addonInfoVideo.pause();
    addonInfoVideoSource.src = "";
    addonInfoVideo.load();
  }
}

addonInfoButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const addonKey = button.dataset.addonInfo;
    openAddonInfoModal(addonKey);
  });
});

const hostingInfoButton = document.querySelector(".hosting-info-btn");

if (hostingInfoButton) {
  hostingInfoButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    openAddonInfoModal("hosting");
  });
}

closeAddonModalButtons.forEach((button) => {
  button.addEventListener("click", closeAddonInfoModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAddonInfoModal();
  }
});

function formatJOD(amount) {
  const fixedAmount = Number(amount.toFixed(2));

  if (Number.isInteger(fixedAmount)) {
    return `${fixedAmount.toLocaleString()} JOD`;
  }

  return `${fixedAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} JOD`;
}

function getSelectedTier() {
  return pricingTiers[selectedPricingTier] || pricingTiers.t1;
}

function getSelectedPricingAddons() {
  const selectedAddons = [];

  pricingAddonInputs.forEach((input) => {
    if (input.checked && pricingAddons[input.value]) {
      selectedAddons.push({
        key: input.value,
        name: pricingAddons[input.value].name,
        price: pricingAddons[input.value].price,
      });
    }
  });

  return selectedAddons;
}

function calculateEstimate() {
  const tier = getSelectedTier();
  const selectedAddons = getSelectedPricingAddons();

  const basePrice = tier.price;

  const addonsTotal = selectedAddons.reduce((total, addon) => {
    return total + addon.price;
  }, 0);

  const projectSubtotal = basePrice + addonsTotal;

  const maintenanceMonthly =
    selectedMaintenanceMonths > 0
      ? projectSubtotal * MAINTENANCE_MONTHLY_RATE
      : 0;

  const maintenanceTotal =
    selectedMaintenanceMonths > 0
      ? maintenanceMonthly * selectedMaintenanceMonths
      : 0;

  const hostingFee =
    selectedHosting === "managed" ? projectSubtotal * HOSTING_RATE : 0;

  const subtotalBeforeVAT = projectSubtotal + maintenanceTotal + hostingFee;

  const vatAmount = subtotalBeforeVAT * VAT_RATE;

  const total = subtotalBeforeVAT + vatAmount;

  const lowRange = total * 0.9;
  const highRange = total * 1.15;

  return {
    tier,
    selectedAddons,
    basePrice,
    addonsTotal,
    projectSubtotal,
    selectedMaintenanceMonths,
    maintenanceMonthly,
    maintenanceTotal,
    selectedHosting,
    hostingFee,
    vatAmount,
    total,
    lowRange,
    highRange,
  };
}

function updateEstimateUI() {
  if (
    !estimateTotal ||
    !estimateRange ||
    !summaryBase ||
    !summaryAddons ||
    !summaryMaintenance ||
    !summaryHosting ||
    !summaryVAT ||
    !estimateBreakdown
  ) {
    return;
  }

  const estimate = calculateEstimate();

  estimateTotal.textContent = formatJOD(estimate.total);

  estimateRange.textContent = `Estimated range: ${formatJOD(
    estimate.lowRange,
  )}–${formatJOD(estimate.highRange)}`;

  summaryBase.textContent = formatJOD(estimate.basePrice);
  summaryAddons.textContent = formatJOD(estimate.addonsTotal);

  summaryMaintenance.textContent =
    selectedMaintenanceMonths > 0
      ? `${formatJOD(estimate.maintenanceMonthly)} / month × ${selectedMaintenanceMonths} months`
      : "Not selected";

  summaryHosting.textContent =
    selectedHosting === "managed"
      ? formatJOD(estimate.hostingFee)
      : "Not selected";

  summaryVAT.textContent = formatJOD(estimate.vatAmount);

  if (addonsCount) {
    const count = estimate.selectedAddons.length;
    addonsCount.textContent = count === 1 ? "1 selected" : `${count} selected`;
  }

  estimateBreakdown.innerHTML = "";

  const baseItem = document.createElement("p");
  baseItem.innerHTML = `
    <span>${estimate.tier.code} - ${estimate.tier.name}</span>
    <strong>${formatJOD(estimate.basePrice)}</strong>
  `;
  estimateBreakdown.appendChild(baseItem);

  if (estimate.selectedAddons.length > 0) {
    estimate.selectedAddons.forEach((addon) => {
      const addonItem = document.createElement("p");
      addonItem.innerHTML = `
        <span>${addon.name}</span>
        <strong>+${formatJOD(addon.price)}</strong>
      `;
      estimateBreakdown.appendChild(addonItem);
    });
  } else {
    const emptyItem = document.createElement("p");
    emptyItem.innerHTML = `
      <span>No add-ons selected</span>
      <strong>0 JOD</strong>
    `;
    estimateBreakdown.appendChild(emptyItem);
  }

  if (selectedMaintenanceMonths > 0) {
    const maintenanceItem = document.createElement("p");
    maintenanceItem.innerHTML = `
      <span>Maintenance ${selectedMaintenanceMonths} months</span>
      <strong>${formatJOD(estimate.maintenanceTotal)}</strong>
    `;
    estimateBreakdown.appendChild(maintenanceItem);
  }

  if (selectedHosting === "managed") {
    const hostingItem = document.createElement("p");
    hostingItem.innerHTML = `
      <span>Managed hosting 5%</span>
      <strong>${formatJOD(estimate.hostingFee)}</strong>
    `;
    estimateBreakdown.appendChild(hostingItem);
  }

  const vatItem = document.createElement("p");
  vatItem.innerHTML = `
    <span>VAT 16%</span>
    <strong>${formatJOD(estimate.vatAmount)}</strong>
  `;
  estimateBreakdown.appendChild(vatItem);
}

/* Tier dropdown */
tierDropdownItems.forEach((item) => {
  item.addEventListener("click", () => {
    const tierKey = item.dataset.tier;

    if (!pricingTiers[tierKey]) return;

    selectedPricingTier = tierKey;

    tierDropdownItems.forEach((button) => {
      button.classList.remove("active");
    });

    item.classList.add("active");

    if (tierDropdownLabel) {
      tierDropdownLabel.textContent = `${pricingTiers[tierKey].code} — ${pricingTiers[tierKey].name}`;
    }

    const summaryPrice = tierDropdown?.querySelector("summary strong");

    if (summaryPrice) {
      summaryPrice.textContent = formatJOD(pricingTiers[tierKey].price);
    }

    if (tierDropdown) {
      tierDropdown.removeAttribute("open");
    }

    updateEstimateUI();
  });
});

/* Add-ons dropdown */
pricingAddonInputs.forEach((input) => {
  input.addEventListener("change", updateEstimateUI);
});

/* Maintenance dropdown */
maintenanceDropdownItems.forEach((item) => {
  item.addEventListener("click", () => {
    const months = Number(item.dataset.maintenanceMonths || 0);

    selectedMaintenanceMonths = months;

    maintenanceDropdownItems.forEach((button) => {
      button.classList.remove("active");
    });

    item.classList.add("active");

    if (maintenanceDropdownLabel) {
      maintenanceDropdownLabel.textContent =
        months > 0 ? `Maintenance for ${months} months` : "No maintenance";
    }

    const summaryPrice = maintenanceDropdown?.querySelector("summary strong");

    if (summaryPrice) {
      summaryPrice.textContent = months > 0 ? "10% / month" : "0 JOD";
    }

    if (maintenanceDropdown) {
      maintenanceDropdown.removeAttribute("open");
    }

    updateEstimateUI();
  });
});

if (hostingToggle) {
  hostingToggle.addEventListener("change", () => {
    selectedHosting = hostingToggle.checked ? "managed" : "none";

    if (hostingToggleLabel) {
      hostingToggleLabel.textContent = hostingToggle.checked ? "On" : "Off";
    }

    updateEstimateUI();
  });
}

if (requestEstimateBtn) {
  requestEstimateBtn.addEventListener("click", () => {
    const estimate = calculateEstimate();

    localStorage.setItem("gmEstimate", JSON.stringify(estimate));

    window.location.href = "order.html";
  });
}

updateEstimateUI();

