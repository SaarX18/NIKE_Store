const API_KEY = "12c627c9-0e80-4181-8e39-7a6015245fee";
const API_URL = `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`;

const matchesContainer = document.getElementById("matches");
const refreshButton = document.getElementById("refreshButton");

async function getMatchData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.status !== "success" || !data.data) {
      throw new Error("Failed to fetch match data");
    }

    const wplMatches = data.data.filter(match => match.series_id === "71a7c7dc-3929-408c-9641-1da6d96f8894");

    wplMatches.forEach(match => {
      const matchCard = document.createElement("div");
      matchCard.classList.add("match-card");

      const teamLogos = match.teamInfo.map(info => `<img src="${info.img}" alt="${info.name}" width="50" height="50">`).join(" ");

      const matchDetails = `
        <strong>Teams:</strong> ${match.teams.join(" vs ")}<br>
        ${teamLogos}<br>
        <strong>Date, Time:</strong> ${new Date(match.dateTimeGMT).toLocaleString()}<br>
        <strong>Venue:</strong> ${match.venue}<br>
        <strong>Toss won:</strong> ${match.status.split(" ")[0]}<br>
        <strong>Match type:</strong> ${match.matchType}<br>
        <strong>${match.teams[0]}:</strong> ${match.score[0].r}/${match.score[0].w} (${match.score[0].o} overs)<br>
        <strong>${match.teams[1]}:</strong> ${match.score[1].r}/${match.score[1].w} (${match.score[1].o} overs)<br>
        <strong>Match Result:</strong> ${match.status}
      `;

      matchCard.innerHTML = matchDetails;
      matchesContainer.appendChild(matchCard);
    });
  } catch (error) {
    console.error("Error fetching match data:", error.message);
  }
}

refreshButton.addEventListener("click", async () => {
  matchesContainer.innerHTML = ""; // Clear existing matches before refreshing
  await getMatchData();
});

// Initial load of match data
getMatchData();
