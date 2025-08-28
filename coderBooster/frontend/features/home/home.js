import { get, post, update, deletes } from "../../service/api";
import { navigate } from "../../router/router.js";
const urlSearch = "http://localhost:3000/search";

export function homeUsers() {
  const searchBtn = document.getElementById("searchbtn");
  const resultsContainer = document.getElementById("searchResults");

  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const searchInput = document.getElementById("searchInput");
    const q = searchInput.value.trim();
    try {
        const result = await get (`${urlSearch}?q=${encodeURIComponent(q)}`)
        resultsContainer.innerHTML = result.map(item => `
            <div class="result-card p-2 border-bottom">
            <h6>${item.title}</h6>
             <video src="${item.Url}" controls width="300" height="180" style="border-radius: 8px;"></video>
          </div>
`);
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
  });
}

