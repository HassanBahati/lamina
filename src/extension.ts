import * as vscode from "vscode";
import ollama from "ollama";
import { exec } from "child_process";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("lamina.openChat", () => {
    checkOllamaStatus().then((isOllamaRunning) => {
      if (!isOllamaRunning) {
        vscode.window.showErrorMessage(
          "Ollama is not running. Please start Ollama. If it's not installed, visit https://ollama.com to download it."
        );
        return;
      }

      const panel = vscode.window.createWebviewPanel(
        "lamina",
        "Lamina",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === "sendMessage") {
            try {
              const response = await queryOllamaModel(message.text);
              panel.webview.postMessage({
                command: "displayResponse",
                text: response,
              });
            } catch (error) {
              panel.webview.postMessage({
                command: "displayResponse",
                text: `Error: ${
                  (error as Error).message || "Unknown error occurred"
                }`,
              });
            }
          }
        },
        undefined,
        context.subscriptions
      );
    });
  });

  context.subscriptions.push(disposable);
}

function checkOllamaStatus(): Promise<boolean> {
  return new Promise((resolve) => {
    exec("curl --silent --max-time 5 http://localhost:11434/", (error, stdout, stderr) => {
      if (error) {
        resolve(false); // Ollama is not running or there's an error
      } else {
        resolve(true); // Ollama is running
      }
    });
  });
}

async function queryOllamaModel(input: string): Promise<string> {
  const modelName = vscode.workspace
    .getConfiguration("lamina")
    .get<string>("modelName", "llama3.1:8b");

  try {
    const message = { role: "user", content: input };

    const response = await ollama.chat({
      model: modelName,
      messages: [message],
    });
    return response.message.content;
  } catch (error) {
    console.error(`Error querying model ${modelName}:`, error);
    return `Error: Could not query the model. Please check your configuration and model availability.`;
  }
}

function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lamina</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        #chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 10px;
        }
        #output {
          flex: 1;
          overflow-y: auto;
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 10px;
          background-color: #f9f9f9;
        }
        #input-container {
          display: flex;
        }
        #input {
          flex: 1;
          height: 50px;
          padding: 10px;
          resize: none;
        }
        #send {
          padding: 10px;
          margin-left: 10px;
        }
        .user-message {
          text-align: right;
          color: blue;
          margin-bottom: 5px;
        }
        .response-message {
          text-align: left;
          color: black;
          margin-bottom: 5px;
        }
      </style>
    </head>
    <body>
      <div id="chat-container">
        <div id="output"></div>
        <div id="input-container">
          <textarea id="input" placeholder="Type your message here..."></textarea>
          <button id="send">Send</button>
        </div>
      </div>
      <script>
        const vscode = acquireVsCodeApi();

        document.getElementById("send").addEventListener("click", () => {
          const inputElement = document.getElementById("input");
          const input = inputElement.value.trim();
          if (input === "") {
            alert("Message cannot be empty!");
            return;
          }

          const output = document.getElementById("output");
          const userMessage = document.createElement("p");
          userMessage.className = "user-message";
          userMessage.textContent = "You: " + input;
          output.appendChild(userMessage);
          output.scrollTop = output.scrollHeight;

          vscode.postMessage({ command: "sendMessage", text: input });
          inputElement.value = "";
        });

        window.addEventListener("message", (event) => {
          const message = event.data;
          if (message.command === "displayResponse") {
            const output = document.getElementById("output");
            const modelName = 'Lamina'; 
            const responseMessage = document.createElement("p");
            responseMessage.className = "response-message";
            responseMessage.textContent = modelName + ": " + message.text;
            output.appendChild(responseMessage);
            output.scrollTop = output.scrollHeight;
          }
        });
      </script>
    </body>
    </html>
  `;
}

export function deactivate() {}
