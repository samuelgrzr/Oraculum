import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioPartidaComponent } from './inicio-partida.component';

describe('InicioPartidaComponent', () => {
  let component: InicioPartidaComponent;
  let fixture: ComponentFixture<InicioPartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioPartidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioPartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
