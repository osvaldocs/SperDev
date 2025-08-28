import { get, post, update, deletes } from "../../service/api";
import { navigate } from "../../router/router.js";
const urlSearch = "http://localhost:3000/search";
const urlVideos = "http://localhost:3000/videos";

export function homeUsers() {
  const searchBtn = document.getElementById("searchbtn");
  const resultsContainer = document.getElementById("searchResults");

  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const searchInput = document.getElementById("searchInput");
    const q = searchInput.value.trim();
    try {
    const result = await get(`${urlSearch}?q=${encodeURIComponent(q)}`);
    const resultVideos = await get(urlVideos);
    resultsContainer.innerHTML = result.map(item => {
      const videoMatch = resultVideos.find(video => video.title === item.title);
      return `
        <div class="result-card p-2 border-bottom">
          <h6>${item.title}</h6>
          <video src="${videoMatch?.Url || ''}" controls width="300" height="180" style="border-radius: 8px;"></video>
        </div>
      `;
    })
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
  });
}

