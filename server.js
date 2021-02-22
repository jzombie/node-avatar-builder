const express = require("express");
const Avatar = require("./lib");
const app = new express();

const PORT = process.env.port || 3000;

app.get("/", async (req, res) => {
  const { query } = req;

  const { engine, string, size = 500 } = query;

  // Allow engine to contain optional "Builder" suffix
  const avatarEngine = `${engine.replace("Builder", "")}Builder`;

  if (typeof Avatar[avatarEngine] !== "function") {
    const msg = `Engine "${engine}" not found`;

    console.error(msg);

    res.status(404).send(msg);
    return;
  }

  try {
    const avatarInstance = Avatar[avatarEngine](parseInt(size, 10), {
      // FIXME: There seems to be an issue with certain engines returning
      // proper scaled size after previous call w/ same string
      cache: null,
    });
    const buffer = await avatarInstance.create(string);

    res.setHeader("Content-Disposition", "inline;");
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error(err);

    res.status(500).send("Internal error");
  }
});

app.listen(PORT, () => {
  console.log(`Avatar API is listening on port ${PORT}`);
});
