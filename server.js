const express = require("express");
const Avatar = require("./lib");
const app = new express();

const PORT = process.env.port || 3000;

app.get("/", async (req, res) => {
  const { query } = req;

  const { engine, string, size = 500, outputType = "image" } = query;

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

    switch (outputType) {
      case "image":
        res.setHeader("Content-Disposition", "inline;");
        res.setHeader("Content-Type", "image/png");
        res.send(buffer);
        break;

      case "base64":
        const encoded = await buffer.toString("base64");
        res.send(`data:image/png;base64,${encoded}`);
        break;

      default:
        throw new TypeError(`Invalid output type ${outputType}`);
    }
  } catch (err) {
    console.error(err);

    res.status(500).send("Internal error");
  }
});

app.listen(PORT, () => {
  console.log(`Avatar API is listening on port ${PORT}`);
});
