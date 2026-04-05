import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../../../core/models/product.model';

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
    console.log('[AI Description] Iniciando solicitud...');
    this.loading.set(true);
    this.generatedText.set('');
    this.error.set('');

    const payload = { product: this.product };
    console.log('[AI Description] Payload enviado:', payload);

    this.http.post<{ text: string }>('http://localhost:3001/api/ai-description', payload).subscribe({
      next: (response) => {
        console.log('[AI Description] Respuesta recibida:', response);
        this.generatedText.set(response.text);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[AI Description] Error en la solicitud:', err);
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