import FormData from "form-data";
import fetch from "node-fetch";

export const predictFood = async (req, res) => {
  try {
    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: "food.jpg",
      contentType: req.file.mimetype,
    });

    const response = await fetch("http://127.0.0.1:8001/predict", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const result = await response.json();
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "Prediction failed" });
  }
};
