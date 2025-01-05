import * as ai from "../services/ai.service.js";

export const getResult = async (req, res) => {
  try{
    const {prompt} = req.query;
    const result = await ai.generateResult(prompt);
    res.send(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};