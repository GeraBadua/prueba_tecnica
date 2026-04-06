import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ProductList } from './product-list';
import { ProductsService } from '../../../../core/services/products.service';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let getProductsMock: ReturnType<typeof vi.fn>;

  const mockProducts = [
    {
      id: 1,
      title: 'Auriculares inalámbricos',
      price: 59.5,
      description: 'Audio inalámbrico',
      category: 'Electrónica',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 120 }
    },
    {
      id: 2,
      title: 'Mochila urbana impermeable',
      price: 34,
      description: 'Mochila práctica',
      category: 'Accesorios',
      image: 'test2.jpg',
      rating: { rate: 4.2, count: 80 }
    }
  ];

  beforeEach(async () => {
    getProductsMock = vi.fn(() => of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        {
          provide: ProductsService,
          useValue: {
            getProducts: getProductsMock
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render products from the service', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Auriculares inalámbricos');
    expect(compiled.textContent).toContain('Mochila urbana impermeable');
    expect(compiled.textContent).toContain('Electrónica');
    expect(compiled.textContent).toContain('Accesorios');
  });

  it('should filter products by search term', () => {
    component.updateSearchTerm('auriculares');
    fixture.detectChanges();

    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].title).toContain('Auriculares');

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Auriculares inalámbricos');
    expect(compiled.textContent).not.toContain('Mochila urbana impermeable');
  });

  it('should filter products by category', () => {
    component.updateCategory('Accesorios');
    fixture.detectChanges();

    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].category).toBe('Accesorios');
  });

  it('should sort products by price ascending', () => {
    component.updatePriceSort('asc');
    fixture.detectChanges();

    expect(component.filteredProducts()[0].price).toBe(34);
    expect(component.filteredProducts()[1].price).toBe(59.5);
  });

  it('should show empty state when filters return no products', () => {
    component.updateSearchTerm('producto-inexistente');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.filteredProducts().length).toBe(0);
    expect(compiled.textContent).toContain('No se encontraron productos con los filtros actuales.');
  });

  it('should show error state when products service fails', async () => {
    getProductsMock.mockReturnValue(throwError(() => new Error('Network error')));

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        {
          provide: ProductsService,
          useValue: {
            getProducts: getProductsMock
          }
        }
      ]
    }).compileComponents();

    const errorFixture = TestBed.createComponent(ProductList);
    errorFixture.detectChanges();

    const errorComponent = errorFixture.componentInstance;
    const compiled = errorFixture.nativeElement as HTMLElement;

    expect(errorComponent.loading()).toBe(false);
    expect(errorComponent.error()).toContain('No se pudieron cargar los productos');
    expect(compiled.textContent).toContain('No se pudieron cargar los productos');
  });
});