#!/usr/bin/env bun
/**
 * Build APK and publish to zo.pub
 * Returns the download URL for sharing
 *
 * Usage: bun build-and-publish.ts
 */

import { $ } from "bun";
import { join } from "path";

const PROJECT_DIR = "/home/workspace/heartquest";
const BUILD_DIR = "/home/workspace/heartquest-builds";
const APK_NAME = "heartquest.apk";

async function main() {
  console.log("🔨 Building HeartQuest APK...\n");

  // Step 1: Build web app
  console.log("📦 Building web app...");
  await $`cd ${PROJECT_DIR} && bun run build`.quiet();
  console.log("   ✅ Done");

  // Step 2: Sync Capacitor
  console.log("🔄 Syncing Capacitor...");
  await $`cd ${PROJECT_DIR} && npx cap sync android`.quiet();
  console.log("   ✅ Done");

  // Step 3: Build APK
  console.log("🤖 Building Android APK...");
  const env = {
    JAVA_HOME: "/usr/lib/jvm/java-21-openjdk-amd64",
    ANDROID_HOME: "/opt/android-sdk",
  };
  await $`cd ${PROJECT_DIR}/android && ./gradlew assembleDebug`.env(env).quiet();
  console.log("   ✅ Done");

  // Step 4: Copy to build directory
  console.log("📤 Publishing to zo.pub...");
  const apkPath = join(PROJECT_DIR, "android/app/build/outputs/apk/debug/app-debug.apk");

  // Create build dir and copy APK
  await $`mkdir -p ${BUILD_DIR}`;
  await $`cp ${apkPath} ${BUILD_DIR}/${APK_NAME}`;

  // Sync to zo.pub
  const result = await $`zopub sync heartquest ${BUILD_DIR}`.quiet().text();

  // Extract URL from output
  const url = "https://zo.pub/emidude/heartquest/heartquest.apk";
  console.log(`   ✅ Published!\n`);
  console.log(`📱 Download URL: ${url}`);

  return url;
}

main().catch(console.error);
