# Steps to run client and server


## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Setup and Run



1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the server:**
    ```bash
    npm start
    ```
    Or directly:
    ```bash
    node server.js
    ```

3.  **Verify:**
    You should see the following output:
    ```
    ⚡ EnergyGrid Mock API running on port 3000
       Constraints: 1 req/sec, Max 10 items/batch
    ```
    The server is now listening at `http://localhost:3000`.

4. **Client**
   Open new terminal.
   cd src
   node index.js

## API Details

-   **Base URL:** `http://localhost:3000`
-   **Endpoint:** `POST /device/real/query`
-   **Auth Token:** `interview_token_123`


