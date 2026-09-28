import AppShell from "@/components/AppShell";
import { getContents } from "@/lib/content";
import { getIsAdmin } from "@/lib/admin";

// 內容可由調香師後台即時修改，每次請求都重新讀取
export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, isAdmin] = await Promise.all([
    getContents([
      "energyPhrases",
      "energyLink",
      "scentExploreLink",
      "masterPhotoUrl",
      "masterBio",
      "zodiacs",
      "quizQuestions",
    ]),
    getIsAdmin(),
  ]);
  return <AppShell content={content} isAdmin={isAdmin} />;
}
