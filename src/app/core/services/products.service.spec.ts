import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const remoteUrl = 'https://fakestoreapi.com/products';
  const localUrl = 'assets/mock-products.json';

  const mockRemoteProducts: Product[] = [
    {
      id: 1,
      title: 'Producto remoto',
      price: 120,
      description: 'Descripción remota',
      category: 'electronics',
      image: 'img.jpg',
      rating: { rate: 4.5, count: 10 }
    }
  ];

  const mockLocalProducts: Product[] = [
    {
      id: 2,
      title: 'Producto local',
      price: 99,
      description: 'Descripción local',
      category: 'local',
      image: 'img-local.jpg',
      rating: { rate: 4.2, count: 8 }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return products from FakeStore when remote call succeeds', () => {
    let result: Product[] | undefined;

    service.getProducts().subscribe((products) => {
      result = products;
    });

    const remoteReq = httpMock.expectOne(remoteUrl);
    expect(remoteReq.request.method).toBe('GET');
    remoteReq.flush(mockRemoteProducts);

    expect(result).toEqual(mockRemoteProducts);
  });

  it('should fallback to local products when FakeStore fails', () => {
    let result: Product[] | undefined;

    service.getProducts().subscribe((products) => {
      result = products;
    });

    const remoteReq = httpMock.expectOne(remoteUrl);
    remoteReq.flush({ error: 'network error' }, { status: 500, statusText: 'Server Error' });

    const localReq = httpMock.expectOne(localUrl);
    expect(localReq.request.method).toBe('GET');
    localReq.flush(mockLocalProducts);

    expect(result).toEqual(mockLocalProducts);
  });

  it('should return a product by id from cached source', () => {
    let result: Product | undefined;

    service.getProductById(1).subscribe((product) => {
      result = product;
    });

    const remoteReq = httpMock.expectOne(remoteUrl);
    remoteReq.flush(mockRemoteProducts);

    expect(result).toEqual(mockRemoteProducts[0]);
  });
});
