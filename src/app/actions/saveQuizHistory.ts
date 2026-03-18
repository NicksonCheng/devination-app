"use server";

import { createClient } from "@/utils/supabase/server";

export type QuizType = "fragrance_lab" | "personality_quiz";

export async function saveQuizHistory(
  quiz_type: QuizType,
  result_data: Record<string, unknown>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only save when the user is logged in — silently skip otherwise
  if (!user) {
    return { success: false, error: "unauthenticated" };
  }

  const { error } = await supabase.from("quiz_history").insert({
    user_id: user.id,
    quiz_type,
    result_data,
  });

  if (error) {
    // Table doesn't exist yet — log but don't crash
    if (error.message.includes("quiz_history")) {
      console.warn("[saveQuizHistory] Table not found — run the SQL migration in Supabase Dashboard");
      return { success: false, error: "table_not_ready" };
    }
    console.error("[saveQuizHistory]", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
