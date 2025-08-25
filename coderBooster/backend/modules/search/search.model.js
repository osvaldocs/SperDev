import pool from "./db.js";

export const getSearchAllVideos = async () => {
  const [rows] = await pool.query("SELECT id_video, title, summary, url, video_date FROM videos");
  return rows;
};

export const getSearchVideos = async (q) => {
  const sql = `
    SELECT id_video, title, summary, url, video_date
    FROM videos
    WHERE title LIKE ? OR summary LIKE ?
  `;
  const [rows] = await pool.query(sql, [`%${q}%`, `%${q}%`]);
  return rows;
};