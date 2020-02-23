import { Pipe, PipeTransform } from '@angular/core';
import { Incidencia } from '../model/Incidencia';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(incidencias: Incidencia[], texto: string): Incidencia[] {
    if(texto.length===0){
      return incidencias;
    }
    texto=texto.toLocaleLowerCase();
    return incidencias.filter(incidencia=>{
      return incidencia.nombre.includes(texto);
    });
    
  }

  

}
