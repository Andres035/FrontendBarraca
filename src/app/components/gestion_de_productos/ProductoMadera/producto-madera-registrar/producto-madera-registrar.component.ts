import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { from } from 'rxjs';

import { Categoria, ProductoMadera, Sucursal } from '../../../../models/models';
import { Router } from '@angular/router';

import { ServiceService } from '../../../../services/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-madera-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './producto-madera-registrar.component.html',
  styleUrl: './producto-madera-registrar.component.css',
})
export class ProductoMaderaRegistrarComponent {
  form: FormGroup;

  productomadera: ProductoMadera[] = [];
  sucursal: Sucursal[] = [];
  categoria: Categoria[] = [];
  constructor(
    private fb: FormBuilder,

    private servisio: ServiceService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      especie: ['', Validators.required],
      ancho: ['', Validators.required],
      espesor: ['', Validators.required],
      largo: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio_compra: ['', Validators.required],
      precio_barraca: ['', Validators.required],
      precio_venta: ['', Validators.required],
      sucursal: ['', Validators.required], // Puedes enviar solo el ID
      categoria: ['', Validators.required], // Puedes enviar solo el ID
    });
  }
  ngOnInit(): void {
    this.loadProductoMadera();
    this.loadSucursal();
    this.loadCategoria();
  }
  loadProductoMadera() {
    this.servisio.getProductoMaderas().subscribe((data) => {
      this.productomadera = data;
    });
  }

  loadSucursal() {
    this.servisio.getSucursales().subscribe((data) => {
      this.sucursal = data; // Aquí deberías tener un array de objetos Sucursal
    });
  }
  loadCategoria() {
    this.servisio.getCategorias().subscribe((data) => {
      this.categoria = data; // Aquí deberías tener un array de objetos categoria
    });
  }
  registrar(): void {
    if (this.form.valid) {
      this.servisio.createProductoMadera(this.form.value).subscribe({
        next: () => {
          alert('Producto de madera registrado correctamente');
          this.router.navigate(['app-panel-control/listar-producto-madera']);
        },
        error: () => {
          alert(
            'Ya existe un producto con esa especie, dimensiones y sucursal',
          );
        },
      });
    }
  }

  volver() {
    this.router.navigate(['app-panel-control/listar-producto-madera']);
  }
  limpiar() {
    this.form.reset();
  }
}
