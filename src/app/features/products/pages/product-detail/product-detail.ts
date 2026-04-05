import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.model';
import { AiDescription } from '../../components/ai-description/ai-description';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AiDescription],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);

  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('Producto no valido.');
      this.loading.set(false);
      return;
    }

    this.productsService.getProductById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el detalle del producto.');
        this.loading.set(false);
      }
    });
  }
}