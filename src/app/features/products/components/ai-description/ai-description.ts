import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  loading = signal(false);
  generatedText = signal('');
  error = signal('');

  generateDescription(): void {
    this.loading.set(true);
    this.generatedText.set('');
    this.error.set('');

    setTimeout(() => {
      try {
        const recommendation = this.buildDescription(this.product);
        this.generatedText.set(recommendation);
      } catch {
        this.error.set('No fue posible generar la descripción en este momento.');
      } finally {
        this.loading.set(false);
      }
    }, 1200);
  }

  private buildDescription(product: Product): string {
    const category = product.category.toLowerCase();
    const rating = product.rating?.rate ?? 0;
    const price = product.price;

    let categoryText = 'Este producto destaca por su utilidad y versatilidad en el día a día.';
    let priceText = 'Tiene una relación valor-precio equilibrada.';
    let ratingText = 'Puede ser una opción interesante para distintos perfiles de compra.';

    if (category.includes('elect')) {
      categoryText = 'Es una opción atractiva para quienes buscan funcionalidad, practicidad y una experiencia moderna.';
    } else if (category.includes('ropa') || category.includes('clothing')) {
      categoryText = 'Es una prenda pensada para combinar comodidad, estilo y uso cotidiano.';
    } else if (category.includes('calzado') || category.includes('shoe')) {
      categoryText = 'Está pensado para brindar comodidad, buen rendimiento y un estilo dinámico.';
    } else if (category.includes('access')) {
      categoryText = 'Es un accesorio útil que puede complementar muy bien diferentes necesidades y estilos.';
    }

    if (price < 25) {
      priceText = 'Su precio lo convierte en una alternativa accesible para quienes buscan una compra funcional sin gastar demasiado.';
    } else if (price < 70) {
      priceText = 'Se encuentra en un rango de precio medio que puede justificar su valor dependiendo del uso esperado.';
    } else {
      priceText = 'Se posiciona como una opción más premium, ideal para usuarios que priorizan prestaciones o diseño.';
    }

    if (rating >= 4.5) {
      ratingText = 'Además, su calificación alta sugiere una recepción muy positiva por parte de otros compradores.';
    } else if (rating >= 3.8) {
      ratingText = 'Su calificación indica una experiencia generalmente favorable y consistente para la mayoría de usuarios.';
    } else {
      ratingText = 'Aunque su calificación es más moderada, puede seguir siendo una compra adecuada si encaja con una necesidad específica.';
    }

    return `${product.title} pertenece a la categoría ${product.category}. ${categoryText} ${priceText} ${ratingText}`;
  }
}