function x(element) {
  let dataSnapshots = [];

  fetchAndDisplayPlayers();
  setInterval(fetchAndDisplayPlayers, 900000); // Fetch data every 15 minutes

  function fetchAndDisplayPlayers() {
    let link = "";
    if (element.name == "guilds") {
      link = "https://raongames.com/growcastle/restapi/season/now/guilds";
    } else if (element.name == "players") {
      link = "https://raongames.com/growcastle/restapi/season/now/players";
    } else {
      link = `https://raongames.com/growcastle/restapi/season/now/guilds/${element.title}`;
    }
    fetch(link)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.result && Array.isArray(data.result.list)) {
          const snapshot = { timestamp: new Date(), data: data.result.list };
          dataSnapshots.push(snapshot); // Add new snapshot to the array
          createAndDisplayNewTable(snapshot); // Create and display new table
        } else {
          console.error("Data format is invalid", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching players data:", error);
      });
  }

  function createAndDisplayNewTable(snapshot) {
    let rank = 1;
    const previousSnapshotIndex = dataSnapshots.length - 2;
    const previousSnapshot =
      previousSnapshotIndex >= 0 ? dataSnapshots[previousSnapshotIndex] : null;

    const snapshotWrapper = document.createElement("div");
    snapshotWrapper.className = "snapshot-wrapper";

    const timestampHeader = document.createElement("h2");
    timestampHeader.className = "timestamp-header";
    timestampHeader.textContent = `Data fetched at: ${snapshot.timestamp.toLocaleTimeString()}`;
    snapshotWrapper.appendChild(timestampHeader);

    const table = document.createElement("table");
    table.className = "snapshot-table";
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Player</th>
            <th>Name</th>
            <th>Score (Change)</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    snapshot.data.forEach((player) => {
      const row = document.createElement("tr");
      const scoreChangeText = calculateScoreChange(player, previousSnapshot);
      row.innerHTML = `
            <td>${rank++}</td>
            <td>${player.name}</td>
            <td>${player.score}${scoreChangeText}</td>
        `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    snapshotWrapper.appendChild(table);
    const snapshotsContainer = document.getElementById("snapshotsContainer");
    let addTables = document.getElementsByClassName(element.name);
    if (addTables.length < 1) {
      let tracker = document.createElement("div");
      tracker.className = element.name;
      snapshotsContainer.appendChild(tracker);
      addTables = document.getElementsByClassName(element.name);
    }
    addTables[0].appendChild(snapshotWrapper);

    // Scroll to the right end of the container
    snapshotsContainer.scrollLeft = snapshotsContainer.scrollWidth;
  }

  function calculateScoreChange(player, previousSnapshot) {
    let scoreChangeText = "";
    let scoreChangeClass = "";

    if (previousSnapshot) {
      const previousPlayer = previousSnapshot.data.find(
        (p) => p.name === player.name
      );
      const scoreChange = previousPlayer
        ? player.score - previousPlayer.score
        : 0;

      if (scoreChange === 0) {
        scoreChangeClass = "zero-change";
      } else if (scoreChange > 0 && scoreChange < 180) {
        scoreChangeClass = "positive-change";
      } else if (scoreChange >= 300) {
        scoreChangeClass = "high-positive-change";
      } else {
        scoreChangeClass = "waving";
      }

      scoreChangeText = ` <span class="${scoreChangeClass}">(${
        scoreChange >= 0 ? "+" : ""
      }${scoreChange})</span>`;
    }

    return scoreChangeText;
  }
}
