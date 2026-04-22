sequenceDiagram
  participant browser
  participant server
  autonumber
  
  Note right of browser: User fills the form and submits
  browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
  activate server
  Note over server: server processes and saves notes
  server-->>browser: 302 found (Location /exampleapp/notes)
  deactivate server
  Note right of browser: the browser sees 302 status and automatically <br/> follows the Location header
   
  
  browser->>server:GET https://studies.cs.helsinki.fi/exampleapp/notes
  activate server
  server-->>browser: HTML document
  deactivate server
  
  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
  activate server
  server-->>browser: CSS file
  deactivate server
  
  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
  activate server
  server-->>browser: Javascript file
  deactivate server
  
  Note right of browser: the browser starts executing the code <br/> that fetches json
  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
  activate server
  server-->>browser: JSON body content
  deactivate server
  Note right of browser: the browser executes the code that <br/> renders the updated notes list
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
