// AI 한줄평 추천: 한국어 한 문장, 40자 이내. 키는 Supabase Secrets의 OPENROUTER_API_KEY에서만 읽는다.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

const MAX_LEN = 40;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const key = Deno.env.get("OPENROUTER_API_KEY");
  if (!key) return json({ error: "서버에 AI 키가 설정되지 않았어요." }, 500);

  let name = "", menu = "", rating = 0;
  try {
    const b = await req.json();
    name = String(b.name ?? "").trim().slice(0, 30);
    menu = String(b.menu ?? "").trim().slice(0, 30);
    rating = Number(b.rating) || 0;
  } catch {
    return json({ error: "잘못된 요청이에요." }, 400);
  }
  if (!name) return json({ error: "식당 이름이 필요해요." }, 400);

  const info = `식당: ${name}` + (menu ? `, 메뉴: ${menu}` : "") + (rating ? `, 별점: ${rating}/5` : "");
  const prompt =
    `다음 맛집에 대한 한줄평을 한국어 한 문장으로 써 주세요. ${MAX_LEN}자 이내, 따옴표·이모지·설명 없이 문장만 출력하세요.\n${info}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
      }),
    });
    if (!res.ok) return json({ error: `AI 요청 실패 (${res.status})` }, 502);
    const data = await res.json();
    let text: string = String(data?.choices?.[0]?.message?.content ?? "");
    // 첫 줄만, 감싼 따옴표 제거, 40자 이내로 자르기
    text = text.trim().split("\n")[0].trim().replace(/^["'“”‘’「]+|["'“”‘’」]+$/g, "").trim();
    if (!text) return json({ error: "AI가 빈 응답을 줬어요." }, 502);
    if ([...text].length > MAX_LEN) text = [...text].slice(0, MAX_LEN).join("");
    return json({ review: text });
  } catch {
    return json({ error: "AI 호출 중 오류가 났어요." }, 502);
  }
});
