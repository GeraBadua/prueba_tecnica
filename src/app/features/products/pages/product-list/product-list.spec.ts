import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProductList } from './product-list';
import { ProductsService } from '../../../../core/services/products.service';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

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
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        {
          provide: ProductsService,
          useValue: {
            getProducts: () => of(mockProducts)
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
});