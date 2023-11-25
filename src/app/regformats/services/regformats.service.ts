import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ArRegFormat } from '../../shared/models/arregformat.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import { element } from 'protractor';
//import { FORMERR } from 'dns';
import { UploadFileService } from '../../dynamicforms/services/upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class RegformatsService {

  constructor(private http: HttpClient, private uploadservice: UploadFileService) { }

  /* listByFilters(data: any): Observable<any[]> {
     const url = `${environment.urlBase}/question/id_sec/${idSec}/id_version/${idVersion}`;
    return this.http.get<Rspn<ActQues[]>>(url)
      .pipe(
        map(x => validate<ActQues[]>(x)
        ));
  }*/

  listByFilters(data: any): Observable<any[]> {
    // const url = `${environment.urlBase}/regformat/` + { params: { 'data{}': data } };
    const url = `${environment.urlBase}/regformat/${data}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  dataSectionReport(params: any): Observable<any[]> {
    // const url = `${environment.urlBase}/regformat/` + { params: { 'data{}': data } };

    const url = `${environment.urlBase}/regformat/parameters/`;
    return this.http.post<Rspn<any[]>>(url, params)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }
  // dataSectionReport(params: any): Observable<any[]> {
  //   // const url = `${environment.urlBase}/regformat/` + { params: { 'data{}': data } };
  //   console.log(params, 'parametrod e envio')
  //   const url = `${environment.urlBase}/regformat/parameters/${params}`;
  //   return this.http.get<Rspn<any[]>>(url)
  //     .pipe(
  //       map(x => validate<any[]>(x)
  //       ));
  // }

  getDataToReports(id_rf: number): Observable<any[]> {
    // const url = `${environment.urlBase}/regformat/` + { params: { 'data{}': data } };
    const url = `${environment.urlBase}/health/datasectionsreport/${id_rf}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  public generateExcelSGSST(dataHeader:any, dataCompanies: any, dataSQA:any, dataVersion:any) {
    console.log(dataHeader);   
    console.log(dataCompanies);   
    console.log(dataSQA);   

    //#region Parametros que traen la data a pintar en el excel
    let itemsStandars = []
    let answers = []
    let observations = []
    let contRow = 14
    let encabezado = []
    let datosHeader = []
    let datosHeader2 = []

    encabezado.push(dataVersion.codVersion)
    encabezado.push(dataVersion.version)
    let options = dataVersion.dateCreated.split('T');
    encabezado.push(options[0])

    let fechaFinal = options[0].split('-')

    datosHeader.push(dataCompanies.nameComp)
    datosHeader.push(dataCompanies.addressComp)
    datosHeader.push(dataCompanies.mainEconomicActivity)
    datosHeader.push(dataCompanies.secEconomicActivity)
    datosHeader.push(`Nivel ${dataCompanies.riskLvlComp}`)

    datosHeader2.push(dataCompanies.nitComp)
    datosHeader2.push(dataCompanies.numWorkplaces)
    datosHeader2.push(dataCompanies.numEmployeeDep)
    datosHeader2.push(dataCompanies.numEmployeeIndep)
    datosHeader2.push(dataCompanies.numEmployeeCont)

    dataSQA.forEach(element => {
        element.questions.forEach(elementos=>{
          let arr = elementos.name_ques.split('.')
          let calificacion = ''
          let hallazgo = ''
            calificacion = elementos.res_ques.name
            if (elementos.res_ques.observacion!='') {
              hallazgo = elementos.res_ques.observacion
            } else {
              hallazgo = ''
            }
          itemsStandars.push({value: arr[3], row: contRow, column:7})
          answers.push({value: calificacion, row: contRow, cal: elementos.item_value})
          observations.push({value: hallazgo, row: contRow, column:15})
          contRow++ 
        })
      });
    

    //#endregion
    //Excel Title, Header, Data
    const title = 'EVALUACIÓN EN EL SISTEMA DE GESTION DE SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST) RESOLUCIÓN 1111/2017';
    const note = 'Marque con "X" si cumple totalmente o no cumple, en caso de no aplicar marque con una "X" si se justifica o no se justifica. (X en mayuscula)'
    const header = [
    {orientation:true, value:'CICLO', row:12, column:1},
    {orientation:false, value:'ESTANDAR', row:12, column:2},
    {orientation:false, value:'ITEM DEL ESTANDAR', row:12, column:4},
    {orientation:false, value:'VALOR ITEM', row:12, column:8},
    {orientation:false, value:'PESO %', row:12, column:9},
    {orientation:false, value:'CUMPLE TOTALMENTE', row:12, column:10},
    {orientation:false, value:'NO CUMPLE', row:12, column:11},
    {orientation:false, value:'NO APLICA', row:12, column:12},
    {orientation:false, value:'JUSTIFICA', row:13, column:12},
    {orientation:false, value:'NO JUSTIFICA', row:13, column:13},
    {orientation:false, value:'CALIFICACIÓN', row:12, column:14},
    {orientation:false, value:'HALLAZGO', row:12, column:15}
    ]
    let contDataCompany = 0
    const dataCompany = ['Razon social de la empresa:','Dirección:','Actividad económica principal:',
    'Actividad económica secundaria:','Nivel de riesgo por ARL:']
    let contDataCompany2 = 0
    const dataCompany2 = ['NIT/CC:','Sucursales:','No. trabajadores dependientes:',
    'No. trabajadores independientes:','No. trabajadores de contratistas:']
    let contDataFormat = 0
    const dataFormat = ['Código:', 'Versión:', 'Fecha:']
    const superSection = [{row:14,value:'I. PLANEAR'},
    {row:36,value:'II. HACER                                                                                                       II. HACER'},
    {row:66,value:'III. VERIFICAR'},{row:70,value:'IV. ACTUAR'}]
    const sections = [
      {value:'RECURSOS (10%)', row:14},
      {value:'GESTIÓN INTEGRAL DEL SISTEMA DE GESTIÓN DE LA SEGURIDAD Y SALUD EN EL TRABAJO (15%)', row:25},
      {value:'GESTIÓN DE LA SALUD (20%)', row:36},
      {value:'GESTIÓN DE PELIGROS Y RIESGOS (30%)', row:54},
      {value:'GESTIÓN DE AMENAZAS (10%)', row:64},
      {value:'VERIFICACIÓN DEL SG-SST (5%)', row:66},
      {value:'MEJORAMIENTO (10%)', row:70},
    ]
    const subSections = [
        {value:'Recursos financieros, técnicos, humanos y de otra indole requeridos para coordinar y desarrollar el SG-SST (4%)', row:14, column:3},
        {value:'Capacitación en el SG-SST (6%)', row:22, column:3},
        {value:'Política de Seguridad y Salud en el Trabajo (1%)', row:25, column:3},
        {value:'Objetivos del SG-SST (1%)', row:26, column:3},
        {value:'Evaluación inicial del SG-SST (1%)', row:27, column:3},
        {value:'Plan Anual de Trabajo (2%)', row:28, column:3},
        {value:'Conservación de la documentación (2%)', row:29, column:3},
        {value:'Rendición de cuentas (1%)', row:30, column:3},
        {value:'Normatividad Nacional vigente y aplicable en materia de seguridad y salud en el trabajo (2%)', row:31, column:3},
        {value:'Comunicación (1%)', row:32, column:3},
        {value:'Adquisiciones (1%)', row:33, column:3},
        {value:'Contratación (2%)', row:34, column:3},
        {value:'Gestión del cambio (1%)', row:35, column:3},
        {value:'Condiciones de salud en el trabajo (9%)', row:36, column:3},
        {value:'Registro reporte e investigación de las enfermedades laborales, los incidentes y accidentes del trabajo (5%)', row:45, column:3},
        {value:'Mecánismos de vigilancia de las condiciones de salud de los trabajadores (6%)', row:48, column:3},
        {value:'Identificación de peligros, evaluación y valoración de los riesgos (15%)', row:54, column:3},
        {value:'Medidas de prevención y control para intervenir los peligros/riesgos (15%)', row:58, column:3},
        {value:'Plan de prevención, preparación y respuesta ante emergencias (10%)', row:64, column:3},
        {value:'Gestión y resultados del SG-SST (5%)', row:66, column:3},
        {value:'Acciones preventivas y correctivas con base en los resultados del SG-SST (10%)', row:70, column:3},
        {value:'4', row:14, column:9},
        {value:'6', row:22, column:9},
        {value:'15', row:25, column:9},
        {value:'9', row:36, column:9},
        {value:'5', row:45, column:9},
        {value:'6', row:48, column:9},
        {value:'15', row:54, column:9},
        {value:'15', row:58, column:9},
        {value:'10', row:64, column:9},
        {value:'5', row:66, column:9},
        {value:'10', row:70, column:9},
    ]
    const peso = [
      {value:4, row:14},
      {value:6, row:22},
      {value:15, row:25},
      {value:9, row:36},
      {value:5, row:45},
      {value:6, row:48},
      {value:15, row:54},
      {value:15, row:58},
      {value:10, row:64},
      {value:5, row:66},
      {value:10, row:70},
    ]
    const result = [
      {value:'Fecha evaluación (dd/mm/aaaa)', row:74, column:8},
      {value:fechaFinal[2], row:74, column:10},
      {value:fechaFinal[1], row:74, column:11},
      {value:fechaFinal[0], row:74, column:12},
      {value:'TOTAL', row:74, column:13},
      {value:'', row:74, column:14},
      {value:'Resultado', row:75, column:8},
      {value:'', row:75, column:10},
    ]
    const footer =[
      {value:'FIRMA DEL EMPLEADOR O CONTRATANTE', row:82, column:1},
      {value:'', row:83, column:1},
      {value:'FIRMA DEL RESPONSABLE DE LA EJECUCIÓN DEL SG-SST', row:82, column:8},
      {value:'', row:83, column:8},
    ]
    const merges = [
      {merge:'A1:C3'},
      {merge:'D1:M3'},
      {merge:'A11:N11'},
      {merge:'A14:A35'},
      {merge:'A36:A65'},
      {merge:'A66:A69'},
      {merge:'A70:A73'},
      {merge:'A12:A13'},
      {merge:'B12:C13'},
      {merge:'D12:G13'},
      {merge:'H12:H13'},
      {merge:'I12:I13'},
      {merge:'J12:J13'},
      {merge:'K12:K13'},
      {merge:'L12:M12'},
      {merge:'N12:N13'},
      {merge:'O12:O13'},
      {merge:'B14:B24'},
      {merge:'B25:B35'},
      {merge:'B36:B53'},
      {merge:'B54:B63'},
      {merge:'B64:B65'},
      {merge:'B66:B69'},
      {merge:'B70:B73'},
      {merge:'C14:C21'},
      {merge:'C22:C24'},
      {merge:'C36:C44'},
      {merge:'C45:C47'},
      {merge:'C48:C53'},
      {merge:'C54:C57'},
      {merge:'C58:C63'},
      {merge:'C64:C65'},
      {merge:'C66:C69'},
      {merge:'C70:C73'},
      {merge:'I14:I21'},
      {merge:'I22:I24'},
      {merge:'I25:I35'},
      {merge:'I36:I44'},
      {merge:'I45:I47'},
      {merge:'I48:I53'},
      {merge:'I54:I57'},
      {merge:'I58:I63'},
      {merge:'I64:I65'},
      {merge:'I66:I69'},
      {merge:'I70:I73'},
      {merge:'A74:B74'},
      {merge:'A75:B75'},
      {merge:'A76:B76'},
      {merge:'H74:I74'},
      {merge:'H75:I75'},
      {merge:'J75:N75'},
      {merge:'A78:N78'},
      {merge:'A79:N79'},
      {merge:'A80:N80'},
      {merge:'A82:C82'},
      {merge:'H82:M82:'},
      {merge:'A83:F83'},
      {merge:'H83:N83'},
    ]

    //Crear workbook y hoja (worksheet)
    const workbook = new Workbook();

    this.uploadservice.dowloadFile(dataCompanies.logoComp).then(res=>{
        const worksheet = workbook.addWorksheet('Evaluación SGSST',{
          pageSetup:{fitToPage:true,fitToHeight:1,fitToWidth:1}
        });
    
    
        worksheet.pageSetup.printArea = 'A1:O83'
    
        //#region configurar ancho de columnas y combinaciones de celdas
         //#region Ancho de las columnas desde la A - O
         worksheet.getColumn(1).width = 5;
         worksheet.getColumn(2).width = 5;
         worksheet.getColumn(3).width = 30;
         worksheet.getColumn(4).width = 5;
         worksheet.getColumn(5).width = 5;
         worksheet.getColumn(6).width = 5;
         worksheet.getColumn(7).width = 30;
         worksheet.getColumn(8).width = 10;
         worksheet.getColumn(9).width = 10;
         worksheet.getColumn(10).width = 10;
         worksheet.getColumn(11).width = 10;
         worksheet.getColumn(12).width = 10;
         worksheet.getColumn(13).width = 10;
         worksheet.getColumn(14).width = 15;
         worksheet.getColumn(15).width = 30;
         //#endregion
    
         //Combinaciones de celdas, estilos, bordes y asignación de titulos a estas mismas
    
         merges.forEach(element => {
            worksheet.mergeCells(element.merge); 
         });
    
         //bordes de la celda de la imagen
         const imageRow = worksheet.getRow(1);
         imageRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         imageRow.commit();
    
         //#region exceljs
         //nota, indicación para el formato
         const noteRow = worksheet.getRow(11);
         noteRow.getCell(1).alignment = { vertical: 'middle', wrapText: true };
         noteRow.getCell(1).value = note;
         noteRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
         noteRow.commit();
         noteRow.font = { name: 'Calibri', family: 4, size: 10 }
    
         const iterateRow = worksheet.getRow(74);
         iterateRow.height = 30
         iterateRow.commit();
    
         for (let index = 1; index <= dataFormat.length; index++) {
          const iterateRow = worksheet.getRow(index);
          iterateRow.height = 30
          iterateRow.getCell(14).alignment = { vertical: 'middle', wrapText: true };
          iterateRow.getCell(14).value = dataFormat[contDataFormat];
          iterateRow.getCell(14).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.font = { name: 'Calibri', family: 4, size: 10}
          iterateRow.commit();
          contDataFormat += 1
         }
    
         for (let index = 1; index <= dataFormat.length; index++) {
          const iterateRow = worksheet.getRow(index);      
          iterateRow.getCell(15).alignment = { vertical: 'middle', wrapText: true };
          iterateRow.getCell(15).value = encabezado[index-1];
          iterateRow.getCell(15).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.font = { name: 'Calibri', family: 4, size: 10, bold: true }
          iterateRow.commit();
          contDataFormat += 1
         }
    
         for (let index = 5; index <= 9; index++) {
          worksheet.mergeCells(`A${index}:C${index}`);
          const iterateRow = worksheet.getRow(index);
          iterateRow.getCell(1).value = dataCompany[contDataCompany];
          iterateRow.getCell(1).alignment = { vertical: 'middle'}
          iterateRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'bfbfbf' }
          }
          iterateRow.font = { name: 'Calibri', family: 4, size: 10, bold: true }
          iterateRow.commit();
          contDataCompany += 1
         }
    
         for (let index = 5; index <= 9; index++) {
          worksheet.mergeCells(`D${index}:I${index}`);
          const iterateRow = worksheet.getRow(index);
          iterateRow.getCell(4).value = datosHeader[index-5];
          iterateRow.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.font = { name: 'Calibri', family: 4, size: 10}
          iterateRow.commit();
         }
    
         for (let index = 5; index <= 9; index++) {
          if (index == 5 || index == 6) {
            worksheet.mergeCells(`J${index}:K${index}`);
          }else{
            worksheet.mergeCells(`J${index}:M${index}`);
          }
          const iterateRow = worksheet.getRow(index);
          iterateRow.getCell(10).value = dataCompany2[contDataCompany2];
          iterateRow.getCell(10).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.getCell(10).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'bfbfbf' }
          }
          iterateRow.font = { name: 'Calibri', family: 4, size: 10, bold: true }
          iterateRow.commit();
          contDataCompany2 += 1
         }
    
         for (let index = 5; index <= 9; index++) {
          const iterateRow = worksheet.getRow(index);
          if (index == 5 || index == 6) {
            worksheet.mergeCells(`L${index}:N${index}`);
            iterateRow.getCell(12).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            iterateRow.getCell(12).value = datosHeader2[index-5];
          }      
          iterateRow.getCell(14).value = datosHeader2[index-5];
          iterateRow.getCell(14).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.font = { name: 'Calibri', family: 4, size: 10}
          iterateRow.commit();
         }
    
         header.forEach(element => {
          const iterateRow = worksheet.getRow(element.row);
          iterateRow.getCell(element.column).value = element.value;
          if (element.orientation) {
            iterateRow.getCell(element.column).alignment = { vertical: 'middle', horizontal: 'center', textRotation: 90 , wrapText: true}
          } else {
            iterateRow.getCell(element.column).alignment = { vertical: 'middle', horizontal: 'center',  wrapText: true}
          }
          iterateRow.getCell(element.column).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'bfbfbf' }
          }
          iterateRow.getCell(element.column).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.font = { name: 'Calibri', family: 4, size: 10, bold: true}
          iterateRow.commit();
         });
    
         superSection.forEach(element => {
          const iterateRow = worksheet.getRow(element.row);
          iterateRow.getCell(1).value = element.value;
          iterateRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center', textRotation: 90 , wrapText: true}
          iterateRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.font = { name: 'Calibri', family: 4, size: 11, bold: true}
          iterateRow.commit();
         });
    
         sections.forEach(element => {
          const iterateRow = worksheet.getRow(element.row);
          iterateRow.getCell(2).value = element.value;
          iterateRow.getCell(2).alignment = { vertical: 'middle', horizontal: 'center', textRotation: 90 , wrapText: true}
          iterateRow.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.font = { name: 'Calibri', family: 4, size: 11, bold: true}
          iterateRow.commit();
         });
    
         subSections.forEach(element => {
          const iterateRow = worksheet.getRow(element.row);
          iterateRow.getCell(element.column).value = element.value;
          iterateRow.getCell(element.column).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true}
          iterateRow.getCell(element.column).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.font = { name: 'Calibri', family: 4, size: 11}
          iterateRow.commit();
         });
    
         itemsStandars.forEach(element=>{
          const iterateRow = worksheet.getRow(element.row);
          iterateRow.getCell(element.column).value = element.value;
          iterateRow.getCell(element.column).alignment = { vertical: 'middle', wrapText: true}
          iterateRow.getCell(element.column).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.font = { name: 'Calibri', family: 4, size: 11}
          iterateRow.commit();
         })
    
          let total = 0
         answers.forEach(element=>{
          const iterateRow = worksheet.getRow(element.row);
           switch (element.value) {
             case 'CUMPLE TOTAL-MENTE':
              iterateRow.getCell(10).value = 'X';
              iterateRow.getCell(14).value = element.cal;
              total+= element.cal
               break;
             case 'NO CUMPLE':
              iterateRow.getCell(11).value = 'X';
              iterateRow.getCell(14).value = 0;
               break;
             case 'NO APLICA-JUSTIFICA':
              iterateRow.getCell(12).value = 'X';
              iterateRow.getCell(14).value = element.cal;
              total+= element.cal
               break;
             case 'NO APLICA-NO JUSTIFICA':
              iterateRow.getCell(13).value = 'X';
              iterateRow.getCell(14).value = 0;
               break;
           }
           iterateRow.font = { name: 'Calibri', family: 4, size: 11}
           iterateRow.commit();
         })
    
         observations.forEach(element=>{
          const iterateRow = worksheet.getRow(element.row);
          iterateRow.getCell(element.column).value = element.value;
          iterateRow.getCell(element.column).alignment = { vertical: 'middle', wrapText: true}
          iterateRow.font = { name: 'Calibri', family: 4, size: 11}
          iterateRow.commit();
         })
    
         peso.forEach(element=>{
          const iterateRow = worksheet.getRow(element.row);
          iterateRow.getCell(9).value = element.value;
          iterateRow.getCell(9).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true}
          iterateRow.getCell(9).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iterateRow.font = { name: 'Calibri', family: 4, size: 11}
          iterateRow.commit();
         })
    
         const iterateRow1 = worksheet.getRow(74);
         const iterateRow2 = worksheet.getRow(75);
         
         result.forEach(element => {
          const iterateRow = worksheet.getRow(element.row);
          if ((element.column == 10 && element.row == 75)) {
            if (total >= 0 && total <= 60) {
              iterateRow2.getCell(10).value = 'Critico';
            } else if (total >= 61 && total <= 85) {
              iterateRow2.getCell(10).value = 'Moderadamente aceptable';
            }else if (total >= 86 && total <= 100) {
              iterateRow2.getCell(10).value = 'Aceptable';
           }
          }else{
            iterateRow.getCell(element.column).value = element.value;
          }
          iterateRow.getCell(element.column).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true}
          iterateRow.getCell(element.column).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          if ((element.column == 8 && element.row == 74) || (element.column == 13 && element.row == 74) || (element.column == 8 && element.row == 75) || (element.column == 10 && element.row == 75)) {
            iterateRow.getCell(element.column).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'd9d9d9' }
            }
            iterateRow.font = { name: 'Calibri', family: 4, size: 11, bold: true}
          }else if (element.column == 14 && element.row == 74){
            if (total >= 0 && total <= 60) {
              iterateRow1.getCell(14).value = total;
              iterateRow1.getCell(14).fill = {
               type: 'pattern',
               pattern: 'solid',
               fgColor: { argb: 'ff0000' }
             }
            } else if (total >= 61 && total <= 85) {
              iterateRow1.getCell(14).value = total;
              iterateRow1.getCell(14).fill = {
               type: 'pattern',
               pattern: 'solid',
               fgColor: { argb: 'ffc000' }
             } 
            }else if (total >= 86 && total <= 100) {
              iterateRow1.getCell(14).value = total;
              iterateRow1.getCell(14).fill = {
               type: 'pattern',
               pattern: 'solid',
               fgColor: { argb: '00b050' }
             }
           }
          }else{
            iterateRow.font = { name: 'Calibri', family: 4, size: 11}
          }
          iterateRow.commit();
         });
    
         footer.forEach(element => {
          const iterateRow = worksheet.getRow(element.row);
          iterateRow.getCell(element.column).value = element.value;
          iterateRow.getCell(element.column).alignment = { vertical: 'middle', wrapText: true}
          if (element.row == 83) {
            iterateRow.height = 60
          }
          if (element.value == '' ) { 
            iterateRow.getCell(element.column).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          }else{
            iterateRow.font = { name: 'Calibri', family: 4, size: 11, bold: true}
          }
          iterateRow.commit();
         });
    
         //#endregion
    
         let cont = 1, cont2 = 1, cont3 = 1, cont4 = 1, cont5 = 1,
          cont6 = 1, cont7 = 1, cont8 = 1, cont9 = 1, cont10 = 1, cont11 = 1
         for (let index = 14; index <= 73; index++) {
           worksheet.mergeCells(`D${index}:F${index}`)
           const iteratorRow = worksheet.getRow(index);
           iteratorRow.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           iterateRow.getCell(4).alignment = { vertical: 'middle', horizontal: 'center'}
           if (index >= 14 && index <= 21) {
            iteratorRow.getCell(4).value = `1.1.${cont}.`
            cont++
           }else if (index >= 22 && index <= 24) {
            iteratorRow.getCell(4).value = `1.2.${cont2}.`
            cont2++
           }else if (index >= 25 && index <= 35) {
            iteratorRow.getCell(4).value = `2.${cont3}.1.`
            cont3++
           }else if (index >= 36 && index <= 44) {
            iteratorRow.getCell(4).value = `3.1.${cont4}.`
            cont4++
           }else if (index >= 45 && index <= 47) {
            iteratorRow.getCell(4).value = `3.2.${cont5}.`
            cont5++
           }else if (index >= 48 && index <= 53) {
            iteratorRow.getCell(4).value = `3.3.${cont6}.`
            cont6++
           }else if (index >= 54 && index <= 57) {
            iteratorRow.getCell(4).value = `4.1.${cont7}.`
            cont7++
           }else if (index >= 58 && index <= 63) {
            iteratorRow.getCell(4).value = `4.2.${cont8}.`
            cont8++
           }else if (index >= 64 && index <= 65) {
            iteratorRow.getCell(4).value = `5.1.${cont9}.`
            cont9++
           }else if (index >= 66 && index <= 69) {
            iteratorRow.getCell(4).value = `6.1.${cont10}.`
            cont10++
           }else if (index >= 70 && index <= 73) {
            iteratorRow.getCell(4).value = `7.1.${cont11}.`
            cont11++
           }
           iteratorRow.commit();
         }
    
         for (let index = 14; index <= 73; index++) {
           const iteratorRow = worksheet.getRow(index);
           iteratorRow.getCell(8).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
           iteratorRow.getCell(8).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
           if (index >= 14 && index <= 21) {
            iteratorRow.getCell(8).value = '0,5'
           }else if ((index >= 22 && index <= 24)||(index >= 28 && index <= 29)||(index == 31)||(index == 34)||(index >= 45 && index <= 46)) {
            iteratorRow.getCell(8).value = '2'
           }else if ((index >= 25 && index <= 27)||(index == 30)||(index >= 32 && index <= 33)||(index >= 35 && index <= 44)||(index >= 47 && index <= 53)) {
            iteratorRow.getCell(8).value = '1'
           }else if ((index >= 54 && index <= 55)||(index == 57)) {
            iteratorRow.getCell(8).value = '4'
           }else if (index == 56) {
            iteratorRow.getCell(8).value = '3'
           }else if ((index >= 58 && index <= 63)||(index >= 70 && index <= 73)) {
            iteratorRow.getCell(8).value = '2,5'
           }else if (index >= 64 && index <= 65) {
            iteratorRow.getCell(8).value = '5'
           }else if (index >= 66 && index <= 69) {
            iteratorRow.getCell(8).value = '1,25'
           }
           iteratorRow.commit();
         }
    
         for (let index = 14; index <= 73; index++) {
          const iteratorRow = worksheet.getRow(index);
          iteratorRow.getCell(10).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iteratorRow.getCell(10).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          iteratorRow.getCell(10).font = { name: 'Calibri', family: 4, size: 11}
          iteratorRow.getCell(10).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd9d9d9' }
          }
          iteratorRow.getCell(11).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iteratorRow.getCell(11).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          iteratorRow.getCell(11).font = { name: 'Calibri', family: 4, size: 11}
          iteratorRow.getCell(11).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd9d9d9' }
          }
          iteratorRow.getCell(12).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iteratorRow.getCell(12).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          iteratorRow.getCell(12).font = { name: 'Calibri', family: 4, size: 11}
          iteratorRow.getCell(12).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ddd9c4' }
          }
          iteratorRow.getCell(13).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iteratorRow.getCell(13).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          iteratorRow.getCell(13).font = { name: 'Calibri', family: 4, size: 11}
          iteratorRow.getCell(13).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ddd9c4' }
          }
          iteratorRow.getCell(14).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iteratorRow.getCell(14).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          iteratorRow.getCell(14).font = { name: 'Calibri', family: 4, size: 11}
          iteratorRow.getCell(15).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          iteratorRow.getCell(15).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          iteratorRow.getCell(15).font = { name: 'Calibri', family: 4, size: 11}
          
          iteratorRow.commit();
        }
    
        for (let index = 74; index <= 76; index++) {
          const iteratorRow = worksheet.getRow(index);
          iteratorRow.getCell(1).font = { name: 'Calibri', family: 4, size: 11}
          iteratorRow.getCell(5).value = '-'
          iteratorRow.getCell(3).alignment = { vertical: 'middle', wrapText: true };
          iteratorRow.getCell(4).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          iteratorRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          iteratorRow.getCell(6).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          switch (index) {
            case 74:
              iteratorRow.getCell(3).value = 'Critico'
              iteratorRow.getCell(4).value = '0'
              iteratorRow.getCell(6).value = '60'
              iteratorRow.getCell(6).border = { top: { style: 'thin' }, right: { style: 'thin' } }
              iteratorRow.getCell(1).border = { left: { style: 'thin' }}
              iteratorRow.getCell(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ff0000' }
              }
              break;
            case 75:
              iteratorRow.getCell(3).value = 'Moderadamente aceptable'
              iteratorRow.getCell(4).value = '61'
              iteratorRow.getCell(6).value = '85'
              iteratorRow.getCell(6).border = { right: { style: 'thin' } }
              iteratorRow.getCell(1).border = { left: { style: 'thin' }}
              iteratorRow.getCell(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffc000' }
              } 
              break;
            case 76:
              iteratorRow.getCell(3).value = 'Aceptable'
              iteratorRow.getCell(4).value = '86'
              iteratorRow.getCell(6).value = '100'
              iteratorRow.getCell(1).border = { bottom: { style: 'thin' }, left: { style: 'thin' } }
              iteratorRow.getCell(3).border = { bottom: { style: 'thin' }}
              iteratorRow.getCell(4).border = { bottom: { style: 'thin' }}
              iteratorRow.getCell(5).border = { bottom: { style: 'thin' }}
              iteratorRow.getCell(6).border = { bottom: { style: 'thin' }, right: { style: 'thin' } }
              iteratorRow.getCell(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00b050' }
              }
              break;
          }
          
          iteratorRow.commit();
        }
    
        for (let index = 78; index <= 80; index++) {
          const iteratorRow = worksheet.getRow(index);
          iteratorRow.getCell(1).alignment = { vertical: 'middle', wrapText: true };
          switch (index) {
            case 78:
              iteratorRow.getCell(1).value = 'Cuando se cumple con el ítem del estándar la calificación será la máxima del respectivo ítem, de lo contrario su calificación será igual a cero (0).'
              iteratorRow.getCell(1).border = { left: { style: 'thin' },top: { style: 'thin' }, right: { style: 'thin' } }
              iteratorRow.getCell(1).font = { name: 'Calibri', family: 4, size: 11}
              break;
            case 79:
              iteratorRow.getCell(1).value = 'Si el estándar No Aplica, se deberá justificar la situación y se calificará con el porcentaje máximo del ítem indicado para cada estándar. En caso de no justificarse, la calificación el estándar será igual a cero (0)'
              iteratorRow.getCell(1).border = {  left: { style: 'thin' },right: { style: 'thin' } }
              iteratorRow.getCell(1).font = { name: 'Calibri', family: 4, size: 11}
              break;
            case 80:
              iteratorRow.getCell(1).value = 'El presente formulario es documento público, no se debe consignar hecho o manifestaciones falsas y está sujeto a las sanciones establecidas en los artículos 288 y 294 de la Ley 599 de 2000 (Código Penal Colombiano)'
              iteratorRow.getCell(1).border = { bottom: { style: 'thin' }, left: { style: 'thin' },right: { style: 'thin' } }
              iteratorRow.getCell(1).font = { name: 'Calibri', family: 4, size: 11, bold:true}
              break;
          }
          
          iteratorRow.commit();
        }
    
        //#endregion
        
        //Agregar Imagen
        let logo = workbook.addImage({
          base64: res,
          extension: 'png',
        });
        worksheet.addImage(logo, 'B1:C3');
    
        //Setear el titulo a la combinación de celdas por su fila y columna
        const titleRow = worksheet.getRow(1);
        titleRow.getCell(4).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        titleRow.getCell(4).value = title;
        titleRow.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        titleRow.commit();
        titleRow.font = { name: 'Calibri', family: 4, size: 12, bold: true }
        //Blank Row 
        worksheet.addRow([]);
        worksheet.addRow([]);
        //Footer Row
       
    
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          FileSaver.saveAs(blob, 'EvaluaciónSGSST.xlsx');
        })
    }) 
    
  }

  public generateQuestionsFormat(dataHeader:any, dataSQA:any, dataVersion:any, dataComp:any) {
    console.log(dataHeader);
    console.log(dataComp);
    
    //Crear workbook, hoja (worksheet) y ajustar el tamaño de la hoja para imprimirla en una sola hoja
    const workbook = new Workbook();
 
    this.uploadservice.dowloadFile(dataComp.logoComp).then(res=>{
      const worksheet = workbook.addWorksheet(`${dataHeader.nameFormat}`,{
        pageSetup:{fitToPage:true,fitToHeight:1,fitToWidth:1}
      });
      // console.log(dataComp.logoComp);      
      // console.log(res);
      //Agregar Imagen
      let logo = workbook.addImage({
        base64: res,
        extension: 'png',
      });
      worksheet.addImage(logo, 'A1:B3'); 
      //Combinaciones de celdas en un objeto
      const merges = [
        {merge:'A1:B3'},
        {merge:'C1:E3'},
        {merge:'A5:C5'},
        {merge:'E5:G5'},
      ]
  
      //recorrer el objeto para ejecutar las combinaciones
      merges.forEach(element => {
        worksheet.mergeCells(element.merge); 
      });
  
      //dar ancho a las columnas
      worksheet.getColumn(3).width = 35;
      worksheet.getColumn(4).width = 40;
      worksheet.getColumn(5).width = 35;
      worksheet.getColumn(7).width = 15;
  
      let options = dataVersion.dateCreated.split('T');
      let fechaFinal = options[0].split('-')
  
      const dataStatic = [
        {value:'',row:1,column:1,color:false},
        {value:`${dataHeader.nameFormat}`,row:1,column:3,color:false},
        {value:'Código',row:1,column:6,color:false},
        {value:'Versión',row:2,column:6,color:false},
        {value:'Fecha',row:3,column:6,color:false},
        {value:`${dataVersion.codVersion}`,row:1,column:7,color:false},
        {value:`${dataVersion.version}`,row:2,column:7,color:false},
        {value:`${fechaFinal}`,row:3,column:7,color:false},
        {value:'Secciones',row:5,column:1,color:true},
        {value:'preguntas',row:5,column:4,color:true},
        {value:'Respuestas',row:5,column:5,color:true}
      ]
  
      dataStatic.forEach(element => {
        const titleRow = worksheet.getRow(element.row);
        if (element.color) {
           titleRow.getCell(element.column).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '37474f' }
          }
          titleRow.font = { name: 'Calibri', family: 4, size: 12, bold: true, color: {argb: 'FFFFFF'} } 
        }else{
          titleRow.font = { name: 'Calibri', family: 4, size: 12, bold: true } 
        }
        titleRow.getCell(element.column).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        titleRow.getCell(element.column).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        titleRow.getCell(element.column).value = element.value;
        titleRow.commit();
       
      });
  
      let contRow = 6
      dataSQA.forEach(element => {
        let inicio = 0
        let final = 0
        if (element.questions.length > 1) {
          inicio = contRow
          const iterateRow2 = worksheet.getRow(contRow);         
          element.questions.forEach(ques => {
            worksheet.mergeCells(`E${contRow}:G${contRow}`);
            const iterateRow = worksheet.getRow(contRow);
            iterateRow.getCell(4).value = ques.name_ques;
            iterateRow.getCell(4).alignment = { vertical: 'middle', wrapText: true };
            iterateRow.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            iterateRow.getCell(5).value = ques.res_ques;
            iterateRow.getCell(5).alignment = { vertical: 'middle', wrapText: true };
            iterateRow.getCell(5).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            contRow++
          });
          final = contRow
          //worksheet.mergeCells(`A${contRow}:C${contRow}`);
          worksheet.mergeCells(`A${inicio}:C${final-1}`);        
          iterateRow2.getCell(1).value = element.name_sec;
          iterateRow2.getCell(1).font = { name: 'Calibri', family: 4, size: 12, bold: true } 
          iterateRow2.getCell(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          iterateRow2.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          
        } else {
          const iterateRow2 = worksheet.getRow(contRow);
          worksheet.mergeCells(`A${contRow}:C${contRow}`);
            iterateRow2.getCell(1).value = element.name_sec;
            iterateRow2.getCell(1).font = { name: 'Calibri', family: 4, size: 12, bold: true } 
            iterateRow2.getCell(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            iterateRow2.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          element.questions.forEach(ques => {
            worksheet.mergeCells(`E${contRow}:G${contRow}`);
            const iterateRow = worksheet.getRow(contRow);
            iterateRow.getCell(4).value = ques.name_ques;
            iterateRow.getCell(4).alignment = { vertical: 'middle', wrapText: true };
            iterateRow.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            iterateRow.getCell(5).value = ques.res_ques;
            iterateRow.getCell(5).alignment = { vertical: 'middle', wrapText: true };
            iterateRow.getCell(5).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            contRow++
          });
        }
      });
  
  
      // Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, `${dataHeader.nameFormat}.xlsx`);
      })
    })    

  }

  public generateAllQuestions(dataGeneral:any, dataCompany:any, dataVersion:any, logo:string){
    console.log('SeccionesP: ',logo);
    //console.log('header: ',);
    //console.log('version: ',dataVersion);
    //Crear workbook, hoja (worksheet) y ajustar el tamaño de la hoja para imprimirla en una sola hoja
    const workbook = new Workbook();
    this.uploadservice.dowloadFile(logo).then(res=>{
      const worksheet = workbook.addWorksheet(`Reporte General`,{
        pageSetup:{fitToPage:true,fitToHeight:1,fitToWidth:1,orientation:'landscape'}
      });
  
      //Combinaciones de celdas en un objeto
      const merges = [
        {merge:'A1:A3'},
        {merge:'B1:F3'},
        {merge:'A5:H5'},
      ]
  
      //recorrer el objeto para ejecutar las combinaciones
      merges.forEach(element => {
        worksheet.mergeCells(element.merge); 
      });

      //Agregar Imagen
      let logo = workbook.addImage({
        base64: res,
        extension: 'png',
      });
      worksheet.addImage(logo, 'A1:A3');
  
      //dar ancho a las columnas
      worksheet.getColumn(1).width = 30;
      worksheet.getColumn(2).width = 30;
      worksheet.getColumn(3).width = 30;
      worksheet.getColumn(4).width = 30;
      worksheet.getColumn(5).width = 30;
      worksheet.getColumn(6).width = 30;
      worksheet.getColumn(7).width = 30;
      worksheet.getColumn(8).width = 30;
  
      worksheet.autoFilter = {
        from: 'A6',
        to: 'H6',
      }
  
      let options = dataVersion.dateCreated.split('T');
      let fechaFinal = options[0].split('-')
  
      const dataHeader = [
        {value:'',row:1,column:1,color:false},
        {value:'Reporte General del Formato',row:1,column:2,color:false},
        {value:'Código',row:1,column:7,color:false},
        {value:'Versión',row:2,column:7,color:false},
        {value:'Fecha',row:3,column:7,color:false},
        {value:`${dataVersion.codVersion}`,row:1,column:8,color:false},
        {value:`${dataVersion.version}`,row:2,column:8,color:false},
        {value:`${fechaFinal}`,row:3,column:8,color:false}
      ]
  
      dataHeader.forEach(element => {
        const titleRow = worksheet.getRow(element.row);
        if (element.column == 5) {
          titleRow.getCell(element.column).alignment = { vertical: 'middle', wrapText: true };
          //titleRow.font = { name: 'Calibri', family: 4, size: 12, bold: true, color: {argb: 'FFFFFF'} } 
        }else{
          titleRow.getCell(element.column).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
        titleRow.font = { name: 'Calibri', family: 4, size: 12, bold: true } 
        titleRow.getCell(element.column).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        titleRow.getCell(element.column).value = element.value;
        titleRow.commit();
       
      });
  
      const dataInfo = [
        {value:'Información del Formato',row:5,column:1,color:false},
        {value:'Fecha de inicio del diligenciamiento',row:6,column:1,color:false},
        {value:'Fecha final de diligenciamiento',row:6,column:2,color:false},
        {value:'Nombre de la empresa',row:6,column:3,color:false},
        {value:'Usuario quien diligenció',row:6,column:4,color:false},
        {value:'Puesto de trabajo',row:6,column:5,color:false},
        {value:'Secciones',row:6,column:6,color:false},
        {value:'Preguntas',row:6,column:7,color:false},
        {value:'Repuestas',row:6,column:8,color:false},
      ]
  
      dataInfo.forEach(element => {
        const titleRow = worksheet.getRow(element.row);
        titleRow.getCell(element.column).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '37474f' }
        }
        titleRow.getCell(element.column).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        titleRow.font = { name: 'Calibri', family: 4, size: 12, bold: true, color: {argb: 'FFFFFF'} } 
        titleRow.getCell(element.column).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        titleRow.getCell(element.column).value = element.value;
        titleRow.commit();
      });
  
      let generalinfo = []
      let secciones = []
      dataGeneral.forEach(element => {
        element.forEach(elemento => {
          let init_date_rf = '', fin_date_rf = '', name_comp = '', name_user = '', name_workplace = ''
          for (let j = 0; j < dataCompany.length; j++) {
            if ( dataCompany[j]['id_rf'] == elemento.id_rf) {
              init_date_rf = dataCompany[j]['init_date_rf']
              fin_date_rf = dataCompany[j]['fin_date_rf']
              name_comp = dataCompany[j]['name_comp']
              name_user = dataCompany[j]['name_user'] + dataCompany[j]['lastname_user']
              name_workplace = dataCompany[j]['name_workplace']
            }
          }
          for (let i = 0; i < elemento.questions.length; i++) {
            let ques = ''
            if (elemento.questions[i]['type_ques']== "radio_button_checked" || elemento.questions[i]['type_ques']== "collaborator") {
              ques = 'res_ques_' + elemento.questions[i]['id_ques']
            }else if (elemento.questions[i]['type_ques'] == "check_box") {
              ques = 'res_ques_' + elemento.questions[i]['id_ques']
            }else if (elemento.questions[i]['type_ques'] == "arrow_drop_down_circle") {
              ques = 'res_ques_' + elemento.questions[i]['id_ques']
            }else{
              ques = 'ques_' + elemento.questions[i]['id_ques']
            }          
            elemento.questions[i]['respuesta'] = elemento.responses[0][ques]
            elemento.questions[i]['init_date_rf'] = init_date_rf
            elemento.questions[i]['fin_date_rf'] = fin_date_rf
            elemento.questions[i]['name_comp'] = name_comp
            elemento.questions[i]['name_user'] = name_user
            elemento.questions[i]['name_workplace'] = name_workplace
            elemento.questions[i]['id_rf'] = elemento.id_rf
            elemento.questions[i]['id_sec'] = elemento.id_sec
            elemento.questions[i]['name_sec'] = elemento.name_sec
            generalinfo.push(elemento.questions[i])
          }
          secciones.push({ id_sec: elemento.id_sec,name_sec: elemento.name_sec,
            question: elemento.questions, cantiques: elemento.questions.length})
        });
      });
  
      let cont = 7, paintData = []
      generalinfo.forEach(element => {
        let options = element.init_date_rf.split('T');
        let hora = options[1].split('.')
        let fechaFinal = options[0].split('-')
        let options2 = element.fin_date_rf.split('T');
        let hora2 = options2[1].split('.')
        let fechaFinal2 = options2[0].split('-')
        paintData.push(
          {value:'Fecha: '+fechaFinal+' /Hora: '+hora[0], row: cont, column: 1 },
          {value:'Fecha: '+fechaFinal2+' /Hora: '+hora2[0], row: cont, column: 2 },
          {value:element.name_comp, row: cont, column: 3 },
          {value:element.name_user, row: cont, column: 4 },
          {value:element.name_workplace, row: cont, column: 5 },
          {value:element.name_sec, row: cont, column: 6 },
          {value:element.name_ques, row: cont, column: 7 },
          {value:element.respuesta, row: cont, column: 8 },
          )
          cont++
      });
  
      paintData.forEach(element => {
        const iteratorRow = worksheet.getRow(element.row);
        if (element.column == 1 && element.column == 2) {
          iteratorRow.getCell(element.column).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }else{
          iteratorRow.getCell(element.column).alignment = { vertical: 'middle', wrapText: true };
        }
        iteratorRow.font = { name: 'Calibri', family: 4, size: 12 } 
        iteratorRow.getCell(element.column).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        iteratorRow.getCell(element.column).value = element.value;
        iteratorRow.commit();
      });
      
      /* let hash = {};
      let array = secciones.filter(o => hash[o.id_sec] ? false : hash[o.id_sec] = true);
      console.log('jona',array); */
  
      //Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, `Reporte_General.xlsx`);
      })
    })
  }
}
