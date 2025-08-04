/* eslint-disable no-console -- needed */

import { CONTAINERS } from "@common";
import { updateProjectScriptPath } from "@optimeleon/db"; // ensure this is exported
import axios from "axios";
import { Worker } from "bullmq";
import fs from "fs";
import path from "path";

const main = () => {
  console.log("Starting worker...");

  const worker = new Worker(
    "script-queue",
    async (job) => {
      const { projectId, targetUrl } = job.data as {
        projectId: string;
        targetUrl: string;
        ignoredPaths: string[];
        userId: string;
      };

      // 1. Fetch HTML
      const response = await axios.get(targetUrl);
      if (response.status !== 200) {
        throw new Error(`Failed to fetch ${targetUrl}: ${response.status}`);
      }

      // 2. Generate JS snippet
      const variationIndex = new Date().getHours() % 4;
      const greetings = [
        "Good morning",
        "Good afternoon",
        "Good evening",
        "Good night",
      ];
      const styles =
        variationIndex < 2
          ? "document.body.style.background='white';document.body.style.color='black';"
          : "document.body.style.background='black';document.body.style.color='white';";

      const scriptContent = `
(function() {
  const greeting = '${greetings[variationIndex]}';
  ${styles}
  const heading = document.querySelector('h1,h2,h3,h4,h5,h6');
  if (heading) {
    heading.textContent = greeting + ' ' + heading.textContent;
  }
  const url = new URL(window.location);
  url.searchParams.set('variation', '${String.fromCharCode(97 + variationIndex)}');
  window.history.replaceState({}, '', url);
})();
`;

      // 3. Write to disk
      const scriptsDir = path.join(process.cwd(), "public", "scripts");
      if (!fs.existsSync(scriptsDir))
        fs.mkdirSync(scriptsDir, { recursive: true });
      const filePath = path.join(scriptsDir, `${projectId}.js`);
      fs.writeFileSync(filePath, scriptContent, "utf-8");

      // 4. Update DB
      await updateProjectScriptPath(projectId, filePath);

      return { filePath };
    },
    { connection: { host: "localhost", port: CONTAINERS.REDIS.port } },
  );

  worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed for project ${job.data.projectId}`);
  });
  worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err);
  });

  return worker;
};

export default main;
