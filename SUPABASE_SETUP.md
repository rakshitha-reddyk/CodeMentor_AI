# 🚀 Supabase Setup & Troubleshooting

## Quick Fix: Enable RLS for Lessons Table

If the Learn page shows "Loading lessons..." indefinitely, the Supabase `lessons` table likely needs proper Row Level Security (RLS) policies.

### Run This in Supabase SQL Editor:

```sql
-- Enable RLS on lessons table
ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read lessons
CREATE POLICY "Allow public read access"
ON "public"."lessons"
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow authenticated users to insert lessons (optional, for seeding)
CREATE POLICY "Allow authenticated insert"
ON "public"."lessons"
FOR INSERT
TO authenticated
WITH CHECK (true);
```

## Verify It Works

1. Open Browser DevTools (F12 → Console tab)
2. Run: `checkSupabaseHealth()`
3. Check the output for any errors

Expected output:

```
✅ Lessons table readable
✅ Auth session (or ⚠️ anonymous access is OK)
```

## Common Issues

### Issue: "Policy violates RLS policy"

**Solution:** Run the SQL above to create read permissions

### Issue: "Lessons table does not exist"

**Solution:** Create the table:

```sql
CREATE TABLE IF NOT EXISTS "public"."lessons" (
  "id" BIGSERIAL PRIMARY KEY,
  "title" TEXT,
  "difficulty" TEXT,
  "content" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);
```

### Issue: Still seeing "Loading lessons..." after these fixes

1. Check browser console for specific error messages
2. Run `checkSupabaseHealth()` for detailed diagnostics
3. Make sure you're signed in (or anonymous access is enabled)

## Manual Testing

If you want to test directly in the database:

1. Go to Supabase Dashboard → SQL Editor
2. Run: `SELECT COUNT(*) FROM lessons;`
3. Should return a number > 0 if lessons were seeded

If count is 0, the lessons table is empty. The app will try to seed it automatically on first load.
