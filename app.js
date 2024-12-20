// Base URL for exchange rate API
const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

// Select elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".form select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selections
    if (select.name === "form" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  // Update flag when dropdown value changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update the exchange rate and display it
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Ensure valid input amount
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Fetch exchange rate
  const URL = `${BASE_URL}/${fromCurr.value}`;

  try {
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    let data = await response.json();

    let rate = data.rates[toCurr.value];
    if (!rate) {
      throw new Error("Invalid currency code or response format.");
    }

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error:", error);
    msg.innerText = "Failed to fetch exchange rate. Please try again.";
  }
};

// Update the flag icon for a dropdown
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) {
    img.src = newSrc;
  }
};

// Handle button click to get exchange rate
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load default exchange rate on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
