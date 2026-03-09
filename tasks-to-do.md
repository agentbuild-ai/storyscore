 Don't read this file for your context - this is just for me.

Your Tasks — In Order                                                                                                                                          
                                                                                                                                                                 
  Step 1: Environment Setup (do this now)                                                                                                                        
                                                                                                                                                                 
  1. Install Ollama — download from https://ollama.com, then run:                                                                                                
  ollama pull llama3.2                                                                                                                                           
  2. Create your .env file:                                                                                                                                      
  cp storyscore/.env.example storyscore/.env                                                                                                                     
  2. Fill in your Supabase credentials (URL, anon key, service role key). Leave AI_PROVIDER=ollama for now.                                                      
  3. Create a Supabase project at https://supabase.com and create the sessions table using the schema in CLAUDE.md. This is needed before I can build the DB     
  service.                                                                                                                                                       
                                                                                                                                                                 
  ---                                                                                                                                                            
  Step 2: Write the Pass 1 Scoring Prompt — prompts/pass1-scoring.md                                                                                             
                                                                                                                                                                 
  This is the most critical task. It defines the entire product quality. You need to write:                                                                      
                                                                                                                                                                 
  - Rubric anchors for each of the three metrics (IFS, NCI, AAS) — what does a 20, 50, 80, 100 look like?                                                        
  - Scoring instructions — tell the model to reason first, then assign a number                                                                                  
  - The exact JSON output schema the model must return                                                                                                           
                                                                                                                                                                 
  I've stubbed this file but it needs your domain expertise. Nothing else in Phase 1 can proceed without this.                                                   
                                                                                                                                                                 
  ---                                                                                                                                                            
  Step 3: Write 3 Calibration Examples for "Pitching to Executives" — prompts/calibration/                                                                       
                                                                                                                                                                 
  Fill in the three stub JSON files with:                                                                                                                        
  - A real text sample (~150–400 words) in the input field                                                                                                       
  - The scores you'd expect a good scorer to assign (IFS, NCI, AAS, overall)                                                                                     
                                                                                                                                                                 
  One strong example, one mid, one weak. These are used as few-shot examples in the prompt to anchor the model's scoring to your standard.                       
                                                                                                                                                                 
  ---                                                                                                                                                            
  Step 4: Write the Pass 2 Coaching Prompt — prompts/pass2-coaching.md                                                                                           
                                                                                                                                                                 
  After Pass 1 scores, this prompt receives those scores and generates coaching feedback. You need to define:                                                    
  - The tone and style of the coaching voice                                                                                                                     
  - What specific feedback elements you want (e.g. strengths, top 2 improvements, one rewrite suggestion)                                                        
  - The output JSON schema                                                                                                                                       
                                                                                                                                                                 
  ---                                                                                                                                                            
  Step 5: Write Remaining 6 Calibration Examples                                                                                                                 
                                                                                                                                                                 
  Two strong/mid/weak examples each for the other two scenarios:                                                                                                 
  - Talking to Your Manager                                                                                                                                      
  - Explaining to Stakeholders                                                                                                                                   
                                                                                                                                                                 
  ---                                                                                                                                                            
  Step 6: Beta Tester Selection (much later)                                                                                                                     
                                                                                                                                                                 
  Identify 15–20 beta users, plan how you'll onboard them and collect feedback. This only matters after everything is built and deployed.                        
                                                                                                                                                                 
  ---                                                                                                                                                            
  What I Handle (you don't touch)                                                                                                                                
                                                                                                                                                                 
  Everything else — the backend scoring engine, API routes, Supabase integration, all frontend screens, deployment config, and test harness. I'm blocked on Steps
   2–4 before I can build the scoring API, but I can start on the frontend screens (Steps 2.1–2.3) in parallel while you write prompts.                          
                                                                                                                                                                 
  Start with Step 1 today, then Step 2. That unblocks the most.  