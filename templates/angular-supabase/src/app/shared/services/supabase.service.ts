import { Injectable, signal } from '@angular/core';
import { createClient, type SupabaseClient, type Session, type AuthChangeEvent } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  readonly session = signal<Session | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.supabase.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  authChanges(): Observable<{ event: AuthChangeEvent; session: Session | null }> {
    return new Observable((subscriber) => {
      const { data } = this.supabase.auth.onAuthStateChange((event, session) => {
        subscriber.next({ event, session });
      });

      return () => data.subscription.unsubscribe();
    });
  }

  signInWithPassword(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }
}
