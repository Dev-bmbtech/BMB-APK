// Supabase Client Configuration
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/dist/umd/supabase.min.js';

// Get config from window (set in main.js)
const supabaseUrl = window.ENV?.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = window.ENV?.SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User Management Class
export class UserManager {
    constructor() {
        this.currentUser = null;
        this.session = null;
    }

    // Check if user is logged in
    async checkSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            
            this.session = session;
            if (session) {
                this.currentUser = session.user;
                await this.loadUserProfile();
            }
            return session;
        } catch (error) {
            console.error('Session check error:', error);
            return null;
        }
    }

    // Load user profile from database
    async loadUserProfile() {
        if (!this.currentUser) return null;
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            
            if (data) {
                this.currentUser.profile = data;
            } else {
                // Create profile if doesn't exist
                await this.createUserProfile();
            }
            return this.currentUser.profile;
        } catch (error) {
            console.error('Load profile error:', error);
            return null;
        }
    }

    // Create user profile
    async createUserProfile() {
        if (!this.currentUser) return null;
        
        const defaultProfile = {
            id: this.currentUser.id,
            email: this.currentUser.email,
            full_name: this.currentUser.user_metadata?.full_name || this.currentUser.email?.split('@')[0] || 'User',
            avatar_url: this.currentUser.user_metadata?.avatar_url || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .insert([defaultProfile])
                .select()
                .single();
            
            if (error) throw error;
            
            this.currentUser.profile = data;
            return data;
        } catch (error) {
            console.error('Create profile error:', error);
            return null;
        }
    }

    // Sign up with email
    async signUp(email, password, fullName) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });
            
            if (error) throw error;
            
            this.currentUser = data.user;
            this.session = data.session;
            await this.createUserProfile();
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign in with email
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            this.currentUser = data.user;
            this.session = data.session;
            await this.loadUserProfile();
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign in with Google
    async signInWithGoogle() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            
            if (error) throw error;
            return { success: true, url: data.url };
        } catch (error) {
            console.error('Google sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign out
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            this.currentUser = null;
            this.session = null;
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // Update profile
    async updateProfile(updates) {
        if (!this.currentUser) return { success: false, error: 'Not logged in' };
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.currentUser.id)
                .select()
                .single();
            
            if (error) throw error;
            
            this.currentUser.profile = data;
            return { success: true, profile: data };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: error.message };
        }
    }

    // Upload avatar
    async uploadAvatar(file) {
        if (!this.currentUser) return { success: false, error: 'Not logged in' };
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${this.currentUser.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        try {
            // Upload file
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);
            
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);
            
            // Update profile with avatar URL
            const result = await this.updateProfile({ avatar_url: publicUrl });
            
            return { success: true, avatar_url: publicUrl };
        } catch (error) {
            console.error('Avatar upload error:', error);
            return { success: false, error: error.message };
        }
    }

    // Save search history
    async saveSearchHistory(searchTerm) {
        if (!this.currentUser) return { success: false, error: 'Not logged in' };
        
        try {
            const { data, error } = await supabase
                .from('search_history')
                .insert([{
                    user_id: this.currentUser.id,
                    search_term: searchTerm,
                    created_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Save search error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get search history
    async getSearchHistory(limit = 10) {
        if (!this.currentUser) return { success: false, error: 'Not logged in', history: [] };
        
        try {
            const { data, error } = await supabase
                .from('search_history')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return { success: true, history: data || [] };
        } catch (error) {
            console.error('Get search history error:', error);
            return { success: false, error: error.message, history: [] };
        }
    }

    // Clear search history
    async clearSearchHistory() {
        if (!this.currentUser) return { success: false, error: 'Not logged in' };
        
        try {
            const { error } = await supabase
                .from('search_history')
                .delete()
                .eq('user_id', this.currentUser.id);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Clear search history error:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete single search history item
    async deleteSearchHistoryItem(id) {
        if (!this.currentUser) return { success: false, error: 'Not logged in' };
        
        try {
            const { error } = await supabase
                .from('search_history')
                .delete()
                .eq('id', id)
                .eq('user_id', this.currentUser.id);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Delete search history error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize user manager
export const userManager = new UserManager();

// Auth state listener
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            userManager.currentUser = session?.user || null;
            userManager.session = session;
            userManager.loadUserProfile().then(() => {
                callback('signed_in', userManager.currentUser);
            });
        } else if (event === 'SIGNED_OUT') {
            userManager.currentUser = null;
            userManager.session = null;
            callback('signed_out', null);
        }
    });
}
