const showFormButton = document.getElementById("show_form");
const formPopup = document.getElementById("form_pop");
const closeButton = document.getElementById("close_button");
const form = document.getElementById("party_form");
const partyList = document.getElementById("event_list");

const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2410-ftb-et-web-am/events";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(API_URL);
    const events = await response.json();
    events.forEach(displayEvent);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
});

showFormButton.addEventListener("click", () => {
  formPopup.style.display = "flex";
});

closeButton.addEventListener("click", () => {
  formPopup.style.display = "none";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("event_text").value.trim();
  const date = document.getElementById("event_date").value;
  const time = document.getElementById("event_time").value || "TBA";
  const location = document.getElementById("event_location").value.trim();
  const info = document.getElementById("event_info").value.trim();

  const startDate = new Date(date);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = startDate.toLocaleDateString("en-GB", options);

  const eventData = { name, formattedDate, time, location, info };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    if (response.ok) {
      const newEvent = await response.json();
      displayEvent(newEvent);
      formPopup.style.display = "none";
      form.reset();
    } else {
      console.error("Failed to add");
    }
  } catch (error) {
    console.error("Error adding:", error);
  }
});

function displayEvent(event) {
  const eventBlock = document.createElement("div");
  eventBlock.classList.add("event-block");
  eventBlock.innerHTML = `
    <span class="delete">&times;</span>
    <h3>${event.name}</h3>
    <p><strong>Date:</strong> ${event.formattedDate}</p>
    <p><strong>Time:</strong> ${event.time}</p>
    <p><strong>Location:</strong> ${event.location}</p>
    <p><strong>Info:</strong> ${event.info}</p>
  `;

  const deleteButton = eventBlock.querySelector(".delete");
  deleteButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}/${event.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        eventBlock.remove();
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  });

  partyList.appendChild(eventBlock);
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(API_URL);
    const events = await response.json();
    console.log("Fetched Events:", events);
    events.forEach(displayEvent);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
});
