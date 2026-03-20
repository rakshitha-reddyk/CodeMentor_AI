import { supabase } from "@/integrations/supabase/client";

export async function checkSupabaseHealth() {
  console.log("🔍 Starting Supabase health check...");
  const results = {
    supabaseUrl: "https://pmdvdunlkphexfpyxwny.supabase.co",
    networkReachable: false,
    lessonsTableReadable: false,
    lessonsTableInsertable: false,
    authSession: false,
    errors: [] as string[],
  };

  // First, test basic network connectivity
  console.log("🌐 Testing network connectivity to Supabase...");
  try {
    const response = await fetch(results.supabaseUrl, { mode: "no-cors" });
    results.networkReachable = true;
    console.log("✅ Network reachable to Supabase domain");
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("❌ Cannot reach Supabase domain:", msg);
    results.errors.push(`Network unreachable: ${msg}`);
    console.warn(
      "   This could be due to: firewall, DNS issues, or internet connectivity",
    );
  }

  try {
    // Check if we can read from lessons table
    console.log("📖 Testing lessons table read access...");
    const { data: readData, error: readError } = await supabase
      .from("lessons")
      .select("id")
      .limit(1);

    if (readError) {
      console.error("❌ Read error:", readError);
      results.errors.push(`Read error: ${readError.message}`);
    } else {
      results.lessonsTableReadable = true;
      console.log(
        `✅ Can read from lessons table. Found ${readData?.length || 0} records`,
      );
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("❌ Read exception:", msg);
    results.errors.push(`Read exception: ${msg}`);
  }

  try {
    // Check current auth session
    console.log("👤 Checking auth session...");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      results.authSession = true;
      console.log("✅ Auth session found:", session.user.email);
    } else {
      console.log("⚠️  No auth session (anonymous access is OK)");
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("❌ Session check error:", msg);
    results.errors.push(`Session error: ${msg}`);
  }

  // Try to insert a test record (will fail if RLS blocks it, which is expected)
  try {
    console.log("✏️ Testing lessons table insert access...");
    const testLesson = {
      title: "Test Lesson",
      difficulty: "Beginner",
      content: "This is a test",
    };

    const { data: insertData, error: insertError } = await supabase
      .from("lessons")
      .insert([testLesson])
      .select()
      .single();

    if (insertError) {
      if (insertError.message.toLowerCase().includes("policy")) {
        console.log(
          "⚠️  RLS policy blocks anonymous insert (expected). Message:",
          insertError.message,
        );
      } else {
        console.error("❌ Insert error:", insertError);
        results.errors.push(`Insert error: ${insertError.message}`);
      }
    } else {
      results.lessonsTableInsertable = true;
      console.log("✅ Can insert into lessons table");

      // Delete the test record
      if (insertData?.id) {
        await supabase.from("lessons").delete().eq("id", insertData.id);
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("❌ Insert exception:", msg);
    results.errors.push(`Insert exception: ${msg}`);
  }

  console.log("\n📊 Health Check Results:");
  console.log(
    "  - Lessons table readable:",
    results.lessonsTableReadable ? "✅" : "❌",
  );
  console.log(
    "  - Lessons table insertable:",
    results.lessonsTableInsertable ? "✅" : "❌",
  );
  console.log("  - Auth session:", results.authSession ? "✅" : "⚠️");
  if (results.errors.length > 0) {
    console.log("  - Errors:");
    results.errors.forEach((err) => console.log(`    • ${err}`));
  }

  return results;
}

// Run health check on module load (visible in console)
if (typeof window !== "undefined") {
  // @ts-ignore
  window.checkSupabaseHealth = checkSupabaseHealth;
  console.log("💡 Run 'checkSupabaseHealth()' in console for diagnostics");
}
