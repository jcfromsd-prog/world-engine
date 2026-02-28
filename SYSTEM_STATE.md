# SYSTEM STATE

Last verified: 2026-02-28
Live Vercel URL: PENDING DEPLOYMENT
Live commit: dea0d988abc4967624f313415e5afeea0ceab8fb (Local HEAD pending push)

CONFIRMED WORKING:
✅ Onboarding → ASSESSMENT routing
✅ Graph bypass closed
✅ Briefing → Assessment → Mirror flow
✅ Grade-based difficulty initialization
❌ Submissions table writing on all answers (Blocked by schema mismatch on live DB)

KNOWN OPEN ISSUES:
⚠️ Schema conflict (`response_payload` and `is_diagnostic` missing from live Supabase DB `submissions` table)
⚠️ `reputation_ledger` upsert not fully verified due to RLS/schema limits
⚠️ Question bank has only 1 question per grade band
⚠️ Live UI does not dynamically generate contracts based on ZPD
