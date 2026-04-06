import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AiDescription } from './ai-description';
import { Product } from '../../../../core/models/product.model';
import { environment } from '../../../../../environments/environment';

describe('AiDescription', () => {
  let component: AiDescription;
  let fixture: ComponentFixture<AiDescription>;
  let httpMock: HttpTestingController;

  const product: Product = {
    id: 1,
    title: 'Auriculares inalámbricos',
    price: 59.5,
    description: 'Audio inalámbrico',
    category: 'Electrónica',
    image: 'test.jpg',
    rating: { rate: 4.6, count: 120 }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiDescription],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(AiDescription);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate AI description after clicking the button', () => {
    component.generateDescription();
    expect(component.loading()).toBe(true);

    const req = httpMock.expectOne(environment.aiDescriptionEndpoint);
    expect(req.request.method).toBe('POST');
    req.flush({ text: 'Descripcion generada por IA' });

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.generatedText().length).toBeGreaterThan(0);
    expect(component.generatedText()).toContain('Descripcion generada por IA');
    expect(component.error()).toBe('');
  });

  it('should use fallback description when backend fails', () => {
    component.generateDescription();

    const req = httpMock.expectOne(environment.aiDescriptionEndpoint);
    req.flush({ error: 'fallo' }, { status: 500, statusText: 'Server Error' });

    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.generatedText()).toContain('Auriculares inalámbricos');
    expect(component.generatedText()).toContain('Electrónica');
    expect(component.error()).toContain('descripción de respaldo');
  });
});