#!/usr/bin/env bun
/**
 * Quick Build Script for HeartQuest
 * Builds web app + syncs Capacitor + creates APK in one command
 *
 * Usage:
 *   bun quick-build.ts           # Build debug APK
 *   bun quick-build.ts --install # Build and install to connected device
 *   bun quick-build.ts --watch   # Watch mode: rebuild on file changes
 */

import { $ } from "bun";
import { watch } from "fs";
import { existsSync } from "fs";
import { join } from "path";

const PROJECT_DIR = "/home/workspace/heartquest";
const OUTPUT_APK = "/home/workspace/heartquest-latest.apk";

async function build(install = false): Promise<boolean> {
  const startTime = Date.now();
  console.log("🔨 Building HeartQuest...\n");

  try {
    // Step 1: Build web app
    console.log("📦 Building web app...");
    await $`cd ${PROJECT_DIR} && bun run build`.quiet();
    console.log("   ✅ Web build complete");

    // Step 2: Sync Capacitor
    console.log("🔄 Syncing Capacitor...");
    await $`cd ${PROJECT_DIR} && npx cap sync android`.quiet();
    console.log("   ✅ Capacitor synced");

    // Step 3: Build APK
    console.log("🤖 Building Android APK...");
    const env = {
      JAVA_HOME: "/usr/lib/jvm/java-21-openjdk-amd64",
      ANDROID_HOME: "/opt/android-sdk",
    };
    await $`cd ${PROJECT_DIR}/android && ./gradlew assembleDebug`.env(env).quiet();
    console.log("   ✅ APK built");

    // Step 4: Copy to workspace
    const apkPath = join(PROJECT_DIR, "android/app/build/outputs/apk/debug/app-debug.apk");
    await $`cp ${apkPath} ${OUTPUT_APK}`;

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const size = ((await Bun.file(OUTPUT_APK).size) / 1024 / 1024).toFixed(1);
    console.log(`\n✨ Done in ${elapsed}s! APK: ${OUTPUT_APK} (${size} MB)`);

    // Step 5: Install to device if requested
    if (install) {
      console.log("\n📱 Installing to connected device...");
      const adbPath = "/opt/android-sdk/platform-tools/adb";

      // Check for devices
      const devices = await $`${adbPath} devices`.quiet().text();
      if (!devices.includes("\tdevice")) {
        console.log("   ❌ No device connected. Connect your phone via USB with USB debugging enabled.");
        return false;
      }

      await $`${adbPath} install -r ${OUTPUT_APK}`.quiet();
      console.log("   ✅ Installed! Check your device.");
    }

    return true;
  } catch (error) {
    console.error("❌ Build failed:", error);
    return false;
  }
}

// Parse args
const args = process.argv.slice(2);
const shouldInstall = args.includes("--install");
const shouldWatch = args.includes("--watch");

if (shouldWatch) {
  console.log("👀 Watch mode enabled. Press Ctrl+C to stop.\n");

  // Initial build
  build(shouldInstall);

  // Watch for changes
  let building = false;
  const srcDir = join(PROJECT_DIR, "src");

  watch(srcDir, { recursive: true }, async (event, filename) => {
    if (building || !filename) return;
    if (!filename.endsWith(".ts") && !filename.endsWith(".tsx") && !filename.endsWith(".css")) return;

    building = true;
    console.log(`\n📝 Change detected: ${filename}`);
    await build(shouldInstall);
    building = false;
  });
} else {
  build(shouldInstall);
}
