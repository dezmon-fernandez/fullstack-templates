import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <main class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold">Angular + Supabase</h1>
        <p class="mt-4 text-lg text-gray-600">Edit this template to get started.</p>
      </div>
    </main>
  `,
})
export class HomeComponent {}
