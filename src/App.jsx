/**
Ref: https://github.com/EBEREGIT/react-chatgpt-tutorial 
*/

const API_URL = "https://4e01-140-112-41-151.ngrok-free.app/petlover/callback";

const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const stopBtn = document.getElementById("stopBtn");
const resultText = document.getElementById("resultText");

let controller = null; // Store the AbortController instance

// define the generate function
const generate = async () => {
  // Alert the user if no prompt value
  if (!promptInput.value) {
    alert("Please enter a URL contains either /maps/search or /maps/place.");
    return;
  }

  // Disable the generate button and enable the stop button
  generateBtn.disabled = true;
  stopBtn.disabled = false;
  resultText.innerText = "Sniffing...";

  // Create a new AbortController instance
  controller = new AbortController();
  const signal = controller.signal;

  try {
    // Fetch the response from the OpenAI API with the signal from AbortController
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        txt: "%petfriendly%"+promptInput.value ,
      }),
      signal, // Pass the signal to the fetch request
    });
    
    // Read the response as a stream of data
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    resultText.innerText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      // Massage and parse the chunk of data
      const chunk = decoder.decode(value);
      const parsedLines = chunk.split("\n");

      for (const parsedLine of parsedLines) {
        if (parsedLine) {
          resultText.innerText += parsedLine;
        }
      }
    }
  } catch (error) {
    // Handle fetch request errors
    if (signal.aborted) {
      resultText.innerText = "Request aborted.";
    } else {
      console.error("Error:", error);
      resultText.innerText = "Error occurred while generating.";
    }
  } finally {
    // Enable the generate button and disable the stop button
    generateBtn.disabled = false;
    stopBtn.disabled = true;
    controller = null; // Reset the AbortController instance
  }
};

const stop = () => {
  // Abort the fetch request by calling abort() on the AbortController instance
  if (controller) {
    controller.abort();
    controller = null;
  }
};

// make Enter also be a trigger
promptInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    generate();
  }
});
generateBtn.addEventListener("click", generate);
stopBtn.addEventListener("click", stop);
