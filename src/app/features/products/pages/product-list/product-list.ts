import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private productsService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  searchTerm = signal('');
  selectedCategory = signal('all');
  priceSort = signal<'none' | 'asc' | 'desc'>('none');

  categories = computed(() => {
    const unique = new Set(this.products().map((product) => product.category));
    return [...unique].sort((a, b) => a.localeCompare(b));
  });

  filteredProducts = computed(() => {
    let result = [...this.products()];
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    const sort = this.priceSort();

    if (term) {
      result = result.filter((product) => product.title.toLowerCase().includes(term));
    }

    if (category !== 'all') {
      result = result.filter((product) => product.category === category);
    }

    if (sort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  });

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  updateCategory(value: string): void {
    this.selectedCategory.set(value);
  }

  updatePriceSort(value: 'none' | 'asc' | 'desc'): void {
    this.priceSort.set(value);
  }

  ngOnInit(): void {
    this.productsService.getProducts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos. Intenta nuevamente en unos minutos.');
        this.loading.set(false);
      }
    });
  }
}