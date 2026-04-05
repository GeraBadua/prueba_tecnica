import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AiDescription } from './ai-description';
import { Product } from '../../../../core/models/product.model';

describe('AiDescription', () => {
  let component: AiDescription;
  let fixture: ComponentFixture<AiDescription>;

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
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [AiDescription]
    }).compileComponents();

    fixture = TestBed.createComponent(AiDescription);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate AI description after clicking the button', async () => {
    component.generateDescription();
    expect(component.loading()).toBe(true);

    await vi.advanceTimersByTimeAsync(1200);
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.generatedText().length).toBeGreaterThan(0);
    expect(component.generatedText()).toContain('Auriculares inalámbricos');
    expect(component.generatedText()).toContain('Electrónica');
    expect(component.error()).toBe('');
  });
});