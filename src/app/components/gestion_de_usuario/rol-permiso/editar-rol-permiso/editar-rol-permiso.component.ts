import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Rol, Permiso } from '../../../../models/models';
import { ServiceService } from '../../../../services/service.service';
import { ErrorComponent } from '../../../Mensajes/error/error.component';
import { OkComponent } from '../../../Mensajes/ok/ok.component';

@Component({
  selector: 'app-editar-rol-permiso',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorComponent,
    OkComponent,
  ],
  templateUrl: './editar-rol-permiso.component.html',
  styleUrl: './editar-rol-permiso.component.css',
})
export class EditarRolPermisoComponent implements OnInit {
  form: FormGroup;
  roles: Rol[] = [];
  permisos: Permiso[] = [];
  id!: number;

  mensajeExito: string = '';
  mensajeError: string = '';
  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      id: [null],
      rol: ['', Validators.required], // debe enviarse el ID
      permiso: ['', Validators.required], // debe enviarse el ID
    });
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.loadRoles();
    this.loadPermisos();
    this.loadRelacion();
  }

  loadRoles() {
    this.service.getRoles().subscribe((data) => (this.roles = data));
  }

  loadPermisos() {
    this.service.getPermisos().subscribe((data) => (this.permisos = data));
  }

  loadRelacion() {
    this.service.getRolPermisoID(this.id).subscribe((data) => {
      this.form.patchValue({
        id: data.id,
        rol: data.rol.id,
        permiso: data.permiso.id,
      });
    });
  }

  actualizar() {
    if (this.form.valid) {
      const formData = this.form.value;
      const rolId = formData.rol;
      const permisoId = formData.permiso;

      this.service.getRolPermiso().subscribe((data) => {
        const existe = data.some(
          (rp) =>
            rp.rol.id === rolId &&
            rp.permiso.id === permisoId &&
            rp.id !== this.id,
        );

        if (existe) {
          this.mensajeError = 'Ya existe otra relación con ese Rol y Permiso.';
        } else {
          this.service.updateRolPermiso(formData).subscribe({
            next: () => {
              this.mensajeExito = 'Rol-Permiso actualizado correctamente.';
            },
            error: () => {
              this.mensajeError = 'Error al actualizar el Rol-Permiso.';
            },
          });
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['app-panel-control/listar-rol-permiso']);
  }

  limpiarFormulario(): void {
    this.loadRelacion();
  }
  manejarOk() {
    this.mensajeExito = '';
    this.router.navigate(['app-panel-control/listar-rol-permiso']);
  }

  manejarError() {
    this.mensajeError = '';
  }
}
