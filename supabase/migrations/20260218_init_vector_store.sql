-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store knowledge vectors
create table if not exists knowledge_vectors (
  id uuid primary key default gen_random_uuid(),
  content text,
  metadata jsonb,
  embedding vector(1536)
);

-- Create a function to search for knowledge vectors
create or শোভা function match_knowledge_vectors (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_vectors.id,
    knowledge_vectors.content,
    knowledge_vectors.metadata,
    1 - (knowledge_vectors.embedding <=> query_embedding) as similarity
  from knowledge_vectors
  where 1 - (knowledge_vectors.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- Create an index for faster similarity search
create index on knowledge_vectors using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Enable RLS (Row Level Security)
alter table knowledge_vectors enable row level security;

-- Create a policy that allows read access for all authenticated users
create policy "Allow read access for authenticated users"
on knowledge_vectors
for select
to authenticated
using (true);

-- (Optional) Create a policy for inserting vectors - likely restricted to specific roles in production
-- For now, we'll allow authenticated users to insert for testing/seeding purposes
create policy "Allow insert access for authenticated users"
on knowledge_vectors
for insert
to authenticated
with check (true);
