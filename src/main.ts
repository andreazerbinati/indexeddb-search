import { unwrap } from "./unwrap";
(async () => {
  
  const request = window.indexedDB.open("MyTestDatabase", 2);
  
  request.onupgradeneeded = async (event) => {
    console.log("upgrade needed");
    const db = (event.target as IDBOpenDBRequest).result;
    console.log({event});
  
    // const tokensStore = db.createObjectStore("tokens", {
    //   keyPath: "token",
    // });
    // await unwrap(tokensStore.transaction);
  
    const logStore = db.createObjectStore("logs", {
      keyPath: "id",
      autoIncrement: true
    });
    
    logStore.createIndex("date", "date");
    logStore.createIndex("level", "level");
  
    await unwrap(logStore.transaction);
  };
  
  const db = await unwrap(request);
  
  const log = async (message: string, level: "debug" | "info" | "error" = "info") => {
    const transaction = db.transaction(["logs"], "readwrite");
    const logStore = transaction.objectStore("logs");
  
    await unwrap(logStore.add({
      date: new Date(),
      level,
      message
    }));
  
    console.log(`[${level}] ${message}`);
  }
  
  
  console.log("hello!");
  
  let lastWriteTime = new Date().getTime();
  
  for (let i = 0; i < 50000; i ++){
    console.log("asdasdasd");
    await log("ciao!! ciao!");
    document.querySelector("#numberOfEntries")!.textContent = `${i}`;
    if (i % 100 === 0) {
      const now = new Date().getTime();
      const avg = 100 / ((now - lastWriteTime) / 1000);
      document.querySelector("#writesPerSecond")!.textContent = `${avg.toFixed(2)}`;
      lastWriteTime = now;
    }
  }  
  
  // // const getAllLogs = () => {
  // //   return new Promise((resolve) => {
  // //     const transaction = db.transaction(["logs"], "readwrite");
  
  // //     const logsStore = transaction.objectStore("logs");
    
  // //     const res: string[] = [];
  // //     logsStore.openCursor().onsuccess = (event) => {
        
  // //       const cursor: IDBCursorWithValue | null=  (event.target as IDBRequest).result;
  
  // //       if (!cursor) {
  // //         resolve(res)
  // //         return;
  // //       }
  
  // //       res.push(cursor.value)
  // //       cursor.continue()
  // //     }
  // //   })  
  // // }
  
  
  // // console.log(">>>", await getAllLogs());
})();