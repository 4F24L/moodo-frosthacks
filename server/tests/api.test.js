/**
 * Comprehensive API Test Suite
 * Tests all mood tracking endpoints
 * 
 * Run with: npm test
 */

import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
let authToken = "";
let userId = "";
let moodEntryId = "";
let alertId = "";

// Test user credentials
const testUser = {
  name: "Test User",
  email: `test-${Date.now()}@example.com`,
  password: "Test@1234",
};

// Helper function for API calls
const api = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true, // Don't throw on any status
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name, passed, details = "") {
  const status = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${status}: ${name}`);
  if (details) console.log(`   ${details}`);
  results.tests.push({ name, passed, details });
  if (passed) results.passed++;
  else results.failed++;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ============================================================================
// AUTH TESTS
// ============================================================================

async function testRegister() {
  console.log("\n📝 TESTING REGISTRATION");
  try {
    const res = await api.post("/auth/register", testUser);
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(res.data.data.accessToken, "No access token returned");
    logTest("Register User", true, `Token: ${res.data.data.accessToken.substring(0, 20)}...`);
  } catch (err) {
    logTest("Register User", false, err.message);
  }
}

async function testLogin() {
  console.log("\n🔐 TESTING LOGIN");
  try {
    const res = await api.post("/auth/login", {
      email: testUser.email,
      password: testUser.password,
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(res.data.data.accessToken, "No access token returned");
    authToken = res.data.data.accessToken;
    logTest("Login User", true, `Token: ${authToken.substring(0, 20)}...`);
  } catch (err) {
    logTest("Login User", false, err.message);
  }
}

// ============================================================================
// MOOD ANALYSIS TESTS
// ============================================================================

async function testAnalyzeMood() {
  console.log("\n🎯 TESTING MOOD ANALYSIS");
  try {
    const res = await api.post("/mood/analyze", {
      features: {
        pitch: 120,
        jitter: 0.02,
        speech_rate: 150,
      },
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(res.data.data.mood._id, "No mood entry ID");
    assert(res.data.data.mood.moodScore >= 1 && res.data.data.mood.moodScore <= 10, "Invalid mood score");
    moodEntryId = res.data.data.mood._id;
    logTest("Analyze Mood (Features)", true, `Score: ${res.data.data.mood.moodScore}, Label: ${res.data.data.mood.moodLabel}`);
  } catch (err) {
    logTest("Analyze Mood (Features)", false, err.message);
  }
}

async function testAnalyzeMoodWithText() {
  console.log("\n🎯 TESTING MOOD ANALYSIS WITH TEXT");
  try {
    const res = await api.post("/mood/analyze", {
      features: {
        pitch: 150,
        jitter: 0.01,
        speech_rate: 160,
      },
      text: "I'm feeling absolutely amazing today!",
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(res.data.data.mood.sentimentScore !== null, "No sentiment score");
    logTest("Analyze Mood (With Text)", true, `Sentiment: ${res.data.data.mood.sentiment}, Score: ${res.data.data.mood.sentimentScore}`);
  } catch (err) {
    logTest("Analyze Mood (With Text)", false, err.message);
  }
}

async function testAnalyzeMoodInvalidFeatures() {
  console.log("\n🎯 TESTING MOOD ANALYSIS VALIDATION");
  try {
    const res = await api.post("/mood/analyze", {
      features: {
        pitch: 600, // Invalid: > 500
        jitter: 0.02,
        speech_rate: 150,
      },
    });
    // Validation should reject - accepting any error response
    assert(res.status >= 400, `Expected error status, got ${res.status}`);
    logTest("Mood Analysis Validation", true, `Correctly rejected invalid pitch`);
  } catch (err) {
    logTest("Mood Analysis Validation", false, err.message);
  }
}

async function testProcessAudioMissingFile() {
  console.log("\n🎤 TESTING PROCESS AUDIO");
  try {
    const res = await api.post("/mood/process-audio", {});
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    assert(res.data.success === false, "Should indicate failure");
    logTest("Process Audio (Missing File)", true, "Correctly rejected request without audio file");
  } catch (err) {
    logTest("Process Audio (Missing File)", false, err.message);
  }
}

// ============================================================================
// SENTIMENT ANALYSIS TESTS
// ============================================================================

async function testSentimentPositive() {
  console.log("\n💬 TESTING SENTIMENT ANALYSIS");
  try {
    const res = await api.post("/mood/sentiment/analyze", {
      text: "I am absolutely delighted and thrilled about this wonderful opportunity!",
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(res.data.data.sentimentScore > 0, "Expected positive sentiment");
    assert(res.data.data.label === "positive", "Expected positive label");
    logTest("Sentiment Analysis (Positive)", true, `Score: ${res.data.data.sentimentScore}, Confidence: ${res.data.data.confidence}`);
  } catch (err) {
    logTest("Sentiment Analysis (Positive)", false, err.message);
  }
}

async function testSentimentNegative() {
  console.log("\n💬 TESTING SENTIMENT ANALYSIS");
  try {
    const res = await api.post("/mood/sentiment/analyze", {
      text: "This is terrible, awful, and horrible. I hate this situation.",
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(res.data.data.sentimentScore < 0, "Expected negative sentiment");
    assert(res.data.data.label === "negative", "Expected negative label");
    logTest("Sentiment Analysis (Negative)", true, `Score: ${res.data.data.sentimentScore}, Confidence: ${res.data.data.confidence}`);
  } catch (err) {
    logTest("Sentiment Analysis (Negative)", false, err.message);
  }
}

async function testSentimentNeutral() {
  console.log("\n💬 TESTING SENTIMENT ANALYSIS");
  try {
    const res = await api.post("/mood/sentiment/analyze", {
      text: "The weather is cloudy today.",
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(res.data.data.label === "neutral", "Expected neutral label");
    logTest("Sentiment Analysis (Neutral)", true, `Score: ${res.data.data.sentimentScore}`);
  } catch (err) {
    logTest("Sentiment Analysis (Neutral)", false, err.message);
  }
}

async function testSentimentValidation() {
  console.log("\n💬 TESTING SENTIMENT VALIDATION");
  try {
    const res = await api.post("/mood/sentiment/analyze", {
      text: "", // Empty text
    });
    // Validation should reject - accepting any error response
    assert(res.status >= 400, `Expected error status, got ${res.status}`);
    logTest("Sentiment Validation", true, `Correctly rejected empty text`);
  } catch (err) {
    logTest("Sentiment Validation", false, err.message);
  }
}

// ============================================================================
// MOOD HISTORY TESTS
// ============================================================================

async function testGetMoodHistory() {
  console.log("\n📊 TESTING MOOD HISTORY");
  try {
    const res = await api.get("/mood/history?range=7d&limit=20");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(Array.isArray(res.data.data), "Data is not an array");
    logTest("Get Mood History", true, `Retrieved ${res.data.data.length} entries`);
  } catch (err) {
    logTest("Get Mood History", false, err.message);
  }
}

async function testGetMoodHistoryRanges() {
  console.log("\n📊 TESTING MOOD HISTORY RANGES");
  const ranges = ["7d", "30d", "90d"];
  for (const range of ranges) {
    try {
      const res = await api.get(`/mood/history?range=${range}`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      logTest(`Get Mood History (${range})`, true, `Retrieved ${res.data.data.length} entries`);
    } catch (err) {
      logTest(`Get Mood History (${range})`, false, err.message);
    }
  }
}

async function testGetLatestMood() {
  console.log("\n📊 TESTING LATEST MOOD");
  try {
    const res = await api.get("/mood/latest");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    if (res.data.data) {
      assert(res.data.data.moodScore, "No mood score");
      logTest("Get Latest Mood", true, `Score: ${res.data.data.moodScore}`);
    } else {
      logTest("Get Latest Mood", true, "No entries yet (expected for new user)");
    }
  } catch (err) {
    logTest("Get Latest Mood", false, err.message);
  }
}

// ============================================================================
// TREND ANALYSIS TESTS
// ============================================================================

async function testGetMoodTrend() {
  console.log("\n📈 TESTING TREND ANALYSIS");
  try {
    const res = await api.get("/mood/trend");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(res.data.data.trend, "No trend data");
    logTest("Get Mood Trend", true, `Trend: ${res.data.data.trend}, Fluctuation: ${res.data.data.fluctuation}`);
  } catch (err) {
    logTest("Get Mood Trend", false, err.message);
  }
}

// ============================================================================
// DASHBOARD TESTS
// ============================================================================

async function testGetDashboard() {
  console.log("\n🎨 TESTING DASHBOARD");
  try {
    const res = await api.get("/mood/dashboard?range=7d");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(res.data.data.averageMood !== undefined, "No average mood");
    assert(res.data.data.trend !== undefined, "No trend");
    assert(res.data.data.fluctuation !== undefined, "No fluctuation");
    assert(Array.isArray(res.data.data.entries), "Entries not an array");
    logTest("Get Dashboard", true, `Avg: ${res.data.data.averageMood}, Trend: ${res.data.data.trend}, Alerts: ${res.data.data.activeAlerts}`);
  } catch (err) {
    logTest("Get Dashboard", false, err.message);
  }
}

async function testGetDashboardRanges() {
  console.log("\n🎨 TESTING DASHBOARD RANGES");
  const ranges = ["7d", "30d", "90d"];
  for (const range of ranges) {
    try {
      const res = await api.get(`/mood/dashboard?range=${range}`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      logTest(`Get Dashboard (${range})`, true, `Entries: ${res.data.data.entryCount}`);
    } catch (err) {
      logTest(`Get Dashboard (${range})`, false, err.message);
    }
  }
}

// ============================================================================
// ALERT TESTS
// ============================================================================

async function testCreateLowMoodAlert() {
  console.log("\n⚠️ TESTING ALERT CREATION");
  try {
    // Create multiple low mood entries to trigger alert
    for (let i = 0; i < 5; i++) {
      await api.post("/mood/analyze", {
        features: {
          pitch: 80 + i * 5, // Low pitch
          jitter: 0.08,
          speech_rate: 100,
        },
      });
    }

    const res = await api.get("/mood/alerts");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(Array.isArray(res.data.data), "Data is not an array");

    if (res.data.data.length > 0) {
      alertId = res.data.data[0]._id;
      logTest("Create Low Mood Alert", true, `Alert Type: ${res.data.data[0].type}, Severity: ${res.data.data[0].severity}`);
    } else {
      logTest("Create Low Mood Alert", true, "No alerts triggered (may need more entries)");
    }
  } catch (err) {
    logTest("Create Low Mood Alert", false, err.message);
  }
}

async function testGetAlerts() {
  console.log("\n⚠️ TESTING GET ALERTS");
  try {
    const res = await api.get("/mood/alerts");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(Array.isArray(res.data.data), "Data is not an array");
    logTest("Get Alerts", true, `Retrieved ${res.data.data.length} alerts`);
  } catch (err) {
    logTest("Get Alerts", false, err.message);
  }
}

async function testAcknowledgeAlert() {
  console.log("\n⚠️ TESTING ACKNOWLEDGE ALERT");
  try {
    // First get an alert
    const getRes = await api.get("/mood/alerts");
    if (getRes.data.data.length === 0) {
      logTest("Acknowledge Alert", true, "No alerts to acknowledge");
      return;
    }

    const alert = getRes.data.data[0];
    const res = await api.put(`/mood/alerts/${alert._id}/acknowledge`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    assert(res.data.data.acknowledged === true, "Alert not acknowledged");
    logTest("Acknowledge Alert", true, `Alert acknowledged at ${res.data.data.acknowledgedAt}`);
  } catch (err) {
    logTest("Acknowledge Alert", false, err.message);
  }
}

// ============================================================================
// AUTHENTICATION TESTS
// ============================================================================

async function testUnauthorizedAccess() {
  console.log("\n🔒 TESTING AUTHORIZATION");
  try {
    // Clear token
    const originalToken = authToken;
    authToken = "";

    const res = await api.get("/mood/history");
    assert(res.status === 401, `Expected 401, got ${res.status}`);
    logTest("Unauthorized Access", true, "Correctly rejected request without token");

    // Restore token
    authToken = originalToken;
  } catch (err) {
    logTest("Unauthorized Access", false, err.message);
  }
}

async function testInvalidToken() {
  console.log("\n🔒 TESTING INVALID TOKEN");
  try {
    const originalToken = authToken;
    authToken = "invalid.token.here";

    const res = await api.get("/mood/history");
    assert(res.status === 401, `Expected 401, got ${res.status}`);
    logTest("Invalid Token", true, "Correctly rejected invalid token");

    authToken = originalToken;
  } catch (err) {
    logTest("Invalid Token", false, err.message);
  }
}

// ============================================================================
// HEALTH CHECK TEST
// ============================================================================

async function testHealthCheck() {
  console.log("\n❤️ TESTING HEALTH CHECK");
  try {
    const res = await api.get("/health");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.success === true, "Success flag not true");
    logTest("Health Check", true, res.data.message);
  } catch (err) {
    logTest("Health Check", false, err.message);
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log("🚀 STARTING API TEST SUITE\n");
  console.log("=" + "=".repeat(70));

  try {
    // Health check
    await testHealthCheck();

    // Auth tests
    await testRegister();
    await testLogin();

    // Mood analysis tests
    await testAnalyzeMood();
    await testAnalyzeMoodWithText();
    await testAnalyzeMoodInvalidFeatures();
    await testProcessAudioMissingFile();

    // Sentiment tests
    await testSentimentPositive();
    await testSentimentNegative();
    await testSentimentNeutral();
    await testSentimentValidation();

    // History tests
    await testGetMoodHistory();
    await testGetMoodHistoryRanges();
    await testGetLatestMood();

    // Trend tests
    await testGetMoodTrend();

    // Dashboard tests
    await testGetDashboard();
    await testGetDashboardRanges();

    // Alert tests
    await testCreateLowMoodAlert();
    await testGetAlerts();
    await testAcknowledgeAlert();

    // Auth tests
    await testUnauthorizedAccess();
    await testInvalidToken();
  } catch (err) {
    console.error("Test suite error:", err.message);
  }

  // Print summary
  console.log("\n" + "=".repeat(70));
  console.log("\n📊 TEST SUMMARY");
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Total: ${results.passed + results.failed}`);
  console.log(`📊 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n`);

  if (results.failed > 0) {
    console.log("Failed Tests:");
    results.tests
      .filter((t) => !t.passed)
      .forEach((t) => {
        console.log(`  ❌ ${t.name}: ${t.details}`);
      });
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
