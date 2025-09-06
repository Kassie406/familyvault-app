import { supabase } from "./supabase";

// Helper function to ensure user has a profile and family assignment
export async function ensureProfile({ family_id = "fam_default" } = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  
  await supabase.from("profiles").upsert({
    id: user.id,
    family_id,
    name: user.email
  });
}

// Get the current user's family_id
async function getFamilyId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  
  const { data, error } = await supabase
    .from("profiles")
    .select("family_id")
    .eq("id", user.id)
    .single();
  
  if (error || !data) {
    // If no profile exists, create one with default family
    await ensureProfile();
    return "fam_default";
  }
  
  return data.family_id;
}

// Shared Lists API functions
export interface ListItem {
  id: string;
  text: string;
  assignee: string;
  due_date: string | null;
  done: boolean;
  created_at: string;
}

export async function loadItems(): Promise<ListItem[]> {
  const familyId = await getFamilyId();
  const { data, error } = await supabase
    .from("list_items")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function addItem({ text, assignee, due }: { text: string; assignee?: string; due?: string | null }): Promise<ListItem> {
  const familyId = await getFamilyId();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("list_items")
    .insert({
      family_id: familyId,
      user_id: user?.id,
      text,
      assignee: assignee || "Unassigned",
      due_date: due || null
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function toggleItem(id: string): Promise<ListItem> {
  const { data: current, error: fetchError } = await supabase
    .from("list_items")
    .select("done")
    .eq("id", id)
    .single();
  
  if (fetchError) throw fetchError;
  
  const { data, error } = await supabase
    .from("list_items")
    .update({ done: !current.done })
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase
    .from("list_items")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}

// Real-time subscription for list items
export function subscribeToListItems(familyId: string, callback: () => void) {
  const subscription = supabase
    .channel("lists")
    .on(
      "postgres_changes",
      { 
        event: "*", 
        schema: "public", 
        table: "list_items", 
        filter: `family_id=eq.${familyId}` 
      },
      callback
    )
    .subscribe();
  
  return () => supabase.removeChannel(subscription);
}