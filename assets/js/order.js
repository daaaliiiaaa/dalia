const API_BASE_URL = "";

const orderEstimateSummary = document.querySelector("#orderEstimateSummary");
const orderForm = document.querySelector("#orderForm");
const orderMessage = document.querySelector("#orderMessage");

const fullNameInput = document.querySelector("#fullName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const companyNameInput = document.querySelector("#companyName");
const preferredContactInput = document.querySelector("#preferredContact");
const projectNotesInput = document.querySelector("#projectNotes");

function formatJOD(amount) {
  const number = Number(amount || 0);
  const fixedAmount = Number(number.toFixed(2));

  if (Number.isInteger(fixedAmount)) {
    return `${fixedAmount.toLocaleString()} JOD`;
  }

  return `${fixedAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} JOD`;
}

function getStoredEstimate() {
  const storedEstimate = localStorage.getItem("gmEstimate");

  if (!storedEstimate) {
    return null;
  }

  try {
    return JSON.parse(storedEstimate);
  } catch (error) {
    return null;
  }
}

const estimate = getStoredEstimate();

console.log("Stored estimate:", estimate);

function renderEstimateSummary() {
  if (!orderEstimateSummary) return;

  if (!estimate) {
    orderEstimateSummary.innerHTML = `
      <p>No estimate found. Please go back to the pricing calculator and select your project details.</p>
      <a href="index.html#calculator" class="hero-btn-primary">Back to Calculator</a>
    `;
    return;
  }

  const addonsHTML =
    estimate.selectedAddons && estimate.selectedAddons.length > 0
      ? estimate.selectedAddons
          .map(
            (addon) => `
              <p>
                <span>${addon.name}</span>
                <strong>+${formatJOD(addon.price)}</strong>
              </p>
            `
          )
          .join("")
      : `
        <p>
          <span>No add-ons selected</span>
          <strong>0 JOD</strong>
        </p>
      `;

  orderEstimateSummary.innerHTML = `
    <div class="order-summary-list">
      <p>
        <span>Base tier</span>
        <strong>${estimate.tier.code} — ${estimate.tier.name}</strong>
      </p>

      <p>
        <span>Base price</span>
        <strong>${formatJOD(estimate.basePrice)}</strong>
      </p>

      ${addonsHTML}

      <p>
        <span>Add-ons subtotal</span>
        <strong>${formatJOD(estimate.addonsTotal)}</strong>
      </p>

      <p>
        <span>Maintenance</span>
        <strong>
          ${
            estimate.selectedMaintenanceMonths > 0
              ? `${estimate.selectedMaintenanceMonths} months — ${formatJOD(
                  estimate.maintenanceTotal
                )}`
              : "Not selected"
          }
        </strong>
      </p>

      <p>
        <span>Hosting</span>
        <strong>
          ${
            estimate.selectedHosting === "managed"
              ? `Managed hosting — ${formatJOD(estimate.hostingFee)}`
              : "Not selected"
          }
        </strong>
      </p>

      <p>
        <span>VAT 16%</span>
        <strong>${formatJOD(estimate.vatAmount)}</strong>
      </p>

      <div class="order-summary-total">
        <span>Estimated Total</span>
        <strong>${formatJOD(estimate.total)}</strong>
        <small>
          Range: ${formatJOD(estimate.lowRange)} – ${formatJOD(
    estimate.highRange
  )}
        </small>
      </div>
    </div>
  `;
}

renderEstimateSummary();

if (orderForm) {
  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!estimate) {
      orderMessage.innerHTML = `
  <div class="order-success-box">
    <div class="order-success-icon">✓</div>
    <h3>Thank you!</h3>
    <p>Your project request was submitted successfully.</p>
    <p>Our team will review your request and contact you soon.</p>
    <a href="index.html" class="order-success-btn">Back to Home</a>
  </div>
`;

orderMessage.className = "order-message success";

localStorage.removeItem("gmEstimate");

orderForm.reset();
return;
    }

    const orderData = {
      customer: {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        companyName: companyNameInput.value.trim(),
        preferredContact: preferredContactInput.value,
      },

      project: {
        notes: projectNotesInput.value.trim(),

        baseTier: {
          key: estimate.tier.code,
          name: estimate.tier.name,
          price: estimate.basePrice,
        },

        selectedAddons: estimate.selectedAddons || [],

        addonsTotal: estimate.addonsTotal,

        maintenance: {
          months: estimate.selectedMaintenanceMonths || 0,
          total: estimate.maintenanceTotal || 0,
        },

        hosting: {
          selected: estimate.selectedHosting === "managed",
          total: estimate.hostingFee || 0,
        },

        vat: {
          rate: 0.16,
          amount: estimate.vatAmount || 0,
        },

        estimatedTotal: estimate.total,

        estimatedRange: {
          low: estimate.lowRange,
          high: estimate.highRange,
        },
      },
    };

    try {
      orderMessage.textContent = "Submitting your request...";
      orderMessage.className = "order-message";

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      orderMessage.textContent =
        "Your project request was submitted successfully.";
      orderMessage.className = "order-message success";

      orderForm.reset();
      localStorage.removeItem("gmEstimate");
    } catch (error) {
      orderMessage.textContent = error.message;
      orderMessage.className = "order-message error";
    }
  });
} 