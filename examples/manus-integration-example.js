/**
 * Example: How to use Manus.im in your Replit project
 */

import ManusClient from '../lib/manus-client.js';

// Initialize client with API key from environment
const manus = new ManusClient(process.env.MANUS_API_KEY);

// Example 1: Simple task execution
async function analyzeDocument() {
  try {
    const result = await manus.executeTask({
      goal: "Analyze this financial document and extract key metrics",
      inputs: [
        { type: "file", path: "./documents/financial-report.pdf" },
        { type: "context", data: "Focus on Q2 revenue and expenses" }
      ],
      mode: "multimodal", // Supports text, image, audio, video
      constraints: {
        privacy: "GDPR",
        format: "structured_json",
        deadline: "2024-08-30T15:00"
      }
    });

    console.log("Analysis completed:", result);
    return result;
  } catch (error) {
    console.error("Analysis failed:", error);
  }
}

// Example 2: Real-time streaming task
function startRealtimeAnalysis() {
  const onMessage = (data) => {
    if (data.type === 'progress') {
      console.log('Progress:', data.message);
    } else if (data.type === 'complete') {
      console.log('Task completed:', data.result);
    }
  };

  const onError = (error) => {
    console.error('Stream error:', error);
  };

  const websocket = manus.streamTask({
    goal: "Monitor website changes and alert on significant updates",
    inputs: [{ type: "url", value: "https://example.com" }],
    tools: ["web_scraper", "diff_analyzer", "alert_system"]
  }, onMessage, onError);

  // Close connection after 5 minutes
  setTimeout(() => {
    websocket.close();
  }, 300000);
}

// Example 3: Complex workflow automation
async function automateComplexWorkflow() {
  try {
    // Start a multi-step automation task
    const taskResult = await manus.executeTask({
      goal: "Research competitors, analyze their pricing, and create a comparison report",
      inputs: [
        { type: "list", data: ["competitor1.com", "competitor2.com", "competitor3.com"] },
        { type: "template", path: "./templates/comparison-report.md" }
      ],
      mode: "autonomous", // Let Manus coordinate multiple tools
      constraints: {
        max_duration: "30 minutes",
        output_format: "markdown_report",
        include_screenshots: true
      },
      tools: [
        "web_research",
        "price_extraction", 
        "data_analysis",
        "report_generation",
        "screenshot_capture"
      ]
    });

    // Check task status if it's long-running
    if (taskResult.status === 'processing') {
      const statusCheck = await manus.getTaskStatus(taskResult.taskId);
      console.log("Current status:", statusCheck);
    }

    return taskResult;
  } catch (error) {
    console.error("Workflow automation failed:", error);
  }
}

// Example usage
async function main() {
  console.log("Starting Manus.im integration examples...");
  
  // Run examples (uncomment as needed)
  // await analyzeDocument();
  // startRealtimeAnalysis();
  // await automateComplexWorkflow();
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { analyzeDocument, startRealtimeAnalysis, automateComplexWorkflow };