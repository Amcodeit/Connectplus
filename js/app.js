const clubs = [
  {
    id: 1,
    name: "Technical Forum",
    description: "This forum nurtures students' technological knowledge, providing a platform to showcase expertise in robotics, hardware modeling, software, and app design. ",
    image: "images/technical.jpg"
  },
  {
    id: 2,
    name: "Performing & Visual Arts Forum",
    description: "This forum focuses on ingraining arts and culture, organizing activities like painting, drama, photography, singing, and dance competitions. ",
    image: "images/cultural.jpg"
  },
  {
    id: 3,
    name: "Sports Forum",
    description: "This forum promotes sports and recreation, offering facilities for indoor games like table tennis, carrom, and chess, as well as outdoor games like cricket and football. ",
    image: "images/sports.jpg"
  },
  {
    id: 4,
    name: "Google Developer Students Club BPPIMT",
    description: "This club focuses on Google Developer technologies and hosts events like inter-college coding competitions. They have teams working on web development, app development, cloud computing, and more.",
    image: "images/gdsc.png"
  },
  {
    id: 5,
    name: "Literary Forum",
    description: "The Literary and Orators’ forum of this Institute provides a platform to the students to weave their creative excellence into beautiful manifestations.",
    image: "images/literary.jpg"
  },
  {
    id: 6,
    name: "Institution’s Innovation Council (IIC)",
    description: "The primary objective of an Institution Innovation’s Council (IIC) is to foster a culture of innovation and entrepreneurship within educational Institutions",
    image: "images/business.jpg"
  }
];

const clubList = document.getElementById('club-list');
if (clubList) {
  clubs.forEach(club => {
    clubList.innerHTML += `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
        <img src="${club.image}" class="w-full h-40 object-cover" />
        <div class="p-4">
          <h2 class="text-xl font-bold text-indigo-700">${club.name}</h2>
          <p class="text-gray-600 text-sm mt-1">${club.description}</p>
          <a href="club.html?id=${club.id}" class="inline-block mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition">View Club</a>
        </div>
      </div>
    `;
  });
}
// CLUB PAGE LOGIC
const clubDetailDiv = document.getElementById('club-detail');
const params = new URLSearchParams(window.location.search);
const clubId = parseInt(params.get('id'));

if (clubDetailDiv && clubId) {
  const club = clubs.find(c => c.id === clubId);
  const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
  const relatedEvents = allEvents.filter(e => e.club === club.name);

  clubDetailDiv.innerHTML = `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-purple-700">${club.name}</h2>
      <p class="text-gray-600 mt-2">${club.description}</p>
      <button class="mt-4 px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Join Club</button>
      
      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Upcoming Events</h3>
        ${relatedEvents.length === 0 ? `<p class="text-gray-500 text-sm">No upcoming events.</p>` :
          `<ul class="space-y-3">
            ${relatedEvents.map(e => `
              <li class="border-l-4 border-purple-500 bg-purple-50 px-4 py-2 rounded shadow">
                <strong>${e.name}</strong><br/>
                <span class="text-sm text-gray-600">📅 ${new Date(e.datetime).toLocaleString()}</span>
              </li>
            `).join("")}
          </ul>`
        }
      </div>
    </div>
  `;
}
// ADMIN PAGE LOGIC
const form = document.getElementById("event-form");
const list = document.getElementById("event-list");

if (form && list) {
  let events = JSON.parse(localStorage.getItem("events") || "[]");

  const renderEvents = () => {
    list.innerHTML = "";
    events.forEach((event, index) => {
      const date = new Date(event.datetime).toLocaleString();
      list.innerHTML += `
        <li class="bg-white p-4 shadow rounded border-l-4 border-red-500">
          <strong>${event.name}</strong> <br/>
          <span class="text-sm text-gray-600">📅 ${date}</span><br/>
          <span class="text-xs text-gray-500">🏷️ ${event.club}</span>
        </li>`;
    });
  };

  renderEvents();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("event-name").value.trim();
    const club = document.getElementById("event-club").value.trim();
    const datetime = document.getElementById("event-datetime").value;

    if (name && club && datetime) {
      events.push({ name, club, datetime });
      localStorage.setItem("events", JSON.stringify(events));
      renderEvents();
      form.reset();
      alert("✅ Event added!");
    }
  });
}
// 📅 Schedule page: render events sorted
const scheduleBody = document.getElementById("schedule-body");

if (scheduleBody) {
  const events = JSON.parse(localStorage.getItem("events") || "[]");

  events
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .forEach(event => {
      const dateStr = new Date(event.datetime).toLocaleString();
      scheduleBody.innerHTML += `
        <tr class="border-t border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-800 transition">
          <td class="px-4 py-3 font-medium">${event.name}</td>
          <td class="px-4 py-3">${event.club}</td>
          <td class="px-4 py-3 text-gray-600 dark:text-gray-300">${dateStr}</td>
        </tr>`;
    });

  if (events.length === 0) {
    scheduleBody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center py-6 text-gray-500 dark:text-gray-400">
          No upcoming events found.
        </td>
      </tr>`;
  }
}
const suggestionBox = document.getElementById("search-suggestions");

function showSuggestions(query) {
  if (!suggestionBox) return;

  const matched = clubs.filter(club =>
    club.name.toLowerCase().includes(query.toLowerCase())
  );

  suggestionBox.innerHTML = "";
  suggestionBox.classList.remove("hidden");

  if (query.trim() === "" || matched.length === 0) {
    suggestionBox.innerHTML = `<li class="px-4 py-2 text-sm text-gray-500 dark:text-gray-300">No results found.</li>`;
    return;
  }

  matched.forEach(club => {
    const li = document.createElement("li");
    li.textContent = club.name;
    li.className =
      "px-4 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-700";
    li.addEventListener("click", () => {
      searchInput.value = club.name;
      suggestionBox.classList.add("hidden");
      renderClubs(club.name); // filter immediately
    });
    suggestionBox.appendChild(li);
  });
}

searchInput.addEventListener("input", (e) => {
  const query = e.target.value;
  renderClubs(query);
  showSuggestions(query);
});

// Hide suggestions when clicking elsewhere
document.addEventListener("click", (e) => {
  if (!suggestionBox.contains(e.target) && e.target !== searchInput) {
    suggestionBox.classList.add("hidden");
  }
});
// ✅ DARK MODE TOGGLE WITH PERSISTENCE
const toggleButton = document.getElementById("dark-toggle");
if (toggleButton) {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  toggleButton.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  });
}
