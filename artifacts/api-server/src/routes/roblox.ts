import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/roblox/thumbnails", async (req, res) => {
  const ids = req.query.ids as string;
  if (!ids) {
    res.status(400).json({ error: "ids query param required" });
    return;
  }
  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/assets?assetIds=${ids}&size=420x420&format=Png&isCircular=false`
    );
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(502).json({ error: "Failed to fetch from Roblox" });
  }
});

export default router;
