import { Routes } from '@angular/router';
import { ProductList } from './features/products/pages/product-list/product-list';
import { ProductDetail } from './features/products/pages/product-detail/product-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail },
  { path: '**', redirectTo: 'products' }
];