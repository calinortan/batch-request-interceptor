import React from "react";

import client from "./apiClient";

async function runTest() {
  const apiClient = client();
  const batchUrl = "/files";
  try {
    // Should batch in to one request
    apiClient.get(batchUrl, { params: { ids: ["file1", "file2"] } });
    apiClient.get(batchUrl, { params: { ids: ["file2"] } });
    // The following should reject as the fileid3 is missing from the response;
    apiClient.get(batchUrl, { params: { ids: ["file3"] } });
  } catch (error) {
    console.log(error);
  }
}

function App() {
  return (
    <div className="App">
      <button onClick={() => runTest()}>Test</button>
    </div>
  );
}

export default App;
