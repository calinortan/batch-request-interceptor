import React from "react";

import client from "./apiClient";

const apiClient = client();
const batchUrl = "/files";

async function runTest() {
  // Should batch in to one request
  apiClient
    .get(batchUrl, { params: { ids: ["file2"] } })
    .then(({ data }) => console.log(data))
    .catch(console.log);

  apiClient
    .get(batchUrl, { params: { ids: ["file1", "file2"] } })
    .then(({ data }) => console.log(data))
    .catch(console.log);

  // The following should reject as the fileid3 is missing from the response;
  apiClient
    .get(batchUrl, { params: { ids: ["file3"] } })
    .then(({ data }) => console.log(data))
    .catch(console.log);
}

async function shouldRejectCall() {
  // The following should reject as the fileid3 is missing from the response;
  apiClient
    .get(batchUrl, { params: { ids: ["file7", "file9"] } })
    .then(({ data }) => console.log(data))
    .catch(console.log);
}

function App() {
  return (
    <div className="App">
      <h3>3 requests</h3>
      <button onClick={() => runTest()}>Test</button>

      <h3>1 request - should reject</h3>
      <button onClick={() => shouldRejectCall()}>Test</button>
    </div>
  );
}

export default App;
