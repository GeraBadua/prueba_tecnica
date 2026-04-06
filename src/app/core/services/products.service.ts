import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, switchMap, throwError, timeout } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private readonly remoteProductsUrl = environment.productsApiUrl;
  private readonly localProductsUrl = environment.localProductsUrl;

  private readonly products$ = this.http.get<Product[]>(this.remoteProductsUrl).pipe(
    timeout(5000),
    catchError(() => {
      if (!environment.enableProductsLocalFallback) {
        return throwError(() => new Error('No se pudieron cargar productos desde la API externa.'));
      }

      return this.http.get<Product[]>(this.localProductsUrl);
    }),
    shareReplay(1)
  );

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: number): Observable<Product> {
    return this.getProducts().pipe(
      map((products) => products.find((product) => product.id === id)),
      switchMap((product) => {
        if (product) {
          return of(product);
        }

        return throwError(() => new Error('Producto no encontrado'));
      })
    );
  }
}