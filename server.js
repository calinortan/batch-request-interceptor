const express = require("express");
const _ = require("lodash");
const app = express();
const port = 4000;

const mockData = ["file1", "file2"];

app.get("/v1/files", (req, res) => {
  const ids = _.get(req, "query.ids");

  if (_.isEmpty(ids)) {
    return res.send(mockData);
  }
  console.log("IDs: ", ids);

  const filteredItems = mockData.filter((item) => _.includes(ids, item));

  if (_.isEmpty(filteredItems)) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.json({ items: filteredItems });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
