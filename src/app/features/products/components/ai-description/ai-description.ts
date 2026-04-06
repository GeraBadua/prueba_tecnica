import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';
import { Product } from '../../../../core/models/product.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ai-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-description.html',
  styleUrl: './ai-description.css'
})
export class AiDescription {
  @Input({ required: true }) product!: Product;

  private http = inject(HttpClient);

  loading = signal(false);
  generatedText = signal('');
  error = signal('');

  generateDescription(): void {
    this.loading.set(true);
    this.generatedText.set('');
    this.error.set('');

    const payload = { product: this.product };

    this.http.post<{ text: string }>(environment.aiDescriptionEndpoint, payload).pipe(timeout(10000)).subscribe({
      next: (response) => {
        this.generatedText.set(response.text);
        this.loading.set(false);
      },
      error: () => {
        this.generatedText.set(this.buildFallbackDescription(this.product));
        this.error.set('Se mostró una descripción de respaldo porque la IA no respondió.');
        this.loading.set(false);
      }
    });
  }

  private buildFallbackDescription(product: Product): string {
    return `${product.title} es una opción atractiva dentro de la categoría ${product.category}, con un enfoque en utilidad, valor y una experiencia positiva para el cliente.`;
  }
}