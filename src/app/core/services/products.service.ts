import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('assets/mock-products.json');
  }

  getProductById(id: number): Observable<Product> {
    return new Observable<Product>((observer) => {
      this.http.get<Product[]>('assets/mock-products.json').subscribe({
        next: (products) => {
          const product = products.find((p) => p.id === id);
          if (product) {
            observer.next(product);
            observer.complete();
          } else {
            observer.error(new Error('Producto no encontrado'));
          }
        },
        error: (err) => observer.error(err)
      });
    });
  }
}